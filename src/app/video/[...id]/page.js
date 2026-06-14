"use client";

import { useState, use, useEffect } from "react";
import { mockVideos, mockComments, formatViews, timeAgo } from "@/lib/mockData";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ShareModal from "@/components/ShareModal";

function normalizeDbVideo(v) {
  return {
    id: v.id,
    title: v.title,
    description: v.description || "",
    thumbnailUrl: v.thumbnailUrl || "",
    videoUrl: v.videoUrl,
    duration: v.duration ? `0:${String(v.duration).padStart(2, "0")}` : "0:30",
    views: v.views || 0,
    likes: v.likes || 0,
    tags: v.tags || [],
    author: {
      name: v.authorName || "Chanfle User",
      avatarUrl: v.authorAvatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${v.id}`,
    },
    createdAt: v.createdAt || new Date().toISOString(),
  };
}

export default function VideoPage({ params }) {
  // Catch-all: params.id is an array e.g. ['chanfle', 'abc123'] or ['1']
  const { id: segments } = use(params);
  const fullId = Array.isArray(segments) ? segments.join("/") : segments;

  const { isSignedIn, user } = useUser();

  const mockVideo = mockVideos.find((v) => v.id === fullId);
  const [video, setVideo] = useState(mockVideo || null);
  const [loading, setLoading] = useState(!mockVideo);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mockVideo?.likes ?? 0);
  const [comments, setComments] = useState(mockComments.filter((c) => c.videoId === fullId));
  const [commentText, setCommentText] = useState("");
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (mockVideo) return; // already loaded from mock data

    // Encode each segment individually so slashes become %2F in the query
    const encodedId = segments.map(encodeURIComponent).join("/");
    fetch(`/api/videos/${encodedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.video) {
          const normalized = normalizeDbVideo(data.video);
          setVideo(normalized);
          setLikeCount(normalized.likes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fullId]);

  function handleLike() {
    if (!isSignedIn) return;
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  async function handleShare() {
    const shareUrl = window.location.href;
    // Use native share sheet on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({ title: video?.title, text: `😂 ${video?.title} - via Chanfle`, url: shareUrl });
        return;
      } catch {}
    }
    // Fallback: open custom share modal
    setShowShare(true);
  }

  function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim() || !isSignedIn) return;
    setComments((prev) => [
      {
        id: `c${Date.now()}`,
        videoId: fullId,
        author: user.fullName || user.username || "You",
        avatarUrl: user.imageUrl,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setCommentText("");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="aspect-video w-full rounded-2xl bg-[#1a1a24] animate-pulse" />
        <div className="mt-4 h-6 w-2/3 rounded bg-[#1a1a24] animate-pulse" />
        <div className="mt-2 h-4 w-1/3 rounded bg-[#1a1a24] animate-pulse" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">😵</div>
        <h1 className="text-2xl font-bold">Video not found</h1>
        <Link href="/" className="text-[#ff3b5c] hover:underline">Back to home</Link>
      </div>
    );
  }

  const related = mockVideos.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {showShare && (
        <ShareModal
          url={typeof window !== "undefined" ? window.location.href : ""}
          title={video.title}
          onClose={() => setShowShare(false)}
        />
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <video src={video.videoUrl} controls autoPlay className="h-full w-full" poster={video.thumbnailUrl} />
          </div>

          <h1 className="mt-4 text-xl font-black leading-snug">{video.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6b6b80]">
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>

          {/* Action bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <img src={video.author.avatarUrl} alt={video.author.name} className="h-9 w-9 rounded-full bg-[#2a2a3a]" />
              <span className="font-semibold text-sm">{video.author.name}</span>
            </div>
            <button
              onClick={handleLike}
              disabled={!isSignedIn}
              title={!isSignedIn ? "Log in to like" : ""}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                liked ? "bg-[#ff3b5c] text-white" : "border border-[#2a2a3a] bg-[#1a1a24] text-[#6b6b80] hover:border-[#ff3b5c] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {liked ? "❤️" : "🤍"} {formatViews(likeCount)}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm font-semibold text-[#6b6b80] hover:border-[#ff3b5c] transition-colors"
            >
              🔗 Share
            </button>
          </div>

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${tag}`} className="rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-3 py-1 text-xs text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Description */}
          {video.description && (
            <div className="mt-4 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-4 text-sm text-[#6b6b80]">
              {video.description}
            </div>
          )}

          {/* Comments */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">💬 {comments.length} Comment{comments.length !== 1 ? "s" : ""}</h2>
            {isSignedIn ? (
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                <img src={user.imageUrl} alt="You" className="h-9 w-9 rounded-full shrink-0 bg-[#2a2a3a]" />
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="rounded-full bg-[#ff3b5c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e0304f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-4 text-sm text-[#6b6b80] text-center">
                <Link href="/sign-in" className="text-[#ff3b5c] hover:underline">Log in</Link> to leave a comment
              </div>
            )}
            <div className="flex flex-col gap-4">
              {comments.length === 0 && <p className="text-sm text-[#6b6b80] text-center py-8">No comments yet. Be the first! 😂</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.avatarUrl} alt={c.author} className="h-8 w-8 rounded-full shrink-0 bg-[#2a2a3a]" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{c.author}</span>
                      <span className="text-xs text-[#6b6b80]">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#c0c0d0]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <h2 className="text-base font-bold mb-4">More funny stuff 🔥</h2>
          <div className="flex flex-col gap-4">
            {related.map((v) => (
              <Link key={v.id} href={`/video/${v.id}`} className="group flex gap-3">
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-[#1a1a24]">
                  <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-mono text-white">{v.duration}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">{v.title}</p>
                  <p className="mt-1 text-xs text-[#6b6b80]">{v.author.name}</p>
                  <p className="text-xs text-[#6b6b80]">{formatViews(v.views)} views</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
