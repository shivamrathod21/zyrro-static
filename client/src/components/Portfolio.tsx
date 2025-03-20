import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FilmIcon, GamepadIcon, TrophyIcon, ZapIcon } from "@/lib/icons";
import { getOptimizedImageUrl, generateSrcSet, generateSizes } from "@/lib/imageOptimizer";

// Extended portfolio items with more metadata and examples
const portfolioItems = [
  {
    id: 1,
    title: "Gaming Highlights",
    description: "Epic gaming moments with dynamic transitions and effects.",
    category: "Gaming",
    platform: "YouTube",
    game: "Fortnite",
    imageSrc: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Stream Compilation",
    description: "Best moments from live streams with professional editing.",
    category: "Streaming",
    platform: "Twitch",
    game: "Minecraft",
    imageSrc: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Esports Recap",
    description: "Professional tournament highlight videos with dynamic graphics.",
    category: "Esports",
    platform: "YouTube",
    game: "Valorant",
    imageSrc: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Gameplay Trailers",
    description: "Cinematic game trailers that showcase your gameplay at its best.",
    category: "Trailers",
    platform: "YouTube",
    game: "Call of Duty",
    imageSrc: "https://images.unsplash.com/photo-1556438064-2d7646166914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Stream Highlights",
    description: "Best moments from your gaming streams edited for maximum impact.",
    category: "Streaming",
    platform: "Twitch",
    game: "Apex Legends",
    imageSrc: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Tournament Montage",
    description: "High-energy montage of tournament gameplay with custom effects.",
    category: "Esports",
    platform: "YouTube",
    game: "League of Legends",
    imageSrc: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

// Filter button component
const FilterButton = ({ 
  active, 
  onClick, 
  children, 
  icon: Icon 
}: { 
  active: boolean, 
  onClick: () => void, 
  children: React.ReactNode,
  icon?: React.ComponentType<any>
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-full text-sm transition-all duration-300 ${
      active 
        ? "bg-[#FFD700] text-black font-medium shadow-lg shadow-[#FFD700]/20" 
        : "bg-[#222222] text-gray-300 hover:bg-[#333333]"
    }`}
  >
    {Icon && <Icon className={`mr-2 h-4 w-4 ${active ? "text-black" : "text-[#FFD700]"}`} />}
    {children}
  </button>
);

export default function Portfolio() {
  // Filter state
  const [filter, setFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(portfolioItems);
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({
    category: new Set(),
    platform: new Set(),
    game: new Set()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Update filtered items when filters change
  useEffect(() => {
    let result = [...portfolioItems];
    
    // Apply category filter if needed
    if (filter !== "all") {
      result = result.filter(item => item.category === filter);
    }
    
    // Apply additional active filters
    if (activeFilters.category.size > 0) {
      result = result.filter(item => activeFilters.category.has(item.category));
    }
    
    if (activeFilters.platform.size > 0) {
      result = result.filter(item => activeFilters.platform.has(item.platform));
    }
    
    if (activeFilters.game.size > 0) {
      result = result.filter(item => activeFilters.game.has(item.game));
    }
    
    setFilteredItems(result);
  }, [filter, activeFilters]);

  // Toggle specific filter values
  const toggleFilter = (type: 'category' | 'platform' | 'game', value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[type].has(value)) {
        newFilters[type].delete(value);
      } else {
        newFilters[type].add(value);
      }
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter("all");
    setActiveFilters({
      category: new Set(),
      platform: new Set(),
      game: new Set()
    });
  };

  // Get unique categories
  const categories = Array.from(new Set(portfolioItems.map(item => item.category)));
  
  // Get unique platforms
  const platforms = Array.from(new Set(portfolioItems.map(item => item.platform)));
  
  // Get unique games
  const games = Array.from(new Set(portfolioItems.map(item => item.game)));

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Gaming': return GamepadIcon;
      case 'Streaming': return FilmIcon;
      case 'Esports': return TrophyIcon;
      case 'Trailers': return ZapIcon;
      default: return undefined;
    }
  };

  return (
    <section id="portfolio" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Iceland'] tracking-wider">
            Our Portfolio <span className="text-[#FFD700]">Showcase</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            Browse through our latest work and see how we help our clients achieve their creative vision.
          </p>
          
          {/* Main category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All Projects
            </FilterButton>
            
            {categories.map(category => (
              <FilterButton
                key={category}
                active={filter === category}
                onClick={() => setFilter(category)}
                icon={getCategoryIcon(category)}
              >
                {category}
              </FilterButton>
            ))}
          </div>
          
          {/* Advanced filters (expandable) */}
          <div className="mt-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-400 hover:text-[#FFD700] mb-2"
            >
              {isExpanded ? "Hide Filters" : "Advanced Filters"}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#111111] rounded-lg p-4 overflow-hidden max-w-3xl mx-auto"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Platform filters */}
                    <div>
                      <h3 className="text-white font-medium mb-2 text-sm">Platform</h3>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map(platform => (
                          <button
                            key={platform}
                            onClick={() => toggleFilter('platform', platform)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              activeFilters.platform.has(platform)
                                ? "bg-[#FFD700] text-black"
                                : "bg-[#222222] text-gray-300 hover:bg-[#333333]"
                            }`}
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Game filters */}
                    <div>
                      <h3 className="text-white font-medium mb-2 text-sm">Game</h3>
                      <div className="flex flex-wrap gap-2">
                        {games.map(game => (
                          <button
                            key={game}
                            onClick={() => toggleFilter('game', game)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              activeFilters.game.has(game)
                                ? "bg-[#FFD700] text-black"
                                : "bg-[#222222] text-gray-300 hover:bg-[#333333]"
                            }`}
                          >
                            {game}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Clear all filters */}
                    <div className="flex items-end justify-end">
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="text-xs h-8 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  layout
                  className="group relative bg-[#111111] overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10"
                >
                  <div className="aspect-video bg-[#222222] relative overflow-hidden">
                    <img 
                      src={getOptimizedImageUrl(item.imageSrc, 800, 85)}
                      alt={`${item.title} Thumbnail`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      srcSet={generateSrcSet(item.imageSrc)}
                      sizes={generateSizes()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        {item.platform}
                      </span>
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        {item.game}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-[#FFD700]/20 text-[#FFD700] text-xs px-2 py-1 rounded">{item.category}</span>
                        <Button 
                          variant="link" 
                          className="text-white hover:text-[#FFD700] transition-colors p-0 text-sm font-medium"
                        >
                          View Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-10 text-center"
              >
                <p className="text-gray-400 mb-4">No projects match your current filters.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 transition-all duration-300">
            <a href="/portfolio" className="inline-flex items-center">
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
