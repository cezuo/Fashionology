"use client"

import { useState } from "react"
import { Search, Home, Bookmark, User, Bell, MessageCircle, Settings, Grid, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("created")
  const navigate = useNavigate()

  // Mock user data
  const user = {
    name: "Sebastian Wagnac",
    username: "Sebastian12844",
    avatar: "/diverse-profile-avatars.png",
    followers: "2.1k",
    following: "847",
    bio: "Fashion enthusiast • Style inspiration • TPA",
    website: "sebastianwagnac.com",
  }

  // Mock saved/created pins - replace with real outfit images
  const mockPins = [
    {
      id: 1,
      url: "images/outfit1.jpg",
      title: "Casual Streetwear Look",
      saves: 45,
      photographer: "Street Style",
    },
    {
      id: 2,
      url: "images/outfit2.jpg",
      title: "Military Inspired Outfit",
      saves: 32,
      photographer: "Urban Fashion",
    },
    {
      id: 3,
      url: "images/outfit3.jpg",
      title: "Blue Jacket Casual",
      saves: 67,
      photographer: "Style Inspiration",
    },
    {
      id: 4,
      url: "images/outfit4.jpg",
      title: "Cozy Blue Sweater",
      saves: 28,
      photographer: "Comfort Style",
    },
    {
      id: 5,
      url: "images/outfit5.jpg",
      title: "Relaxed Fit Look",
      saves: 51,
      photographer: "Casual Wear",
    },
    {
      id: 6,
      url: "images/outfit6.jpg",
      title: "Orange Striped Casual",
      saves: 39,
      photographer: "Mirror Style",
    },
    // Add more variations for a fuller grid
    {
      id: 7,
      url: "images/outfit1.jpg",
      title: "Streetwear Variation",
      saves: 23,
      photographer: "Style Guide",
    },
    {
      id: 8,
      url: "images/outfit3.jpg",
      title: "Blue Casual Remix",
      saves: 41,
      photographer: "Fashion Forward",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => navigate("/explore")} className="text-gray-600 hover:text-gray-900">
                Back to Explore
              </button>
              <button className="text-gray-600 hover:text-gray-900">Create</button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for ideas"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-20 fixed left-0 top-20 h-full">
          <nav className="flex flex-col items-center space-y-6 pt-8">
            <button
              onClick={() => navigate("/explore")}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Explore"
            >
              <Home className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 bg-gray-100 rounded-full transition-colors">
              <User className="w-6 h-6 text-gray-900" />
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-2">@{user.username}</p>

              {/* Stats */}
              <div className="flex justify-center space-x-8 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.followers}</div>
                  <div className="text-sm text-gray-600">followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user.following}</div>
                  <div className="text-sm text-gray-600">following</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mb-2">{user.bio}</p>
              <a href={`https://${user.website}`} className="text-blue-600 hover:underline text-sm">
                {user.website}
              </a>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
                  Share
                </button>
                <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors">
                  Edit profile
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex justify-center space-x-8">
                <button
                  onClick={() => setActiveTab("created")}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "created"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Created</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "saved"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved</span>
                </button>
              </nav>
            </div>

            {/* Content Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {mockPins.map((pin) => (
                <div key={pin.id} className="break-inside-avoid mb-4 group">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <img
                      src={pin.url || "/placeholder.svg"}
                      alt={pin.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-3 right-3">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors">
                          Save
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">{pin.saves} saves</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {mockPins.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === "created" ? "Nothing to show...yet!" : "No saved Pins yet"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === "created"
                    ? "Pins you create will live here."
                    : "Explore to find ideas to save to your profile."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
