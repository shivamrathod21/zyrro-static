import { motion } from "framer-motion";
import { YoutubeIcon } from "@/lib/icons";

interface Creator {
  name: string;
  image: string;
  subscribers: string;
  youtubeUrl: string;
  description: string;
  thumbnail?: string;
}

const creators: Creator[] = [
  {
    name: "AshleyBunni",
    image: "https://yt3.googleusercontent.com/ytc/AIf8zZTGwXGLNxPnOG6BLJgqrR4f2uo1ivVBJHFUfw=s176-c-k-c0x00ffffff-no-rj",
    subscribers: "348K",
    youtubeUrl: "https://www.youtube.com/@AshleyBunni",
    description: "Gaming content creator known for engaging gameplay and entertaining streams.",
    thumbnail: "https://i.ytimg.com/vi/latest/maxresdefault.jpg"
  },
  {
    name: "Valekis",
    image: "https://yt3.googleusercontent.com/ytc/AIf8zZQXyxaJvvN6EqwGd4I0l2KpYGGGVVGc0vOp2Q=s176-c-k-c0x00ffffff-no-rj",
    subscribers: "281K",
    youtubeUrl: "https://www.youtube.com/@Valekis",
    description: "Rising gaming content creator with unique style and engaging community.",
    thumbnail: "https://i.ytimg.com/vi/latest/maxresdefault.jpg"
  },
  {
    name: "JustmaikoGaming",
    image: "https://yt3.googleusercontent.com/default.jpg",
    subscribers: "125K",
    youtubeUrl: "https://www.youtube.com/@JustmaikoGaming",
    description: "Expert gaming analysis and strategy guides for competitive players.",
    thumbnail: "https://i.ytimg.com/vi/latest/maxresdefault.jpg"
  }
];

export default function Creators() {
  return (
    <section id="creators" className="py-24 bg-[#111111]">
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
            We're proud to work with these amazing content creators, helping them bring their vision to life through professional editing and visual effects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div
                className="bg-[#222222] rounded-lg overflow-hidden border border-gray-800 hover:border-[#FFD700] transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <div className="relative group mb-4">
                    <img
                      src={creator.image}
                      alt={`${creator.name}'s profile`}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.a
                        href={creator.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#FFD700] transition-colors duration-300"
                        whileHover={{ scale: 1.2 }}
                      >
                        <YoutubeIcon className="w-10 h-10" />
                      </motion.a>
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src={creator.thumbnail}
                      alt={`${creator.name}'s latest video`}
                      className="w-full h-40 object-cover rounded-b-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-white text-sm font-medium">Watch Latest</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white font-['Iceland'] tracking-wider">
                      {creator.name}
                    </h3>
                    <span className="text-[#FFD700] text-sm font-semibold">
                      {creator.subscribers} subscribers
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{creator.description}</p>
                  <motion.a
                    href={creator.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-[#FFD700] hover:text-white transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-2">Visit Channel</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
