"use client";

import Link from "next/link";
import { useState } from "react";
import { formatViews, timeAgo } from "@/lib/mockData";

export default function VideoCard({ video }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);

  function handleLike(e) {
    e.preventDefault();
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  const authorHref = video.author?.id ? `/user/${video.author.id}` : null;

  return (
    <Link href={`/video/${video.id}`} className="video-card group block">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1a24]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="thumbnail-overlay absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-3xl">
            ▶
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-mono text-white">
          {video.duration}
        </span>
        {new Date(video.createdAt) > new Date(Date.now() - 86400000 * 2) && (
          <span className="pulse-glow absolute top-2 left-2 rounded-full bg-[#ff3b5c] px-2 py-0.5 text-xs font-bold text-white">
            NEW
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="mt-3 flex gap-3">
        {authorHref ? (
          <Link
            href={authorHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <img
              src={video.author.avatarUrl}
              alt={video.author.name}
              className="h-8 w-8 rounded-full bg-[#2a2a3a] hover:ring-2 hover:ring-[#ff3b5c] transition-all"
            />
          </Link>
        ) : (
          <img
            src={video.author.avatarUrl}
            alt={video.author.name}
            className="h-8 w-8 shrink-0 rounded-full bg-[#2a2a3a]"
          />
        )}

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#f0f0f5] leading-snug group-hover:text-[#ff3b5c] transition-colors">
            {video.title}
          </h3>
          {authorHref ? (
            <Link
              href={authorHref}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 text-xs text-[#6b6b80] hover:text-[#ff3b5c] transition-colors"
            >
              {video.author.name}
            </Link>
          ) : (
            <p className="mt-0.5 text-xs text-[#6b6b80]">{video.author.name}</p>
          )}
          <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6b6b80]">
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>

        <button
          onClick={handleLike}
          className="shrink-0 flex flex-col items-center gap-0.5 text-xs"
          aria-label="Like"
        >
          <span className={`text-lg transition-transform ${liked ? "scale-125" : "hover:scale-110"}`}>
            {liked ? "❤️" : "🤍"}
          </span>
          <span className={liked ? "text-[#ff3b5c] font-semibold" : "text-[#6b6b80]"}>
            {formatViews(likeCount)}
          </span>
        </button>
      </div>

      {/* Tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {video.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#1a1a24] border border-[#2a2a3a] px-2 py-0.5 text-[10px] text-[#6b6b80]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
