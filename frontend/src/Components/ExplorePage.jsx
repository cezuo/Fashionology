"use client"

import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Search, Home, Bookmark, User, Bell, MessageCircle } from "lucide-react"
import ExplorePageCard from "./Explorepagecard"
import MoreLikeThis from "./Morelikethis"

const PAGE_SIZE = 12

export default function ExplorePage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const answers = state?.answers || []
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [hint, setHint] = useState("") // <- drives backend filtering
  const [selectedItem, setSelectedItem] = useState(null) // "more like this"
  const sentinelRef = useRef(null)

  const categories = ["All", "Outfits", "Streetwear", "Formal", "Casual", "Vintage", "Minimalist", "Boho", "Sporty"]

  const load = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/generate-outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, page, pageSize: PAGE_SIZE, hint }), // <- send hint
      })
      const text = await res.text()
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
      const data = text ? JSON.parse(text) : {}
      const batch = Array.isArray(data?.items) ? data.items : []
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        const unique = batch.filter((b) => !seen.has(b.id))
        return unique.length ? [...prev, ...unique] : prev
      })
      setHasMore(batch.length === PAGE_SIZE)
      setPage((p) => p + 1)
    } catch (e) {
      setError(e.message || "Failed to load images")
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Initial load / when leaving "more like this"
  useEffect(() => {
    if (items.length === 0 && !loading && !selectedItem) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])

  // Infinite scroll observer (disabled in "more like this" view)
  useEffect(() => {
    if (!sentinelRef.current || selectedItem) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) load()
      },
      { rootMargin: "200px" },
    )
    io.observe(sentinelRef.current)
    return () => io.disconnect()
  }, [hasMore, loading, selectedItem]) // eslint-disable-line

  // Search submit -> combine category + text, reset feed, reload
  const onSearchSubmit = (e) => {
    e.preventDefault()
    const nextHint = [activeCategory !== "All" ? activeCategory : "", searchQuery].filter(Boolean).join(" ")
    setHint(nextHint)
    setItems([])
    setPage(1)
    setHasMore(true)
    setSelectedItem(null) // ensure we're in explore mode
    setTimeout(load, 0)
  }

  // Category click -> apply immediately (like a filter)
  const onCategoryClick = (category) => {
    setActiveCategory(category)
    const nextHint = [category !== "All" ? category : "", searchQuery].filter(Boolean).join(" ")
    setHint(nextHint)
    setItems([])
    setPage(1)
    setHasMore(true)
    setSelectedItem(null)
    setTimeout(load, 0)
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleBackToExplore = () => {
    setSelectedItem(null)
  }

  // "More like this" full-screen view
  if (selectedItem) {
    return <MoreLikeThis selectedItem={selectedItem} onBack={handleBackToExplore} onItemClick={handleItemClick} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SW</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button className="text-gray-900 font-semibold hover:text-gray-600">Home</button>
              <button className="text-gray-600 hover:text-gray-900">Explore</button>
              <button className="text-gray-600 hover:text-gray-900">Create</button>
            </nav>
          </div>
          {/* Search Bar (now a form) */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for ideas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>
          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
              title="Go to profile"
            />
          </div>
        </div>
        {/* Category Navigation */}
        <div className="px-4 pb-3">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Clear current search/filter */}
          {hint && (
            <div className="mt-2">
              <button
                className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setHint("")
                  setSearchQuery("")
                  setActiveCategory("All")
                  setItems([])
                  setPage(1)
                  setHasMore(true)
                  setSelectedItem(null)
                  setTimeout(load, 0)
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-20 fixed left-0 top-20 h-full">
          <nav className="flex flex-col items-center space-y-6 pt-8">
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Home className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              title="Go to profile"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 lg:ml-20">
          <div className="px-2 py-4">
            {error && (
              <div className="mb-4 mx-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {error} —{" "}
                  <button className="underline font-medium" onClick={load}>
                    Try again
                  </button>
                </p>
              </div>
            )}
            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-2 space-y-2">
              {items.map((item) => (
                <ExplorePageCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
              {/* Loading Skeletons */}
              {items.length === 0 &&
                loading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid mb-2 rounded-2xl bg-gray-200 animate-pulse"
                    style={{ height: [220, 320, 280, 420, 360][i % 5] }}
                  />
                ))}
            </div>
            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="h-12" />
            {/* Loading / End states */}
            {loading && items.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-sm">Loading more ideas...</span>
                </div>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">You've reached the end! ✨</p>
                <p className="text-gray-400 text-xs mt-1">Check back later for more inspiration</p>
              </div>
            )}
          </div>
        </main>
      </div>
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
  )
}
