import { MoreHorizontal, ExternalLink } from 'lucide-react';

export default function ExplorePageCard({ item, onClick }) {
  const w = Number(item.width) || 3;
  const h = Number(item.height) || 4;
  const href = item.photoUrl || item.url;

  return (
    <div className="break-inside-avoid mb-2 group">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-zoom-in">
        <img
          src={item.url || "/placeholder.svg"}
          alt={item.alt || "outfit inspiration"}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: `${w}/${h}` }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Save button */}
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add save functionality here
              }}
            >
              Save
            </button>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              {item.photographer && (
                <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                  {item.photographer}
                </span>
              )}
              <div className="flex gap-2">
                {/* View source */}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 p-1"
                  onClick={(e) => e.stopPropagation()}
                  title="View source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                {/* More options */}
                <button className="text-white hover:text-gray-300 p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Click overlay for "more like this" */}
        <button
          className="absolute inset-0 cursor-pointer"
          onClick={() => onClick(item)}
          title="More like this"
          aria-label="More like this"
        />
      </div>
    </div>
  );
}
