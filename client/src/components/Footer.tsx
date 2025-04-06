import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TwitterIcon,
  DiscordIcon,
  EnvelopeIcon,
  ClockIcon
} from "@/lib/icons";

// LinkedIn Icon Component (used in credit section)
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Footer() {
  return (
    <footer id="footer" className="py-12 bg-[#222222] border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding - Logo & Tagline (Kept as per your request) */}
          <div className="md:col-span-1">
            <img src="https://zyrovisuals8055.s3.us-west-2.amazonaws.com/zyrologowithoutbg.png" alt="Zyro-Visuals Logo" className="h-12" />
            <p className="text-gray-400 mt-2">Bringing your visuals to life.</p>
            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <motion.a 
                href="https://x.com/ZyroVisual" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
                aria-label="Twitter Profile"
                title="Follow us on Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://discord.com/users/863354644926693396" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
                aria-label="Discord Server"
                title="Join our Discord server"
              >
                <DiscordIcon className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="mailto:zyrovisual158@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
                aria-label="Email"
                title="Send us an email"
              >
                <EnvelopeIcon className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Gaming Highlights
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Stream Compilations
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Montage Editing
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Visual Effects
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Gaming Trailers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="mailto:zyrovisual158@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <EnvelopeIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                  <span className="text-gray-400 group-hover:text-[#FFD700] transition-colors duration-300">zyrovisual158@gmail.com</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="https://discord.com/users/863354644926693396"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <DiscordIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                  <span className="text-gray-400 group-hover:text-[#FFD700] transition-colors duration-300">discord.com/users/863354644926693396</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="https://x.com/ZyroVisual"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start group"
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <TwitterIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                  <span className="text-gray-400 group-hover:text-[#FFD700] transition-colors duration-300">@ZyroVisual</span>
                </motion.a>
              </li>
              <li className="flex items-start">
                <ClockIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">Response Time: Within 24 hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Built and deployed by{" "}
            <a 
              href="https://www.linkedin.com/in/shivamrathod721" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-[#0077b5] inline-flex items-center gap-1"
            >
              <LinkedInIcon className="h-4 w-4" />
              Shivam Rathod
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
