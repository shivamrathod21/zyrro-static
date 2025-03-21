import { useState, useRef, useEffect } from "react";
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from "react-compare-slider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function BeforeAfter() {
  const [width, setWidth] = useState(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch before/after video content
  const { data: beforeAfterVideos = [] } = useQuery({
    queryKey: ["/api/video-content", "before_after"],
    queryFn: async () => {
      const videos = await apiRequest({
        url: "/api/video-content",
        method: "GET",
      });
      return videos.filter((v: any) => v.section === "before_after" && v.active);
    },
  });
  
  useEffect(() => {
    if (sliderContainerRef.current) {
      setWidth(sliderContainerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (sliderContainerRef.current) {
        setWidth(sliderContainerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#111111] to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Before & After
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            See the transformation in our work. Drag the slider to compare the original footage with our professional edit.
          </p>
        </motion.div>

        <div 
          ref={sliderContainerRef} 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {beforeAfterVideos.map((comparison: any, index: number) => (
            <motion.div 
              key={comparison.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-lg"
            >
              <div className="relative h-80">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={comparison.thumbnailUrl || comparison.videoUrl}
                      alt="Before Edit"
                      style={{ filter: "brightness(0.7)" }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={comparison.videoUrl}
                      alt="After Edit"
                      style={{ filter: "brightness(1)" }}
                    />
                  }
                  handle={
                    <ReactCompareSliderHandle
                      buttonStyle={{
                        backdropFilter: "none",
                        background: "#FFD700",
                        border: 0,
                        color: "#000"
                      }}
                      linesStyle={{ color: "#FFD700", width: 2 }}
                    />
                  }
                  style={{ 
                    height: "100%", 
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-1 rounded-md">
                  <span className="text-sm font-medium">{comparison.title}</span>
                </div>
              </div>
              <p className="text-center mt-2 text-sm text-gray-400">{comparison.description || "Drag slider to compare before and after edits"}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
