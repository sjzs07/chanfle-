import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function POST(req, { params }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { content, videoId } = await req.json();

  if (!content?.trim() && !videoId) {
    return Response.json({ error: "Empty message" }, { status: 400 });
  }

  const db = getDb();

  // Verify user is in this conversation
  const { rows: conv } = await db.query(
    "SELECT id FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
    [id, userId]
  );
  if (!conv.length) return Response.json({ error: "Not found" }, { status: 404 });

  const { rows } = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, content, video_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, sender_id AS "senderId", content, video_id AS "videoId", is_read AS "isRead", created_at AS "createdAt"`,
    [id, userId, content?.trim() || null, videoId || null]
  );

  return Response.json({ message: rows[0] });
}
