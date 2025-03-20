import { Link } from "wouter";
import {
  TwitterIcon,
  YoutubeIcon,
  DiscordIcon,
  InstagramIcon,
  EnvelopeIcon,
  ClockIcon
} from "@/lib/icons";

export default function Footer() {
  return (
    <footer className="py-12 bg-[#222222] border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img 
                src="https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals.png" 
                alt="Zyro-Visuals Logo" 
                className="h-8 mr-3"
              />
              <span className="text-white text-xl font-bold">
                <span>Zyro-</span><span className="text-[#FFD700]">Visuals</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium video editing services for gaming content creators who want to stand out.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Home</Link></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Services</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Portfolio</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Testimonials</a></li>
              <li><a href="#book" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Book Now</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Gaming Highlights</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Stream Compilations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Montage Editing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Visual Effects</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Gaming Trailers</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <EnvelopeIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-400">contact@zyro-visuals.com</span>
              </li>
              <li className="flex items-start">
                <DiscordIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-400">discord.gg/zyrovisuals</span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5" />
                <span className="text-gray-400">Response Time: Within 24 hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Zyro-Visuals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
