import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ExplorePageCard from './Explorepagecard';

const PAGE_SIZE = 12;

export default function MoreLikeThis({ selectedItem, onBack, onItemClick }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  // Category tags based on the selected item
  const [categories] = useState([
    "accessories", "attire", "beauty", "blue eye makeup", "casual", "casual wear", 
    "confidence", "daylight", "denim overalls", "earrings", "fashion", "style"
  ]);

  const load = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/more-like-this", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedItem.id, page, pageSize: PAGE_SIZE }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
      const data = text ? JSON.parse(text) : {};
      const batch = Array.isArray(data?.items) ? data.items : [];
    
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const unique = batch.filter((b) => !seen.has(b.id));
        return unique.length ? [...prev, ...unique] : prev;
      });
      setHasMore(batch.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      setError(e.message || "Failed to load similar images");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError("");
    load();
  }, [selectedItem]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
  
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          load();
        }
      },
      { rootMargin: "200px" }
    );
  
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Back button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">More like this</h1>
          </div>
        </div>

        {/* Category Tags */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full whitespace-nowrap text-sm font-medium transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 py-4">
        {error && (
          <div className="mb-4 mx-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {error} — <button className="underline font-medium" onClick={load}>Try again</button>
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-2 space-y-2">
          {items.map((item) => (
            <ExplorePageCard 
              key={item.id} 
              item={item} 
              onClick={() => onItemClick(item)}
            />
          ))}

          {/* Loading Skeletons */}
          {items.length === 0 && loading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-2 rounded-2xl bg-gray-200 animate-pulse"
                style={{ height: [220, 320, 280, 420, 360][i % 5] }}
              />
            ))
          }
        </div>

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-12" />

        {/* Loading States */}
        {loading && items.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-sm">Loading more similar ideas...</span>
            </div>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm">No more similar images found! ✨</p>
            <button 
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2 underline"
            >
              Back to explore
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
