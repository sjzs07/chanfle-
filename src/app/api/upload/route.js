import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { getDb } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const tagsRaw = formData.get("tags") || "";

    if (!file || !title) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "chanfle",
            transformation: [{ duration: "60" }],
          },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const db = getDb();
    await db.query(
      `INSERT INTO videos (id, user_id, title, description, tags, video_url, thumbnail_url, duration, views, likes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0)`,
      [
        uploadResult.public_id,
        userId,
        title,
        description,
        tags,
        uploadResult.secure_url,
        uploadResult.secure_url.replace("/upload/", "/upload/so_0/").replace(".mp4", ".jpg"),
        Math.ceil(uploadResult.duration),
      ]
    );

    return Response.json({ success: true, videoId: uploadResult.public_id });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
