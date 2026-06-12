"use client";

import { useState, use } from "react";
import { mockVideos, mockComments, formatViews, timeAgo } from "@/lib/mockData";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function VideoPage({ params }) {
  const { id } = use(params);
  const video = mockVideos.find((v) => v.id === id);
  const { isSignedIn, user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video?.likes ?? 0);
  const [comments, setComments] = useState(
    mockComments.filter((c) => c.videoId === id)
  );
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  if (!video) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">😵</div>
        <h1 className="text-2xl font-bold">Video not found</h1>
        <Link href="/" className="text-[#ff3b5c] hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  function handleLike() {
    if (!isSignedIn) return;
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim() || !isSignedIn) return;
    setComments((prev) => [
      {
        id: `c${Date.now()}`,
        videoId: id,
        author: user.fullName || user.username || "You",
        avatarUrl: user.imageUrl,
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setCommentText("");
  }

  const related = mockVideos.filter((v) => v.id !== id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="h-full w-full"
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Title & meta */}
          <h1 className="mt-4 text-xl font-black leading-snug">{video.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6b6b80]">
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>

          {/* Action bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Author */}
            <div className="flex items-center gap-2 mr-2">
              <img
                src={video.author.avatarUrl}
                alt={video.author.name}
                className="h-9 w-9 rounded-full bg-[#2a2a3a]"
              />
              <span className="font-semibold text-sm">{video.author.name}</span>
            </div>

            {/* Like */}
            <button
              onClick={handleLike}
              disabled={!isSignedIn}
              title={!isSignedIn ? "Log in to like" : ""}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                liked
                  ? "bg-[#ff3b5c] text-white"
                  : "border border-[#2a2a3a] bg-[#1a1a24] text-[#6b6b80] hover:border-[#ff3b5c] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {liked ? "❤️" : "🤍"} {formatViews(likeCount)}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm font-semibold text-[#6b6b80] hover:border-[#ff3b5c] transition-colors"
            >
              {copied ? "✅ Copied!" : "🔗 Share"}
            </button>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-3 py-1 text-xs text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-4 text-sm text-[#6b6b80]">
            {video.description}
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">
              💬 {comments.length} Comment{comments.length !== 1 ? "s" : ""}
            </h2>

            {/* Comment form */}
            {isSignedIn ? (
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                <img
                  src={user.imageUrl}
                  alt="You"
                  className="h-9 w-9 rounded-full shrink-0 bg-[#2a2a3a]"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="rounded-full bg-[#ff3b5c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e0304f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-4 text-sm text-[#6b6b80] text-center">
                <Link href="/sign-in" className="text-[#ff3b5c] hover:underline">
                  Log in
                </Link>{" "}
                to leave a comment
              </div>
            )}

            {/* Comment list */}
            <div className="flex flex-col gap-4">
              {comments.length === 0 && (
                <p className="text-sm text-[#6b6b80] text-center py-8">
                  No comments yet. Be the first to drop a laugh! 😂
                </p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img
                    src={c.avatarUrl}
                    alt={c.author}
                    className="h-8 w-8 rounded-full shrink-0 bg-[#2a2a3a]"
                  />
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

        {/* Sidebar — Related videos */}
        <div className="w-full lg:w-80 shrink-0">
          <h2 className="text-base font-bold mb-4">More funny stuff 🔥</h2>
          <div className="flex flex-col gap-4">
            {related.map((v) => (
              <Link key={v.id} href={`/video/${v.id}`} className="group flex gap-3">
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-[#1a1a24]">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-mono text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">
                    {v.title}
                  </p>
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
