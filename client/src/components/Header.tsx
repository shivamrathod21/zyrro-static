import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TwitterIcon, DiscordIcon, YoutubeIcon } from "@/lib/icons";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll effect for header visibility and style
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Set scrolled state for style changes
      if (currentScrollPos > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Hide header when scrolling down, show when scrolling up
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AnimatePresence>
      <motion.header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-2 bg-black/90 backdrop-blur-sm border-b border-gray-800/50 shadow-lg' 
            : 'py-4 bg-gradient-to-b from-black/80 to-transparent'
        }`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: visible ? 0 : -100, 
          opacity: visible ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <motion.div 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals.png"
                  alt="Zyro-Visuals Logo"
                  className="h-8 mr-3"
                />
                <span className="text-white text-xl font-bold tracking-wide">
                  <span>Zyro-</span>
                  <motion.span 
                    className="text-[#FFD700]" 
                    animate={{ 
                      textShadow: ['0 0 0px #FFD700', '0 0 10px #FFD700', '0 0 0px #FFD700'] 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  >
                    Visuals
                  </motion.span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="space-x-6">
                <Link href="/">
                  <motion.span
                    className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    Home
                  </motion.span>
                </Link>
                <Link href="#portfolio">
                  <motion.span
                    className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    Portfolio
                  </motion.span>
                </Link>
                <Link href="#creators">
                  <motion.span
                    className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    Creators
                  </motion.span>
                </Link>
                <Link href="#testimonials">
                  <motion.span
                    className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer"
                    whileHover={{ y: -2 }}
                  >
                    Testimonials
                  </motion.span>
                </Link>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-[#FFD700] transition-colors duration-300"
                  whileHover={{ y: -2, scale: 1.2 }}
                >
                  <TwitterIcon />
                </motion.a>
                <motion.a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-[#FFD700] transition-colors duration-300"
                  whileHover={{ y: -2, scale: 1.2 }}
                >
                  <DiscordIcon />
                </motion.a>
                <motion.a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white hover:text-[#FFD700] transition-colors duration-300"
                  whileHover={{ y: -2, scale: 1.2 }}
                >
                  <YoutubeIcon />
                </motion.a>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 font-bold">
                  <a href="#book" className="px-6">Book Now</a>
                </Button>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="md:hidden pb-4 mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </AnimatePresence>
  );
}
