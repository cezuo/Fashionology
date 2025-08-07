import { useState, useEffect } from "react"
import { WelcomePageCard } from "./WelcomePageCard"
import { motion } from "framer-motion"

const images = [
  "/images/jew1.jpg",
  "/images/jew2.jpg",
  "/images/nails.jpg",
  "/images/fit1.jpg",
  "/images/fit2.jpg",
  "/images/fit3.jpg",
  "/images/fit4.jpg",
  "/images/shoe1.jpg",
]

function WelcomePage() {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Preload images for smoother experience
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = resolve // Still resolve on error to avoid blocking
        })
      })

      await Promise.all(promises)
      setImagesLoaded(true)
    }

    preloadImages()
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Masonry background with staggered animation */}
      <div className="absolute inset-0 columns-2 sm:columns-3 md:columns-4 gap-3 p-3 z-0">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: imagesLoaded ? 0.85 : 0,
              y: imagesLoaded ? 0 : 20,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="mb-3 overflow-hidden rounded-lg"
          >
            <img
              src={src || "/placeholder.svg"}
              alt={`Fashion item ${index + 1}`}
              className="w-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        ))}
      </div>

      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 z-10"></div>

      {/* Welcome Card centered with animation */}
      <motion.div
        className="relative z-30 flex items-center justify-center min-h-screen px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <WelcomePageCard />
      </motion.div>
    </div>
  )
}

export default WelcomePage;