import { motion } from "framer-motion";
import {
  GamepadIcon,
  FilmIcon,
  WandIcon,
  ZapIcon
} from "@/lib/icons";

const services = [
  {
    icon: <GamepadIcon className="text-[#FFD700]" />,
    title: "Gaming Content",
    description: "Specialized editing for gaming videos, streams, and highlights with dynamic effects and smooth transitions."
  },
  {
    icon: <FilmIcon className="text-[#FFD700]" />,
    title: "Montage Editing",
    description: "Create high-energy gaming montages that keep viewers engaged with perfectly timed cuts and effects."
  },
  {
    icon: <WandIcon className="text-[#FFD700]" />,
    title: "Visual Effects",
    description: "Custom VFX and motion graphics designed specifically for gaming content and esports highlights."
  },
  {
    icon: <ZapIcon className="text-[#FFD700]" />,
    title: "Quick Turnaround",
    description: "Fast delivery without compromising on quality. Perfect for content creators on tight schedules."
  }
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-black to-[#111111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#FFD700] text-black p-2 rounded-full mb-4">
            <GamepadIcon className="h-5 w-5" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Professional gaming video editing services to help you create content that stands out
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-[#111111] border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#FFD700]/10"
            >
              <div className="bg-[#FFD700]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
