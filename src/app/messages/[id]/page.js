"use client";

import { useState, useEffect, useRef, use, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { timeAgo } from "@/lib/mockData";

function VideoPicker({ onSelect, onClose }) {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((d) => setVideos(d.videos || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = videos.filter((v) =>
    !query || v.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] flex flex-col max-h-[70vh]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#2a2a3a] shrink-0">
          <h2 className="font-bold">Share a Video</h2>
          <button onClick={onClose} className="text-[#6b6b80] hover:text-[#f0f0f5] text-xl">✕</button>
        </div>
        <div className="px-4 py-3 border-b border-[#2a2a3a] shrink-0">
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-[#2a2a3a] bg-[#0f0f13] px-4 py-2 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {loading ? (
            <div className="text-center text-[#6b6b80] py-8">Loading videos…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-[#6b6b80] py-8">No videos found</div>
          ) : (
            filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                className="flex items-center gap-3 rounded-xl border border-[#2a2a3a] bg-[#0f0f13] p-3 text-left hover:border-[#ff3b5c] transition-colors group"
              >
                <div className="relative h-14 w-24 shrink-0 rounded-lg overflow-hidden bg-[#2a2a3a]">
                  {v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">🎬</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold line-clamp-2 group-hover:text-[#ff3b5c] transition-colors">{v.title}</p>
                  <p className="text-xs text-[#6b6b80] mt-0.5">{v.authorName || "Chanfle User"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage({ params }) {
  const { id } = use(params);
  const { userId, isSignedIn } = useAuth();

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
      if (data.otherUser) setOtherUser(data.otherUser);
    } catch {}
    setLoading(false);
  }, [id]);

  // Initial load
  useEffect(() => { if (isSignedIn) fetchMessages(); }, [isSignedIn, fetchMessages]);

  // Poll every 3 s for new messages
  useEffect(() => {
    if (!isSignedIn) return;
    const t = setInterval(fetchMessages, 3000);
    return () => clearInterval(t);
  }, [isSignedIn, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content, videoId) {
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content || null, videoId: videoId || null }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, { ...data.message, videoId: videoId || null }]);
        if (videoId) await fetchMessages(); // fetch full video info
      }
    } catch {}
    setSending(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const t = text.trim();
    setText("");
    await sendMessage(t, null);
    inputRef.current?.focus();
  }

  async function handleVideoSelect(video) {
    setShowPicker(false);
    await sendMessage(null, video.id);
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Link href="/sign-in" className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white">Log in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {showPicker && (
        <VideoPicker onSelect={handleVideoSelect} onClose={() => setShowPicker(false)} />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#2a2a3a] shrink-0">
        <Link href="/messages" className="text-[#6b6b80] hover:text-[#f0f0f5] text-xl transition-colors">←</Link>
        {otherUser && (
          <Link href={`/user/${otherUser.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src={otherUser.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${otherUser.id}`}
              alt={otherUser.username}
              className="h-9 w-9 rounded-full bg-[#2a2a3a] object-cover"
            />
            <div>
              <p className="text-sm font-bold leading-none">{otherUser.username || "Chanfle User"}</p>
              <p className="text-xs text-[#6b6b80] mt-0.5">Tap to view profile</p>
            </div>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-[#6b6b80] text-sm">Loading messages…</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
            <div className="text-5xl">👋</div>
            <p className="text-[#6b6b80] text-sm">Say hi or share a funny video!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {/* Video card */}
                  {msg.videoId && (
                    <Link
                      href={`/video/${msg.videoId}`}
                      className={`mb-1 rounded-2xl overflow-hidden border border-[#2a2a3a] bg-[#0f0f13] hover:border-[#ff3b5c] transition-colors block w-56 ${isMe ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                    >
                      <div className="relative aspect-video w-full bg-[#1a1a24]">
                        {msg.videoThumbnail ? (
                          <img src={msg.videoThumbnail} alt={msg.videoTitle} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl">🎬</div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center text-xl">▶</div>
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold line-clamp-2 text-[#f0f0f5]">{msg.videoTitle || "Watch video"}</p>
                        <p className="text-[10px] text-[#ff3b5c] mt-0.5">Tap to watch ▶</p>
                      </div>
                    </Link>
                  )}

                  {/* Text bubble */}
                  {msg.content && (
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm max-w-full break-words ${
                        isMe
                          ? "bg-[#ff3b5c] text-white rounded-tr-sm"
                          : "bg-[#1a1a24] border border-[#2a2a3a] text-[#f0f0f5] rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  )}

                  <span className="text-[10px] text-[#6b6b80] mt-1 px-1">{timeAgo(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-[#2a2a3a] shrink-0">
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          title="Share a video"
          className="shrink-0 h-10 w-10 rounded-full border border-[#2a2a3a] bg-[#1a1a24] flex items-center justify-center text-lg hover:border-[#ff3b5c] transition-colors"
        >
          📹
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2.5 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="shrink-0 rounded-full bg-[#ff3b5c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
