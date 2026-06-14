import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const { rows } = await db.query(
    `SELECT
       v.id, v.title, v.description, v.tags,
       v.video_url     AS "videoUrl",
       v.thumbnail_url AS "thumbnailUrl",
       v.duration, v.views, v.likes,
       v.created_at    AS "createdAt",
       v.user_id       AS "authorId",
       u.username      AS "authorName",
       u.avatar_url    AS "authorAvatar"
     FROM videos v
     JOIN follows f ON f.following_id = v.user_id
     LEFT JOIN users u ON v.user_id = u.id
     WHERE f.follower_id = $1
     ORDER BY v.created_at DESC`,
    [userId]
  );
  return Response.json({ videos: rows });
}
