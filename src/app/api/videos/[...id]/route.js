import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  const { id: segments } = await params;
  const fullId = Array.isArray(segments) ? segments.join("/") : segments;

  try {
    const db = getDb();
    await db.query(`UPDATE videos SET views = views + 1 WHERE id = $1`, [fullId]);

    const { rows } = await db.query(
      `SELECT
        v.id, v.title, v.description, v.tags,
        v.video_url     AS "videoUrl",
        v.thumbnail_url AS "thumbnailUrl",
        v.duration, v.views, v.likes,
        v.created_at    AS "createdAt",
        u.username      AS "authorName",
        u.avatar_url    AS "authorAvatar"
       FROM videos v
       LEFT JOIN users u ON v.user_id = u.id
       WHERE v.id = $1`,
      [fullId]
    );

    if (!rows.length) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ video: rows[0] });
  } catch (err) {
    console.error("Failed to fetch video:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
