"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#2a2a3a] bg-[#0f0f13]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">

          {/* Left — hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6b6b80] hover:bg-[#1a1a24] hover:text-[#f0f0f5] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="19" y2="5" />
              <line x1="3" y1="11" x2="19" y2="11" />
              <line x1="3" y1="17" x2="19" y2="17" />
            </svg>
          </button>

          {/* Center — logo (absolutely centered in the header) */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">😂</span>
              <span className="gradient-text text-2xl font-black tracking-tight">Chanfle</span>
            </Link>
          </div>

          {/* Right — auth */}
          <div className="ml-auto flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Sidebar — wrapped in Suspense because it uses useSearchParams */}
      <Suspense fallback={null}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
    </>
  );
}
