import { motion } from "framer-motion";
import { YoutubeIcon } from "@/lib/icons";

interface Creator {
  name: string;
  channelName: string;
  logo: string;
  subscribers: number;
  youtubeUrl: string;
  displaySubscribers: string;
}

const creators: Creator[] = [
  {
    name: "AyeYahZee",
    channelName: "@AyeYahZee",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/AyeYahZeeLogo.jpg",
    subscribers: 2000000,
    displaySubscribers: "2M",
    youtubeUrl: "https://www.youtube.com/@AyeYahZee"
  },
  {
    name: "Justmaikogaming",
    channelName: "@JustmaikoGaming",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/JustmaikoGaminglogo.jpg",
    subscribers: 804000,
    displaySubscribers: "804K",
    youtubeUrl: "https://www.youtube.com/@JustmaikoGaming"
  },
  {
    name: "Ashleybunni",
    channelName: "@AshleyBunni",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/AshleyBunnilogo.jpg",
    subscribers: 350000,
    displaySubscribers: "350K",
    youtubeUrl: "https://www.youtube.com/@AshleyBunni"
  },
  {
    name: "Valekis",
    channelName: "@Valekis",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/ValekisLogo.jpg",
    subscribers: 282000,
    displaySubscribers: "282K",
    youtubeUrl: "https://www.youtube.com/@Valekis"
  },
  {
    name: "Raylashon",
    channelName: "@RaylashonRP",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/Raylashonlogo.jpg",
    subscribers: 216000,
    displaySubscribers: "216K",
    youtubeUrl: "https://www.youtube.com/@RaylashonRP"
  },
  {
    name: "kiki",
    channelName: "@KikiBloxx",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/kikilogo.jpg",
    subscribers: 51600,
    displaySubscribers: "51.6K",
    youtubeUrl: "https://www.youtube.com/@KikiBloxx"
  },
  {
    name: "offcialalliebox",
    channelName: "@officialallieblox",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/officialalliebloxlogo.jpg",
    subscribers: 22000,
    displaySubscribers: "22K",
    youtubeUrl: "https://www.youtube.com/@officialallieblox/videos"
  },
  {
    name: "zariandzee",
    channelName: "@ZariandZee",
    logo: "https://zyrovisuals8055.s3.us-west-2.amazonaws.com/logo8055/ZariandZeelogo.jpg",
    subscribers: 573,
    displaySubscribers: "573",
    youtubeUrl: "https://www.youtube.com/@ZariandZee"
  }
].sort((a, b) => b.subscribers - a.subscribers);

export default function Creators() {
  return (
    <section id="creators" className="py-24 bg-black/50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4 font-['Iceland'] tracking-wider">
            Our <span className="text-[#FFD700]">Creators</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Empowering content creators with professional editing that elevates their content to new heights
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                damping: 12
              }}
            >
              <motion.a
                href={creator.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#111111] rounded-lg p-6 text-center group hover:bg-[#1a1a1a] transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <motion.div
                    className="w-full h-full rounded-full overflow-hidden border-2 border-[#FFD700] relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={creator.logo}
                      alt={`${creator.name}'s logo`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </div>

                <h3 className="text-white font-semibold mb-1 group-hover:text-[#FFD700] transition-colors duration-300">
                  {creator.channelName}
                </h3>
                <p className="text-gray-400 text-sm">
                  {creator.displaySubscribers} subscribers
                </p>

                <motion.div 
                  className="mt-4 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <YoutubeIcon className="w-6 h-6 mx-auto" />
                </motion.div>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
