import { useState, useRef, useEffect } from "react";
  import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";
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
      <section className="py-24 md:py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/50 to-black/80 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
              Before & After
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
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
                <div className="relative h-[500px] group hover:shadow-2xl hover:shadow-[#FFD700]/20 transition-all duration-300">
                  <ReactCompareSlider
                    position={50}
                    itemOne={
                      <video
                        src={comparison.beforeVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={(e) => {
                          console.error("Before video loading error:", e);
                          console.error("Video URL:", comparison.beforeVideoUrl);
                        }}
                        onLoadedData={() => {
                          console.log("Before video loaded successfully");
                        }}
                        style={{ 
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.8) contrast(1.1)"
                        }}
                        poster={comparison.thumbnailUrl}
                      />
                    }
                    itemTwo={
                      <video
                        src={comparison.afterVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={(e) => {
                          console.error("After video loading error:", e);
                          console.error("Video URL:", comparison.afterVideoUrl);
                        }}
                        onLoadedData={() => {
                          console.log("After video loaded successfully");
                        }}
                        style={{ 
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(1.1) contrast(1.2)"
                        }}
                        poster={comparison.thumbnailUrl}
                      />
                    }
                    handle={
                      <ReactCompareSliderHandle
                        buttonStyle={{
                          backdropFilter: "blur(4px)",
                          background: "#FFD700",
                          border: "2px solid #FFD700",
                          boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                          color: "#000"
                        }}
                        linesStyle={{ color: "#FFD700", width: 3 }}
                      />
                    }
                    style={{ 
                      height: "100%", 
                      width: "100%",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{comparison.title}</h3>
                    <p className="text-gray-300 text-sm">{comparison.description || "Drag slider to compare before and after edits"}</p>
                  </div>
                  <div className="absolute top-4 left-4 bg-[#FFD700] bg-opacity-90 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-black">BEFORE / AFTER</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
