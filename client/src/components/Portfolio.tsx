import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const portfolioItems = [
  {
    title: "Gaming Highlights",
    description: "Epic gaming moments with dynamic transitions and effects.",
    category: "Gaming",
    imageSrc: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Stream Compilation",
    description: "Best moments from live streams with professional editing.",
    category: "Streaming",
    imageSrc: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Esports Recap",
    description: "Professional tournament highlight videos with dynamic graphics.",
    category: "Esports",
    imageSrc: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Gameplay Trailers",
    description: "Cinematic game trailers that showcase your gameplay at its best.",
    category: "Trailers",
    imageSrc: "https://images.unsplash.com/photo-1556438064-2d7646166914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Portfolio <span className="text-[#FFD700]">Showcase</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Browse through our latest work and see how we help our clients achieve their creative vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-[#111111] overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10"
            >
              <div className="aspect-video bg-[#222222] relative overflow-hidden">
                <img 
                  src={item.imageSrc}
                  alt={`${item.title} Thumbnail`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#FFD700]/20 text-[#FFD700] text-xs px-2 py-1 rounded">{item.category}</span>
                    <Button variant="link" className="text-white hover:text-[#FFD700] transition-colors p-0">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 transition-all duration-300">
            <a href="#" className="inline-flex items-center">
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
