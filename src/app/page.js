"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { formatViews, timeAgo } from "@/lib/mockData";

const categoryMap = {
  "":          [],
  "animals":   ["animals", "cats", "dogs"],
  "babies":    ["baby", "cute"],
  "pranks":    ["pranks"],
  "dad-jokes": ["dad-jokes", "puns"],
  "fails":     ["fail", "fails"],
};

const categoryLabels = {
  "":          "🔥 Trending",
  "animals":   "🐱 Animals",
  "babies":    "👶 Babies",
  "pranks":    "😂 Pranks",
  "dad-jokes": "🤡 Dad Jokes",
  "fails":     "🎬 Fails",
};

function normalizeVideo(v) {
  return {
    id: v.id,
    title: v.title,
    description: v.description || "",
    thumbnailUrl: v.thumbnailUrl || `https://picsum.photos/seed/${v.id}/640/360`,
    videoUrl: v.videoUrl,
    duration: v.duration ? `0:${String(v.duration).padStart(2, "0")}` : "0:30",
    views: v.views || 0,
    likes: v.likes || 0,
    tags: v.tags || [],
    author: {
      id: v.authorId || null,
      name: v.authorName || "Chanfle User",
      avatarUrl: v.authorAvatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${v.id}`,
    },
    createdAt: v.createdAt || new Date().toISOString(),
  };
}

function VideoFeed({ forYouVideos, followingVideos, loadingForYou, loadingFollowing }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const tab = searchParams.get("tab") || "foryou";
  const cat = searchParams.get("cat") || "";

  function setTab(t) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", t);
    params.delete("cat");
    router.push(`/?${params.toString()}`);
  }

  const tags = categoryMap[cat] ?? [];
  const filtered =
    tab === "following"
      ? followingVideos
      : tags.length === 0
        ? forYouVideos
        : forYouVideos.filter((v) => v.tags.some((t) => tags.includes(t)));

  const label = tab === "following" ? "👥 Following" : (categoryLabels[cat] ?? "🔥 Trending");
  const loading = tab === "following" ? loadingFollowing : loadingForYou;

  return (
    <>
      {/* Tabs */}
      <div className="mb-8 flex items-center gap-1 border-b border-[#2a2a3a]">
        <button
          onClick={() => setTab("foryou")}
          className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
            tab !== "following"
              ? "border-[#ff3b5c] text-[#f0f0f5]"
              : "border-transparent text-[#6b6b80] hover:text-[#f0f0f5]"
          }`}
        >
          For You
        </button>
        {isSignedIn ? (
          <button
            onClick={() => setTab("following")}
            className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
              tab === "following"
                ? "border-[#ff3b5c] text-[#f0f0f5]"
                : "border-transparent text-[#6b6b80] hover:text-[#f0f0f5]"
            }`}
          >
            Following
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="px-5 py-3 text-sm font-bold text-[#6b6b80] hover:text-[#f0f0f5] transition-colors border-b-2 border-transparent -mb-px"
          >
            Following
          </Link>
        )}
      </div>

      {/* Section header */}
      <div id="feed" className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f0f0f5]">{label}</h2>
        <span className="text-sm text-[#6b6b80]">
          {loading ? "Loading..." : `${filtered.length} video${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-[#1a1a24]" />
              <div className="mt-3 flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1a1a24]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded bg-[#1a1a24]" />
                  <div className="h-3 w-2/3 rounded bg-[#1a1a24]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tab === "following" && !isSignedIn ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">👥</div>
          <p className="text-[#6b6b80]">Log in to see videos from people you follow.</p>
          <Link href="/sign-in" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
            Log in
          </Link>
        </div>
      ) : tab === "following" && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">👀</div>
          <p className="text-[#6b6b80]">Follow some creators to see their videos here.</p>
          <button
            onClick={() => setTab("foryou")}
            className="rounded-full border border-[#2a2a3a] px-6 py-2.5 text-sm font-bold text-[#f0f0f5] hover:border-[#ff3b5c] transition-colors"
          >
            Discover creators
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">😅</div>
          <p className="text-[#6b6b80]">No videos in this category yet.</p>
          <a href="/upload" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
            Upload the first one
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="rounded-full border border-[#2a2a3a] px-8 py-3 text-sm font-semibold text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors">
            Load more videos
          </button>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [forYouVideos, setForYouVideos] = useState([]);
  const [followingVideos, setFollowingVideos] = useState([]);
  const [loadingForYou, setLoadingForYou] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setForYouVideos((data.videos || []).map(normalizeVideo)))
      .catch(() => {})
      .finally(() => setLoadingForYou(false));
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    setLoadingFollowing(true);
    fetch("/api/videos/following")
      .then((r) => r.json())
      .then((data) => setFollowingVideos((data.videos || []).map(normalizeVideo)))
      .catch(() => {})
      .finally(() => setLoadingFollowing(false));
  }, [isSignedIn]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <div className="relative mb-10 px-2 py-10">
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-[#ff3b5c]/20 px-3 py-1 text-xs font-bold text-[#ff3b5c] pulse-glow">
              😂 LIVE · {(forYouVideos.length * 137 + 1209).toLocaleString()} laughing now
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Welcome to <span className="gradient-text">Chanfle</span>
          </h1>
          <p className="mt-3 max-w-lg text-[#6b6b80] text-base">
            The internet&apos;s funniest corner. No algorithms. No drama. Just pure, unfiltered comedy gold.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#feed" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
              Start Laughing ▶
            </a>
            <a href="/upload" className="rounded-full border border-[#2a2a3a] px-6 py-2.5 text-sm font-bold text-[#f0f0f5] hover:border-[#ff3b5c] transition-colors">
              Upload a video
            </a>
          </div>
        </div>
      </div>

      {/* Feed with tabs */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-xl bg-[#1a1a24]" />
              </div>
            ))}
          </div>
        }
      >
        <VideoFeed
          forYouVideos={forYouVideos}
          followingVideos={followingVideos}
          loadingForYou={loadingForYou}
          loadingFollowing={loadingFollowing}
        />
      </Suspense>

      {/* Real stats */}
      {!loadingForYou && (
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Videos",           value: forYouVideos.length.toLocaleString(),                           icon: "🎬" },
            { label: "Total views",      value: formatViews(forYouVideos.reduce((a, v) => a + v.views, 0)),     icon: "👁️" },
            { label: "Total likes",      value: formatViews(forYouVideos.reduce((a, v) => a + v.likes, 0)),     icon: "❤️" },
            { label: "Creators",         value: new Set(forYouVideos.map((v) => v.author.id).filter(Boolean)).size.toLocaleString(), icon: "🎤" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-5 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-[#6b6b80] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
