"use client";

import { useState, useEffect } from "react";

const shareTargets = [
  {
    name: "WhatsApp",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    color: "#25D366",
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`😂 Check out this funny video: ${title}\n${url}`)}`,
  },
  {
    name: "Facebook",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    color: "#1877F2",
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X / Twitter",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg",
    color: "#000000",
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`😂 ${title} - via Chanfle`)}`,
  },
  {
    name: "Telegram",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    color: "#26A5E4",
    getUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`😂 ${title}`)}`,
  },
  {
    name: "Reddit",
    icon: "https://www.redditinc.com/assets/images/site/reddit-logo.png",
    color: "#FF4500",
    getUrl: (url, title) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Email",
    icon: null,
    emoji: "✉️",
    color: "#6b6b80",
    getUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(`Check out: ${title}`)}&body=${encodeURIComponent(`I found this hilarious video on Chanfle 😂\n\n${title}\n${url}`)}`,
  },
];

export default function ShareModal({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Share this video 🔗</h2>
          <button
            onClick={onClose}
            className="text-[#6b6b80] hover:text-[#f0f0f5] text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Title preview */}
        <p className="text-xs text-[#6b6b80] mb-4 line-clamp-1">{title}</p>

        {/* Share targets */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {shareTargets.map((target) => (
            <a
              key={target.name}
              href={target.getUrl(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border border-[#2a2a3a] bg-[#0f0f13] p-3 hover:border-[#ff3b5c] transition-colors group"
            >
              <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden bg-[#1a1a24]">
                {target.emoji ? (
                  <span className="text-2xl">{target.emoji}</span>
                ) : (
                  <img
                    src={target.icon}
                    alt={target.name}
                    className="h-6 w-6 object-contain"
                  />
                )}
              </div>
              <span className="text-[10px] text-[#6b6b80] group-hover:text-[#f0f0f5] text-center leading-tight transition-colors">
                {target.name}
              </span>
            </a>
          ))}
        </div>

        {/* Copy link row */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-[#2a2a3a] bg-[#0f0f13] px-3 py-2 text-xs text-[#6b6b80] truncate">
            {url}
          </div>
          <button
            onClick={handleCopy}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "bg-[#ff3b5c] text-white hover:bg-[#e0304f]"
            }`}
          >
            {copied ? "✅ Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
