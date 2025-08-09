// src/hooks/useInfiniteOutfits.js
import { useState } from "react";

export default function useInfiniteOutfits({ answers, filterHint = "" }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/generate-outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, page, pageSize: 12, hint: filterHint }),
      });
      const data = await res.json();
      const newItems = data?.items ?? [];
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
      setPage(p => p + 1);
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return { items, load, loading, hasMore };
}
