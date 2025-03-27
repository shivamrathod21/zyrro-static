import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaYoutube, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { Mail } from "lucide-react";

const videos = [
  {
    id: 1,
    embedId: "Hcxt5BOMe2E",
    title: "Featured Gaming Montage",
    description: "Latest gaming montage showcasing epic moments and stunning visual effects."
  },
  {
    id: 2,
    embedId: "09SrtkpeoXU",
    title: "Gaming Highlights 2024",
    description: "Intense gaming action with professional editing and transitions."
  },
  {
    id: 3,
    embedId: "YUhMjqFP2I0",
    title: "Esports Showcase",
    description: "Professional tournament highlights and competitive gameplay moments."
  },
  {
    id: 4,
    embedId: "x3nmdp0YsLE",
    title: "Stream Highlights",
    description: "Best moments from live streams with dynamic effects."
  },
  {
    id: 5,
    embedId: "1Wy4iWt8tRc",
    title: "Gaming Portfolio",
    description: "Showcase of gaming edits and visual effects mastery."
  },
  {
    id: 6,
    embedId: "qFl0Fk_RwBE",
    title: "Advanced Gaming Edits",
    description: "Showcasing advanced editing techniques and special effects."
  },
  {
    id: 7,
    embedId: "_HEtLfU_ha0",
    title: "Pro Gaming Moments",
    description: "Collection of professional gaming highlights and epic plays."
  },
  {
    id: 8,
    embedId: "Hx0lj5SZD-M",
    title: "Competitive Gameplay",
    description: "High-intensity competitive gaming moments with dynamic editing."
  },
  {
    id: 9,
    embedId: "KxZhBd_7T0Q",
    title: "Gaming Excellence",
    description: "Masterful editing showcasing the best of gaming content."
  }
];

const SocialLink = ({ icon: Icon, href, label }: { icon: any; href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </a>
);

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  platform: string;
  game: string;
  category: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Fortnite Montage 2024",
    description: "High-energy gameplay highlights with stunning visual effects",
    imageSrc: "https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/fortnite-thumbnail.jpg",
    platform: "PC",
    game: "Fortnite",
    category: "Montage"
  },
  {
    id: 2,
    title: "Call of Duty Highlights",
    description: "Professional tournament gameplay with dynamic transitions",
    imageSrc: "https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/cod-thumbnail.jpg",
    platform: "PlayStation",
    game: "Call of Duty",
    category: "Highlights"
  },
  {
    id: 3,
    title: "Valorant Pro Plays",
    description: "Competitive gameplay moments with cinematic effects",
    imageSrc: "https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/valorant-thumbnail.jpg",
    platform: "PC",
    game: "Valorant",
    category: "Pro Plays"
  },
  {
    id: 4,
    title: "Apex Legends Stream",
    description: "Live stream highlights with seamless transitions",
    imageSrc: "https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/apex-thumbnail.jpg",
    platform: "Xbox",
    game: "Apex Legends",
    category: "Stream"
  }
];

export default function Portfolio() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const socialLinks = [
    { icon: FaTwitter, href: "https://x.com/ZyroVisual", label: "Twitter" },
    { icon: FaDiscord, href: "https://discord.com/users/863354644926693396", label: "Discord" },
    { icon: Mail, href: "mailto:zyrovisual158@gmail.com", label: "Email" }
  ];

  const creatorInfo = {
    name: "Zyro Visuals",
    bio: "Professional gaming video editor specializing in high-energy montages, stream highlights, and esports content. Creating stunning visual experiences that capture the excitement of gaming.",
    experience: "5+ years of video editing experience",
    specialties: ["Gaming Montages", "Stream Highlights", "Esports Content", "Motion Graphics"]
  };

  const stats = [
    { label: "Projects Completed", value: "221+" },
    { label: "Happy Clients", value: "30+" },
    { label: "Agency Years Experience", value: "1+" }
  ];

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-[#111111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Video Section */}
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentVideo.embedId}`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className={`aspect-video bg-[#222222] rounded-lg overflow-hidden transition-all duration-300 ${
                    currentVideo.id === video.id
                      ? "ring-2 ring-[#FFD700] transform scale-105"
                      : "hover:ring-2 hover:ring-[#FFD700]/50"
                  }`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Creator Info Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Iceland'] tracking-wider">
                About <span className="text-[#FFD700]">The Creator</span>
              </h2>
              <p className="text-gray-400 mb-6">{creatorInfo.bio}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-[#222222] p-4 rounded-lg text-center">
                    <div className="text-[#FFD700] text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {creatorInfo.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-[#222222] text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Connect With Me</h3>
              <div className="flex flex-col space-y-3">
                {socialLinks.map((link, index) => (
                  <SocialLink key={index} {...link} />
                ))}
              </div>
            </div>

            <Button
              asChild
              className="w-full sm:w-auto bg-[#FFD700] text-black hover:bg-[#FFD700]/80 transition-all duration-300"
            >
              <a
                href="https://calendly.com/zyrovisuals/book"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                Book a Consultation
              </a>
            </Button>
          </div>
        </motion.div>


      </div>
    </section>
  );
}

const getOptimizedImageUrl = (url: string, width: number, quality: number) => {
  return url; // In a real app, you'd implement image optimization here
};

const generateSrcSet = (url: string) => {
  return `${url} 1x, ${url} 2x`; // In a real app, you'd generate proper srcSet
};

const generateSizes = () => {
  return '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';
};
