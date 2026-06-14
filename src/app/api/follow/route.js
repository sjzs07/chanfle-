import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();
  if (!targetUserId || targetUserId === userId) {
    return Response.json({ error: "Invalid target" }, { status: 400 });
  }

  const db = getDb();

  const { rows: existing } = await db.query(
    "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2",
    [userId, targetUserId]
  );

  if (existing.length > 0) {
    await db.query(
      "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
      [userId, targetUserId]
    );
  } else {
    await db.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, targetUserId]
    );
  }

  const following = existing.length === 0;

  const { rows: countRows } = await db.query(
    "SELECT COUNT(*) AS count FROM follows WHERE following_id = $1",
    [targetUserId]
  );

  return Response.json({ following, followersCount: parseInt(countRows[0].count) });
}
