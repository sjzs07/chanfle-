"use client";

import { useUser, UserProfile } from "@clerk/nextjs";
import { mockVideos, formatViews } from "@/lib/mockData";
import Link from "next/link";

export default function ProfilePage() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">👤</div>
        <h1 className="text-2xl font-bold">You need to be logged in</h1>
        <Link
          href="/sign-in"
          className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  // Mock: show first 3 videos as "your uploads"
  const myVideos = mockVideos.slice(0, 3);

  const stats = [
    { label: "Videos", value: myVideos.length, icon: "🎬" },
    { label: "Total views", value: formatViews(myVideos.reduce((a, v) => a + v.views, 0)), icon: "👁️" },
    { label: "Total likes", value: formatViews(myVideos.reduce((a, v) => a + v.likes, 0)), icon: "❤️" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Profile Header */}
      <div className="mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="h-24 w-24 rounded-full border-4 border-[#ff3b5c] bg-[#2a2a3a]"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-black">{user.fullName || user.username}</h1>
          <p className="text-sm text-[#6b6b80] mt-0.5">{user.emailAddresses[0]?.emailAddress}</p>
          <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-black">{s.value}</div>
                <div className="text-xs text-[#6b6b80]">{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:ml-auto">
          <Link
            href="/upload"
            className="rounded-full bg-[#ff3b5c] px-5 py-2 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
          >
            ＋ Upload
          </Link>
        </div>
      </div>

      {/* My Videos */}
      <div>
        <h2 className="text-xl font-bold mb-6">My Videos 🎬</h2>
        {myVideos.length === 0 ? (
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
            <div className="text-5xl mb-4">🎥</div>
            <p className="text-[#6b6b80]">No videos yet. Upload your first funny video!</p>
            <Link
              href="/upload"
              className="mt-4 inline-block rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
            >
              Upload a video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVideos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1a24]">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-mono text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[#6b6b80] mt-0.5">
                    {formatViews(video.views)} views · {formatViews(video.likes)} likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Clerk Profile Management */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Account Settings ⚙️</h2>
        <div className="rounded-2xl overflow-hidden border border-[#2a2a3a]">
          <UserProfile
            appearance={{
              variables: {
                colorBackground: "#1a1a24",
                colorText: "#f0f0f5",
                colorPrimary: "#ff3b5c",
                colorInputBackground: "#0f0f13",
                colorInputText: "#f0f0f5",
                borderRadius: "12px",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
