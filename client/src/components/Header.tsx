import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TwitterIcon, DiscordIcon, YoutubeIcon } from "@/lib/icons";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800 bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals.png"
              alt="Zyro-Visuals Logo"
              className="h-8 mr-3"
            />
            <span className="text-white text-xl font-bold">
              <span>Zyro-</span><span className="text-[#FFD700]">Visuals</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300">Home</Link>
            <Link href="#portfolio" className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300">Portfolio</Link>
            <Link href="#creators" className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300">Creators</Link>
            <Link href="#testimonials" className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300">Testimonials</Link>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <TwitterIcon />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <DiscordIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <YoutubeIcon />
              </a>
            </div>

            <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80">
              <a href="#book">Book Now</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden pb-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-3">
            <Link href="/" className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300">Home</Link>
            <Link href="#portfolio" className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300">Portfolio</Link>
            <Link href="#creators" className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300">Creators</Link>
            <Link href="#testimonials" className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300">Testimonials</Link>

            <div className="flex items-center space-x-4 py-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <TwitterIcon />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <DiscordIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFD700] transition-colors duration-300">
                <YoutubeIcon />
              </a>
            </div>

            <a href="#book" className="bg-[#FFD700] text-black px-4 py-2 rounded font-semibold hover:bg-opacity-80 transition-all duration-300 inline-block w-fit">
              Book Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
