import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId, videoUrl, thumbnailUrl, duration, title, description, tags } =
      await request.json();

    if (!publicId || !videoUrl || !title) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await currentUser();
    const db = getDb();

    // Upsert user to satisfy FK constraint
    await db.query(
      `INSERT INTO users (id, username, email, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         username   = EXCLUDED.username,
         email      = EXCLUDED.email,
         avatar_url = EXCLUDED.avatar_url`,
      [
        userId,
        user?.username || user?.firstName || "user",
        user?.emailAddresses?.[0]?.emailAddress || "",
        user?.imageUrl || "",
      ]
    );

    // Insert video
    await db.query(
      `INSERT INTO videos (id, user_id, title, description, tags, video_url, thumbnail_url, duration, views, likes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0)`,
      [
        publicId,
        userId,
        title,
        description || "",
        tags || [],
        videoUrl,
        thumbnailUrl || "",
        Math.ceil(duration || 0),
      ]
    );

    return Response.json({ success: true, videoId: publicId });
  } catch (err) {
    console.error("Save error:", err);
    return Response.json({ error: err.message || "Save failed" }, { status: 500 });
  }
}
