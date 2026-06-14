"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const categories = [
  { label: "🔥 Trending",  cat: "" },
  { label: "🐱 Animals",   cat: "animals" },
  { label: "👶 Babies",    cat: "babies" },
  { label: "😂 Pranks",    cat: "pranks" },
  { label: "🤡 Dad Jokes", cat: "dad-jokes" },
  { label: "🎬 Fails",     cat: "fails" },
];

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") || "";
  const inputRef = useRef(null);

  // Focus search on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSearch(e) {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); onClose(); }
  }

  function handleCategory(cat) {
    router.push(cat ? `/?cat=${cat}` : "/");
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-[#0a0a0f] border-r border-[#2a2a3a] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2a2a3a]">
          <span className="gradient-text text-xl font-black">Chanfle</span>
          <button onClick={onClose} className="text-[#6b6b80] hover:text-[#f0f0f5] text-2xl leading-none transition-colors">
            ✕
          </button>
        </div>

        {/* Search — first item */}
        <div className="px-5 py-5 border-b border-[#2a2a3a]">
          <p className="text-[10px] font-bold tracking-widest text-[#6b6b80] uppercase mb-3">Search</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search funny videos..."
              className="flex-1 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
            />
            <button type="submit" className="rounded-full bg-[#ff3b5c] px-4 py-2 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
              Go
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="text-[10px] font-bold tracking-widest text-[#6b6b80] uppercase mb-4 px-2">Browse</p>
          <nav className="flex flex-col gap-1">
            {categories.map((c) => {
              const isActive = activeCat === c.cat;
              return (
                <button
                  key={c.label}
                  onClick={() => handleCategory(c.cat)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-left text-base font-semibold transition-all ${
                    isActive
                      ? "bg-[#ff3b5c]/15 text-[#ff3b5c] border border-[#ff3b5c]/30"
                      : "text-[#a0a0b0] hover:bg-[#1a1a24] hover:text-[#f0f0f5]"
                  }`}
                >
                  <span className="text-xl w-8 text-center">{c.label.split(" ")[0]}</span>
                  <span>{c.label.split(" ").slice(1).join(" ")}</span>
                  {isActive && <span className="ml-auto w-1.5 h-5 rounded-full bg-[#ff3b5c]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom links */}
        <div className="px-5 py-5 border-t border-[#2a2a3a] flex flex-col gap-3">
          <Link href="/upload" onClick={onClose} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#ff3b5c] border border-[#ff3b5c]/30 hover:bg-[#ff3b5c]/10 transition-colors">
            <span className="text-lg">📹</span> Upload a video
          </Link>
        </div>
      </aside>
    </>
  );
}
