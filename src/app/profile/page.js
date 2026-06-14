"use client";

import { useState, useEffect } from "react";
import { useUser, UserProfile } from "@clerk/nextjs";
import { formatViews } from "@/lib/mockData";
import Link from "next/link";

export default function ProfilePage() {
  const { isSignedIn, user } = useUser();
  const [myVideos, setMyVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    Promise.all([
      fetch("/api/videos/mine").then((r) => r.json()),
      fetch(`/api/users/${user.id}`).then((r) => r.json()),
    ])
      .then(([videosData, userData]) => {
        setMyVideos(videosData.videos || []);
        if (userData.user) setStats(userData.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">👤</div>
        <h1 className="text-2xl font-bold">You need to be logged in</h1>
        <Link href="/sign-in" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
          Log in
        </Link>
      </div>
    );
  }

  const statCards = [
    { label: "Videos",    value: loading ? "—" : myVideos.length,                          icon: "🎬" },
    { label: "Followers", value: loading ? "—" : (stats?.followersCount ?? 0).toLocaleString(), icon: "👥" },
    { label: "Following", value: loading ? "—" : (stats?.followingCount ?? 0).toLocaleString(), icon: "❤️" },
    { label: "Views",     value: loading ? "—" : formatViews(myVideos.reduce((a, v) => a + (v.views || 0), 0)), icon: "👁️" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Profile Header */}
      <div className="mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="h-24 w-24 rounded-full border-4 border-[#ff3b5c] bg-[#2a2a3a] object-cover"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-black">{user.fullName || user.username}</h1>
          <p className="text-sm text-[#6b6b80] mt-0.5">{user.emailAddresses[0]?.emailAddress}</p>
          <div className="mt-4 flex flex-wrap gap-6 justify-center sm:justify-start">
            {statCards.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-xs text-[#6b6b80] mt-0.5">{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sm:ml-auto">
          <Link href="/upload" className="rounded-full bg-[#ff3b5c] px-5 py-2 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
            ＋ Upload
          </Link>
        </div>
      </div>

      {/* My Videos */}
      <div>
        <h2 className="text-xl font-bold mb-6">My Videos 🎬</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-xl bg-[#1a1a24]" />
                <div className="mt-2 space-y-2">
                  <div className="h-3 rounded bg-[#1a1a24]" />
                  <div className="h-3 w-1/2 rounded bg-[#1a1a24]" />
                </div>
              </div>
            ))}
          </div>
        ) : myVideos.length === 0 ? (
          <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
            <div className="text-5xl mb-4">🎥</div>
            <p className="text-[#6b6b80]">No videos yet. Upload your first funny video!</p>
            <Link href="/upload" className="mt-4 inline-block rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
              Upload a video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVideos.map((video) => (
              <Link key={video.id} href={`/video/${video.id}`} className="group block">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a1a24]">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">🎬</div>
                  )}
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-mono text-white">
                    {video.duration ? `0:${String(video.duration).padStart(2, "0")}` : "—"}
                  </span>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">{video.title}</h3>
                  <p className="text-xs text-[#6b6b80] mt-0.5">
                    {formatViews(video.views || 0)} views · {formatViews(video.likes || 0)} likes
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
                colorTextSecondary: "#a0a0b0",
                colorNeutral: "#f0f0f5",
                colorAlphaShaded: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                fontFamily: "inherit",
              },
              elements: {
                card: { backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", boxShadow: "none" },
                navbar: { backgroundColor: "#0f0f13", borderRight: "1px solid #2a2a3a" },
                navbarButton: { color: "#a0a0b0" },
                navbarButtonIcon: { color: "#a0a0b0" },
                pageScrollBox: { backgroundColor: "#1a1a24" },
                headerTitle: { color: "#f0f0f5" },
                headerSubtitle: { color: "#a0a0b0" },
                profileSectionTitle: { color: "#f0f0f5" },
                profileSectionTitleText: { color: "#f0f0f5" },
                profileSectionContent: { color: "#f0f0f5" },
                profileSectionPrimaryButton: { color: "#ff3b5c" },
                formFieldLabel: { color: "#f0f0f5" },
                formFieldInput: { backgroundColor: "#0f0f13", border: "1px solid #2a2a3a", color: "#f0f0f5" },
                formButtonPrimary: { backgroundColor: "#ff3b5c", color: "#ffffff" },
                formButtonReset: { color: "#a0a0b0" },
                badge: { backgroundColor: "#2a2a3a", color: "#f0f0f5" },
                accordionTriggerButton: { color: "#f0f0f5" },
                dividerLine: { backgroundColor: "#2a2a3a" },
                dividerText: { color: "#6b6b80" },
                avatarImageActionsUpload: { color: "#ff3b5c" },
                userPreviewMainIdentifier: { color: "#f0f0f5" },
                userPreviewSecondaryIdentifier: { color: "#a0a0b0" },
                providerIcon__apple: { filter: "brightness(0) invert(1)" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
