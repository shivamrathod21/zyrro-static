import { motion } from "framer-motion";
import {
  ClockIcon,
  TrophyIcon,
  ZapIcon,
  StarIcon
} from "@/lib/icons";

const features = [
  {
    icon: <ClockIcon className="h-10 w-10 text-[#FFD700]" />,
    title: "Quick Turnaround",
    description: "Get your gaming content edited and ready for upload within 24-48 hours."
  },
  {
    icon: <TrophyIcon className="h-10 w-10 text-[#FFD700]" />,
    title: "Gaming Specialists",
    description: "We understand gaming content and know how to make it engaging."
  },
  {
    icon: <ZapIcon className="h-10 w-10 text-[#FFD700]" />,
    title: "High Energy Edits",
    description: "Dynamic effects and transitions that keep viewers watching."
  },
  {
    icon: <StarIcon className="h-10 w-10 text-[#FFD700]" />,
    title: "Professional Quality",
    description: "Cinematic editing techniques that elevate your content."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-[#FFD700]">Zyro-Visuals</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            We specialize in creating high-energy gaming content that keeps viewers engaged
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111111] border border-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-opacity-80"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-center text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
