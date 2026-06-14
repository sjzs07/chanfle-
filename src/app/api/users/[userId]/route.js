import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET(req, { params }) {
  const { userId: targetUserId } = await params;
  const { userId: currentUserId } = await auth();

  const db = getDb();

  const { rows: userRows } = await db.query(
    "SELECT id, username, avatar_url AS \"avatarUrl\" FROM users WHERE id = $1",
    [targetUserId]
  );

  if (!userRows.length) return Response.json({ error: "Not found" }, { status: 404 });

  const [followersRes, followingRes, videosRes] = await Promise.all([
    db.query("SELECT COUNT(*) AS count FROM follows WHERE following_id = $1", [targetUserId]),
    db.query("SELECT COUNT(*) AS count FROM follows WHERE follower_id = $1", [targetUserId]),
    db.query("SELECT COUNT(*) AS count FROM videos WHERE user_id = $1", [targetUserId]),
  ]);

  let isFollowing = false;
  let isMutualFollow = false;

  if (currentUserId && currentUserId !== targetUserId) {
    const { rows: followRows } = await db.query(
      `SELECT
         EXISTS(SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2) AS "iFollow",
         EXISTS(SELECT 1 FROM follows WHERE follower_id=$2 AND following_id=$1) AS "theyFollow"`,
      [currentUserId, targetUserId]
    );
    isFollowing = followRows[0].iFollow;
    isMutualFollow = followRows[0].iFollow && followRows[0].theyFollow;
  }

  return Response.json({
    user: {
      ...userRows[0],
      followersCount: parseInt(followersRes.rows[0].count),
      followingCount: parseInt(followingRes.rows[0].count),
      videosCount: parseInt(videosRes.rows[0].count),
      isFollowing,
      isMutualFollow,
      isOwnProfile: currentUserId === targetUserId,
    },
  });
}
