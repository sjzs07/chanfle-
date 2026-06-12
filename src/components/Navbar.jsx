"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a3a] bg-[#0f0f13]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">😂</span>
          <span className="gradient-text text-2xl font-black tracking-tight">
            Chanfle
          </span>
        </Link>

        {/* Search bar — hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 md:flex items-center gap-2 max-w-xl mx-auto"
        >
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b80]">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search funny videos..."
              className="w-full rounded-full border border-[#2a2a3a] bg-[#1a1a24] py-2 pl-10 pr-4 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#ff3b5c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e0304f] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/upload"
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#ff3b5c] px-4 py-1.5 text-sm font-semibold text-[#ff3b5c] hover:bg-[#ff3b5c] hover:text-white transition-colors"
              >
                <span>＋</span> Upload
              </Link>
              <Link
                href="/profile"
                className="hidden sm:block text-sm text-[#6b6b80] hover:text-[#f0f0f5] transition-colors"
              >
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full border border-[#2a2a3a] px-4 py-1.5 text-sm font-medium text-[#f0f0f5] hover:border-[#ff3b5c] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#ff3b5c] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#e0304f] transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#6b6b80] hover:text-[#f0f0f5] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a3a] bg-[#0f0f13] px-4 pb-4 pt-3 flex flex-col gap-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b80] text-sm">
                🔍
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search funny videos..."
                className="w-full rounded-full border border-[#2a2a3a] bg-[#1a1a24] py-2 pl-9 pr-3 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c]"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#ff3b5c] px-4 py-2 text-sm font-semibold text-white"
            >
              Go
            </button>
          </form>
          {isSignedIn ? (
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/upload" onClick={() => setMenuOpen(false)} className="font-semibold text-[#ff3b5c]">
                ＋ Upload a video
              </Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-[#6b6b80]">
                Profile
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full border border-[#2a2a3a] py-2 text-center text-sm font-medium text-[#f0f0f5]">
                Log in
              </Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="flex-1 rounded-full bg-[#ff3b5c] py-2 text-center text-sm font-semibold text-white">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
