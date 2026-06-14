import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

// GET — fetch messages, mark incoming ones as read
export async function GET(req, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();

  // Verify user is part of this conversation
  const { rows: conv } = await db.query(
    "SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
    [id, userId]
  );
  if (!conv.length) return Response.json({ error: "Not found" }, { status: 404 });

  // Mark incoming messages as read
  await db.query(
    "UPDATE messages SET is_read = TRUE WHERE conversation_id = $1 AND sender_id != $2",
    [id, userId]
  );

  // Fetch messages with optional video info
  const { rows: messages } = await db.query(
    `SELECT
       m.id, m.sender_id AS "senderId", m.content,
       m.is_read AS "isRead", m.created_at AS "createdAt",
       v.id AS "videoId", v.title AS "videoTitle",
       v.thumbnail_url AS "videoThumbnail"
     FROM messages m
     LEFT JOIN videos v ON v.id = m.video_id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [id]
  );

  const otherId = conv[0].user1_id === userId ? conv[0].user2_id : conv[0].user1_id;
  const { rows: otherUser } = await db.query(
    "SELECT id, username, avatar_url AS \"avatarUrl\" FROM users WHERE id = $1",
    [otherId]
  );

  return Response.json({ messages, otherUser: otherUser[0] || null, conversationId: id });
}
