import VideoCard from "@/components/VideoCard";
import { mockVideos } from "@/lib/mockData";

const categories = ["🔥 Trending", "🐱 Animals", "👶 Babies", "😂 Pranks", "🤡 Dad Jokes", "🎬 Fails"];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero Banner */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a0a0e] via-[#1a0e1a] to-[#0a0a1a] border border-[#2a2a3a] px-8 py-10">
        <div className="pointer-events-none absolute -top-10 -left-10 h-64 w-64 rounded-full bg-[#ff3b5c]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[#ffd700]/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-[#ff3b5c]/20 px-3 py-1 text-xs font-bold text-[#ff3b5c] pulse-glow">
              😂 LIVE · 8,421 laughing now
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight">
            Welcome to{" "}
            <span className="gradient-text">Chanfle</span>
          </h1>
          <p className="mt-3 max-w-lg text-[#6b6b80] text-base">
            The internet&apos;s funniest corner. No algorithms. No drama. Just pure, unfiltered comedy gold.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#feed"
              className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
            >
              Start Laughing ▶
            </a>
            <a
              href="/upload"
              className="rounded-full border border-[#2a2a3a] px-6 py-2.5 text-sm font-bold text-[#f0f0f5] hover:border-[#ff3b5c] transition-colors"
            >
              Upload a video
            </a>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              i === 0
                ? "bg-[#ff3b5c] text-white"
                : "border border-[#2a2a3a] bg-[#1a1a24] text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#f0f0f5]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div id="feed" className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#f0f0f5]">🔥 Trending Now</h2>
        <span className="text-sm text-[#6b6b80]">{mockVideos.length} videos</span>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Load more */}
      <div className="mt-12 flex justify-center">
        <button className="rounded-full border border-[#2a2a3a] px-8 py-3 text-sm font-semibold text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors">
          Load more videos
        </button>
      </div>

      {/* Stats strip */}
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Videos", value: "12,841", icon: "🎬" },
          { label: "Laughs delivered", value: "98M+", icon: "😂" },
          { label: "Creators", value: "3,200+", icon: "🎤" },
          { label: "Countries", value: "147", icon: "🌍" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-5 text-center"
          >
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black gradient-text">{stat.value}</div>
            <div className="text-xs text-[#6b6b80] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
