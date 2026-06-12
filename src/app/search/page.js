"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { mockVideos } from "@/lib/mockData";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const term = q.toLowerCase();
    setQuery(q);
    setResults(
      term
        ? mockVideos.filter(
            (v) =>
              v.title.toLowerCase().includes(term) ||
              v.tags.some((t) => t.toLowerCase().includes(term)) ||
              v.author.name.toLowerCase().includes(term)
          )
        : []
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black">
          {q ? (
            <>
              Results for{" "}
              <span className="gradient-text">&quot;{q}&quot;</span>
            </>
          ) : (
            "Search Chanfle"
          )}
        </h1>
        {q && (
          <p className="mt-1 text-sm text-[#6b6b80]">
            {results.length} video{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {!q && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#6b6b80]">Type something in the search bar above to find hilarious videos.</p>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="rounded-2xl border border-[#2a2a3a] bg-[#1a1a24] p-12 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-lg font-bold mb-2">No results for &quot;{q}&quot;</h2>
          <p className="text-[#6b6b80] text-sm">Try different keywords or browse trending videos.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {/* Popular tags */}
      {!q && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Popular tags</h2>
          <div className="flex flex-wrap gap-2">
            {["animals", "pranks", "babies", "dad-jokes", "fails", "viral", "cats", "dogs", "comedy"].map((tag) => (
              <a
                key={tag}
                href={`/search?q=${tag}`}
                className="rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm text-[#6b6b80] hover:border-[#ff3b5c] hover:text-[#ff3b5c] transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
