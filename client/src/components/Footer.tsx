import { Link } from "wouter";
import {
  TwitterIcon,
  YoutubeIcon,
  DiscordIcon,
  InstagramIcon,
  EnvelopeIcon,
  ClockIcon
} from "@/lib/icons";

// LinkedIn Icon Component
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
              <a href="https://www.linkedin.com/in/shivamrathod721" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#0077b5] transition-colors duration-300"
                aria-label="LinkedIn Profile"
                title="Connect with us on LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors duration-300"
                aria-label="Twitter Profile"
                title="Follow us on Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="YouTube Channel"
                title="Subscribe to our YouTube channel"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#5865F2] transition-colors duration-300"
                aria-label="Discord Server"
                title="Join our Discord server"
              >
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#E1306C] transition-colors duration-300"
                aria-label="Instagram Profile"
                title="Follow us on Instagram"
              >
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
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Gaming Highlights</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Stream Compilations</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Montage Editing</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Visual Effects</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">Gaming Trailers</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <EnvelopeIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">contact@zyro-visuals.com</span>
              </li>
              <li className="flex items-start">
                <DiscordIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">discord.gg/zyrovisuals</span>
              </li>
              <li className="flex items-start">
                <LinkedInIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <a href="https://www.linkedin.com/in/shivamrathod721" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300">
                  Connect on LinkedIn
                </a>
              </li>
              <li className="flex items-start">
                <ClockIcon className="text-[#FFD700] mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-400">Response Time: Within 24 hours</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            © {new Date().getFullYear()} Zyro-Visuals. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-2">
            Built and deployed by 
            <a 
              href="https://www.linkedin.com/in/shivamrathod721" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-[#0077b5] transition-colors duration-300 inline-flex items-center"
            >
              <LinkedInIcon className="h-4 w-4 mr-1" />
              Shivam Rathod
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
