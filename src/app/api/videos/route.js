import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const { rows } = await db.query(`
      SELECT
        v.id, v.title, v.description, v.tags,
        v.video_url    AS "videoUrl",
        v.thumbnail_url AS "thumbnailUrl",
        v.duration, v.views, v.likes,
        v.created_at   AS "createdAt",
        u.username     AS "authorName",
        u.avatar_url   AS "authorAvatar"
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
    `);
    return Response.json({ videos: rows });
  } catch (err) {
    console.error("Failed to fetch videos:", err);
    return Response.json({ videos: [] });
  }
}
