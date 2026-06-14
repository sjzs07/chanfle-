import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

// GET — list all conversations for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const { rows } = await db.query(
    `SELECT
       c.id,
       c.created_at AS "createdAt",
       -- the other person
       CASE WHEN c.user1_id = $1 THEN c.user2_id ELSE c.user1_id END AS "otherId",
       CASE WHEN c.user1_id = $1 THEN u2.username ELSE u1.username END AS "otherName",
       CASE WHEN c.user1_id = $1 THEN u2.avatar_url ELSE u1.avatar_url END AS "otherAvatar",
       -- last message
       m.content AS "lastContent",
       m.video_id AS "lastVideoId",
       m.created_at AS "lastAt",
       m.sender_id  AS "lastSenderId",
       -- unread count (messages sent by the other person that I haven't read)
       (SELECT COUNT(*) FROM messages msg
        WHERE msg.conversation_id = c.id
          AND msg.sender_id != $1
          AND msg.is_read = FALSE) AS "unread"
     FROM conversations c
     JOIN users u1 ON u1.id = c.user1_id
     JOIN users u2 ON u2.id = c.user2_id
     LEFT JOIN LATERAL (
       SELECT content, video_id, created_at, sender_id
       FROM messages
       WHERE conversation_id = c.id
       ORDER BY created_at DESC
       LIMIT 1
     ) m ON TRUE
     WHERE c.user1_id = $1 OR c.user2_id = $1
     ORDER BY COALESCE(m.created_at, c.created_at) DESC`,
    [userId]
  );
  return Response.json({ conversations: rows });
}

// POST — create or get existing conversation (mutual follow required)
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();
  if (!targetUserId || targetUserId === userId) {
    return Response.json({ error: "Invalid target" }, { status: 400 });
  }

  const db = getDb();

  // Check mutual follow
  const { rows: followRows } = await db.query(
    `SELECT
       EXISTS(SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2) AS "iFollow",
       EXISTS(SELECT 1 FROM follows WHERE follower_id=$2 AND following_id=$1) AS "theyFollow"`,
    [userId, targetUserId]
  );
  const { iFollow, theyFollow } = followRows[0];
  if (!iFollow || !theyFollow) {
    return Response.json({ error: "You must follow each other to chat" }, { status: 403 });
  }

  // Always store lower ID as user1_id to avoid duplicates
  const [u1, u2] = [userId, targetUserId].sort();

  const { rows } = await db.query(
    `INSERT INTO conversations (user1_id, user2_id)
     VALUES ($1, $2)
     ON CONFLICT (user1_id, user2_id) DO UPDATE SET user1_id = EXCLUDED.user1_id
     RETURNING id`,
    [u1, u2]
  );
  return Response.json({ conversationId: rows[0].id });
}
