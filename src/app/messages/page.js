"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { timeAgo } from "@/lib/mockData";

export default function MessagesPage() {
  const { isSignedIn, userId } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">💬</div>
        <h1 className="text-2xl font-bold">Log in to see your messages</h1>
        <Link href="/sign-in" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black mb-6">Messages 💬</h1>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#1a1a24] animate-pulse">
              <div className="h-12 w-12 rounded-full bg-[#2a2a3a] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-[#2a2a3a]" />
                <div className="h-3 w-48 rounded bg-[#2a2a3a]" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-[#6b6b80] mb-2">No conversations yet.</p>
          <p className="text-xs text-[#6b6b80]">Follow someone and have them follow you back to start chatting.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((c) => {
            const unread = parseInt(c.unread) > 0;
            const lastMsg = c.lastVideoId
              ? "📹 Shared a video"
              : c.lastContent
                ? c.lastContent.length > 40 ? c.lastContent.slice(0, 40) + "…" : c.lastContent
                : "Start the conversation";

            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] hover:border-[#ff3b5c]/40 hover:bg-[#1e1e2a] transition-all"
              >
                <div className="relative shrink-0">
                  <img
                    src={c.otherAvatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${c.otherId}`}
                    alt={c.otherName}
                    className="h-12 w-12 rounded-full bg-[#2a2a3a] object-cover"
                  />
                  {unread && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#ff3b5c] border-2 border-[#1a1a24]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold truncate ${unread ? "text-[#f0f0f5]" : "text-[#a0a0b0]"}`}>
                      {c.otherName || "Chanfle User"}
                    </p>
                    {c.lastAt && (
                      <span className="text-xs text-[#6b6b80] shrink-0">{timeAgo(c.lastAt)}</span>
                    )}
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${unread ? "text-[#f0f0f5] font-medium" : "text-[#6b6b80]"}`}>
                    {c.lastSenderId === userId ? `You: ${lastMsg}` : lastMsg}
                  </p>
                </div>
                {unread && (
                  <span className="shrink-0 min-w-[20px] rounded-full bg-[#ff3b5c] px-1.5 py-0.5 text-[10px] font-bold text-white text-center">
                    {c.unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
