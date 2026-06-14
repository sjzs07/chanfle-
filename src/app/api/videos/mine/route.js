import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const { rows } = await db.query(
      `SELECT
        id, title, description, tags,
        video_url    AS "videoUrl",
        thumbnail_url AS "thumbnailUrl",
        duration, views, likes,
        created_at   AS "createdAt",
        user_id      AS "authorId"
       FROM videos
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return Response.json({ videos: rows });
  } catch (err) {
    console.error("Failed to fetch user videos:", err);
    return Response.json({ videos: [] });
  }
}
