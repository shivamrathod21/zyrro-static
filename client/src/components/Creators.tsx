import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const creators = [
  {
    name: "RazorFishGaming",
    subscribers: "2.3M subscribers",
    testimonial: "Your work is really good and the quality of editing is high!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isCustomAvatar: false
  },
  {
    name: "Viyaura",
    subscribers: "500k subscribers",
    testimonial: "Zyro-Visuals transformed my content completely! The edits are fire!",
    avatar: "^_^",
    isCustomAvatar: true
  },
  {
    name: "RFG",
    subscribers: "4.5M subscribers",
    testimonial: "The quick turnaround and quality is unmatched. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    isCustomAvatar: false
  }
];

export default function Creators() {
  return (
    <section id="creators" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#111111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-[#FFD700]">Top Gaming Creators</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Delivering high-quality edits for gaming content creators worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creators.map((creator, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111111] border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10"
            >
              <div className="flex flex-col items-center">
                {creator.isCustomAvatar ? (
                  <div className="w-20 h-20 rounded-full mb-4 border-2 border-[#FFD700] bg-white flex items-center justify-center">
                    <span className="text-black text-2xl">{creator.avatar}</span>
                  </div>
                ) : (
                  <img 
                    src={creator.avatar}
                    alt={creator.name} 
                    className="w-20 h-20 rounded-full mb-4 border-2 border-[#FFD700]"
                  />
                )}
                <h3 className="text-xl font-semibold mb-1">{creator.name}</h3>
                <p className="text-[#FFD700] text-sm mb-3">{creator.subscribers}</p>
                <p className="text-gray-400 text-sm text-center italic mb-4">
                  "{creator.testimonial}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 transition-all duration-300">
            <a href="#book">Work with Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
