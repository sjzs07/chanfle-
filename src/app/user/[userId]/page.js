"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatViews, timeAgo } from "@/lib/mockData";

function normalizeVideo(v) {
  return {
    id: v.id,
    title: v.title,
    thumbnailUrl: v.thumbnailUrl || `https://picsum.photos/seed/${v.id}/640/360`,
    duration: v.duration ? `0:${String(v.duration).padStart(2, "0")}` : "0:30",
    views: v.views || 0,
    likes: v.likes || 0,
    createdAt: v.createdAt || new Date().toISOString(),
  };
}

export default function UserProfilePage({ params }) {
  const { userId } = use(params);
  const { userId: currentUserId, isSignedIn } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [isMutualFollow, setIsMutualFollow] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${userId}`).then((r) => r.json()),
      fetch(`/api/videos?userId=${userId}`).then((r) => r.json()),
    ])
      .then(([userData, videosData]) => {
        if (userData.user) {
          setProfile(userData.user);
          setFollowing(userData.user.isFollowing);
          setIsMutualFollow(userData.user.isMutualFollow);
          setFollowersCount(userData.user.followersCount);
        }
        setVideos((videosData.videos || []).map(normalizeVideo));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleFollow() {
    if (!isSignedIn || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const data = await res.json();
      setFollowing(data.following);
      setFollowersCount(data.followersCount);
      // Recalculate mutual follow after state changes
      setIsMutualFollow(data.following && (profile?.isFollowing || false));
      // Re-fetch to get accurate mutual follow status
      const updated = await fetch(`/api/users/${userId}`).then((r) => r.json());
      if (updated.user) setIsMutualFollow(updated.user.isMutualFollow);
    } catch {}
    setFollowLoading(false);
  }

  async function handleMessage() {
    if (!isSignedIn || msgLoading) return;
    setMsgLoading(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      const data = await res.json();
      if (data.conversationId) router.push(`/messages/${data.conversationId}`);
    } catch {}
    setMsgLoading(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 animate-pulse">
        <div className="flex items-center gap-6 mb-10">
          <div className="h-24 w-24 rounded-full bg-[#1a1a24]" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-48 rounded bg-[#1a1a24]" />
            <div className="h-3 w-32 rounded bg-[#1a1a24]" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">😵</div>
        <h1 className="text-2xl font-bold">User not found</h1>
        <Link href="/" className="text-[#ff3b5c] hover:underline">Back to home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Profile header */}
      <div className="mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={profile.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`}
          alt={profile.username}
          className="h-24 w-24 rounded-full border-4 border-[#ff3b5c] bg-[#2a2a3a] object-cover"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-black">{profile.username || "Chanfle User"}</h1>

          <div className="mt-4 flex flex-wrap gap-8 justify-center sm:justify-start">
            {[
              { label: "Videos",    value: profile.videosCount },
              { label: "Followers", value: followersCount },
              { label: "Following", value: profile.followingCount },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black">{s.value.toLocaleString()}</div>
                <div className="text-xs text-[#6b6b80] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap justify-center">
          {isOwnProfile ? (
            <Link
              href="/profile"
              className="rounded-full border border-[#2a2a3a] px-5 py-2 text-sm font-semibold text-[#f0f0f5] hover:border-[#ff3b5c] transition-colors"
            >
              Edit profile
            </Link>
          ) : isSignedIn ? (
            <>
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all disabled:opacity-60 ${
                  following
                    ? "border border-[#2a2a3a] text-[#f0f0f5] hover:border-red-500 hover:text-red-400"
                    : "bg-[#ff3b5c] text-white hover:bg-[#e0304f]"
                }`}
              >
                {followLoading ? "..." : following ? "Following" : "Follow"}
              </button>

              {isMutualFollow ? (
                <button
                  onClick={handleMessage}
                  disabled={msgLoading}
                  className="rounded-full border border-[#2a2a3a] px-5 py-2 text-sm font-semibold text-[#f0f0f5] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  <span>💬</span> {msgLoading ? "..." : "Message"}
                </button>
              ) : following ? (
                <div className="rounded-full border border-[#2a2a3a] px-5 py-2 text-xs text-[#6b6b80] flex items-center gap-1.5">
                  💬 <span>Follow each other to chat</span>
                </div>
              ) : null}
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-[#ff3b5c] px-6 py-2 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
            >
              Follow
            </Link>
          )}
        </div>
      </div>

      {/* Videos */}
      <div>
        <h2 className="text-xl font-bold mb-6">Videos 🎬</h2>
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
            <div className="text-5xl mb-4">🎥</div>
            <p className="text-[#6b6b80]">No videos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1a24]">
                  <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-mono text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">{video.title}</h3>
                  <p className="text-xs text-[#6b6b80] mt-0.5">{formatViews(video.views)} views · {timeAgo(video.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
