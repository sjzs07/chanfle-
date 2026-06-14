"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }
    const url = URL.createObjectURL(f);
    const vid = document.createElement("video");
    vid.src = url;
    vid.onloadedmetadata = () => {
      if (vid.duration > 60) {
        setError("Video must be 60 seconds or less.");
        URL.revokeObjectURL(url);
        return;
      }
      setError("");
      setFile(f);
      setPreview(url);
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError("");

    try {
      // Step 1 — get a signed upload URL from our API
      setProgress("Preparing upload...");
      const sigRes = await fetch("/api/upload/sign");
      if (!sigRes.ok) throw new Error("Could not get upload credentials");
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();

      // Step 2 — upload directly from the browser to Cloudinary (no Next.js proxy)
      setProgress("Uploading to Cloudinary...");
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("timestamp", timestamp);
      cloudForm.append("signature", signature);
      cloudForm.append("api_key", apiKey);
      cloudForm.append("folder", "chanfle");
      cloudForm.append("resource_type", "video");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        { method: "POST", body: cloudForm }
      );
      const uploadResult = await cloudRes.json();
      if (uploadResult.error) throw new Error(uploadResult.error.message);

      // Step 3 — save metadata to our DB
      setProgress("Saving video...");
      const tagList = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const thumbnailUrl = uploadResult.secure_url
        .replace("/upload/", "/upload/so_0,f_jpg/")
        .replace(/\.[^/.]+$/, ".jpg");

      const saveRes = await fetch("/api/upload/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: uploadResult.public_id,
          videoUrl: uploadResult.secure_url,
          thumbnailUrl,
          duration: uploadResult.duration,
          title,
          description,
          tags: tagList,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save video");

      router.push("/");
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold">You need to be logged in</h1>
        <a
          href="/sign-in"
          className="rounded-full bg-[#ff3b5c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0304f] transition-colors"
        >
          Log in
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Upload a <span className="gradient-text">funny video</span> 🎬
        </h1>
        <p className="mt-2 text-sm text-[#6b6b80]">
          Max 60 seconds · Make it hilarious
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* File drop zone */}
        <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#2a2a3a] bg-[#1a1a24] p-10 cursor-pointer hover:border-[#ff3b5c] transition-colors group">
          <input type="file" accept="video/*" onChange={handleFile} className="sr-only" />
          {preview ? (
            <video src={preview} controls className="w-full rounded-xl max-h-64 object-contain" />
          ) : (
            <>
              <div className="text-5xl group-hover:scale-110 transition-transform">📹</div>
              <div className="text-center">
                <p className="font-semibold text-[#f0f0f5]">Click to select a video</p>
                <p className="text-sm text-[#6b6b80] mt-1">MP4, MOV, WebM — max 60 seconds</p>
              </div>
            </>
          )}
        </label>

        {file && (
          <div className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-3 text-sm text-[#6b6b80] flex items-center gap-2">
            <span>🎞️</span>
            <span className="truncate">{file.name}</span>
            <span className="ml-auto shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-[#ff3b5c]/40 bg-[#ff3b5c]/10 p-3 text-sm text-[#ff3b5c]">
            ⚠️ {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Title <span className="text-[#ff3b5c]">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a funny title..."
            maxLength={100}
            className="w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
          />
          <div className="mt-1 text-right text-xs text-[#6b6b80]">{title.length}/100</div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What makes this video hilarious?"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors resize-none"
          />
          <div className="mt-1 text-right text-xs text-[#6b6b80]">{description.length}/500</div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tags</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="animals, pranks, fails (comma-separated)"
            className="w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-3 text-sm text-[#f0f0f5] placeholder:text-[#6b6b80] outline-none focus:border-[#ff3b5c] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!file || !title.trim() || uploading}
          className="w-full rounded-full bg-[#ff3b5c] py-3 text-sm font-bold text-white hover:bg-[#e0304f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {uploading ? `${progress} 🚀` : "Upload Video 🎬"}
        </button>
      </form>
    </div>
  );
}
