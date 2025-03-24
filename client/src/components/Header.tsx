import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TwitterIcon, DiscordIcon } from "@/lib/icons";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header style changes only
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Set scrolled state for style changes
      if (currentScrollPos > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to scroll to section smoothly
  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-black/90 backdrop-blur-sm border-b border-gray-800/50 shadow-lg' 
          : 'py-4 bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: 0, opacity: 1 }}
      animate={{ opacity: 1 }}
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
              <span className="text-white text-xl font-bold tracking-wider">
                <span className="font-['Iceland'] tracking-[0.2em] text-2xl hover:text-[#FFD700] transition-all duration-300">Zyro-</span>
                <motion.span 
                  className="text-[#FFD700] font-['Iceland'] tracking-[0.2em] text-2xl"
                  animate={{ 
                    textShadow: ['0 0 0px #FFD700', '0 0 15px #FFD700', '0 0 0px #FFD700'],
                    filter: ['drop-shadow(0 0 0px #FFD700)', 'drop-shadow(0 0 8px #FFD700)', 'drop-shadow(0 0 0px #FFD700)']
                  }}
                  transition={{ 
                    duration: 2, 
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
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer font-['Iceland'] tracking-wider px-4 py-2 inline-block"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer font-['Iceland'] tracking-wider px-4 py-2 inline-block"
                  onClick={scrollToSection('portfolio')}
                >
                  Portfolio
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer font-['Iceland'] tracking-wider px-4 py-2 inline-block"
                  onClick={scrollToSection('creators')}
                >
                  Creators
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-white hover:text-[#FFD700] font-medium transition-colors duration-300 cursor-pointer font-['Iceland'] tracking-wider px-4 py-2 inline-block"
                  onClick={scrollToSection('testimonials')}
                >
                  Testimonials
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <motion.a 
                href="https://x.com/ZyroVisual" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
              >
                <TwitterIcon />
              </motion.a>
              <motion.a 
                href="https://discord.com/users/863354644926693396" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
              >
                <DiscordIcon />
              </motion.a>
              <motion.a 
                href="mailto:zyrovisual158@gmail.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-[#FFD700] transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.2, filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))" }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/80 font-bold font-['Iceland'] tracking-wider"
              >
                <a 
                  href="#book" 
                  onClick={scrollToSection('book')}
                  className="px-6"
                >
                  Book Now
                </a>
              </Button>
            </motion.div>

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
                <a 
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300 font-['Iceland'] tracking-wider"
                >
                  Home
                </a>
                <a 
                  href="#portfolio" 
                  onClick={scrollToSection('portfolio')}
                  className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300 font-['Iceland'] tracking-wider"
                >
                  Portfolio
                </a>
                <a 
                  href="#creators" 
                  onClick={scrollToSection('creators')}
                  className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300 font-['Iceland'] tracking-wider"
                >
                  Creators
                </a>
                <a 
                  href="#testimonials" 
                  onClick={scrollToSection('testimonials')}
                  className="text-white hover:text-[#FFD700] font-medium py-2 transition-colors duration-300 font-['Iceland'] tracking-wider"
                >
                  Testimonials
                </a>

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

                <a 
                  href="#book" 
                  onClick={scrollToSection('book')}
                  className="bg-[#FFD700] text-black px-4 py-2 rounded font-semibold hover:bg-opacity-80 transition-all duration-300 inline-block w-fit font-['Iceland'] tracking-wider"
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
