import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  
  // Track mouse activity to hide/show cursor
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseActivity = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        // Only hide cursor after extended period of inactivity
        if (cursorRef.current) {
          setIsVisible(false);
        }
      }, 5000); // 5 seconds of inactivity
    };
    
    window.addEventListener('mousemove', handleMouseActivity);
    window.addEventListener('mousedown', handleMouseActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseActivity);
      window.removeEventListener('mousedown', handleMouseActivity);
      clearTimeout(timeout);
    };
  }, []);
  
  // Main cursor animation and event logic
  useEffect(() => {
    // Don't show custom cursor immediately to avoid jumpy start
    const initTimer = setTimeout(() => setIsActive(true), 300);
    
    // Add 'has-custom-cursor' class to body for proper styling
    document.body.classList.add('has-custom-cursor');
    
    // Custom cursor variables
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let magneticPullX = 0;
    let magneticPullY = 0;
    
    // Smooth animation for cursor using RAF
    const animateCursor = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }
      
      const deltaTime = time - (previousTimeRef.current || 0);
      previousTimeRef.current = time;
      
      // Calculate cursor position with dynamic easing
      const baseEasing = 0.08; // Base easing for smoother movement
      const magneticEasing = cursorVariant === 'hover' ? 0.2 : baseEasing;
      
      // Apply magnetic effect when hovering
      if (cursorVariant === 'hover') {
        const magneticStrength = 40; // Adjust magnetic pull strength
        targetX = mouseX + magneticPullX * magneticStrength;
        targetY = mouseY + magneticPullY * magneticStrength;
      } else {
        targetX = mouseX;
        targetY = mouseY;
      }
      
      // Update cursor position with spring physics
      const dx = targetX - cursorX;
      const dy = targetY - cursorY;
      const acceleration = cursorVariant === 'hover' ? 0.15 : 0.1;
      
      cursorX += dx * acceleration;
      cursorY += dy * acceleration;
      
      // Apply position to cursor elements with hardware acceleration
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${cursorVariant === 'hover' ? 1.5 : 1})`;
      }
      
      if (cursorDotRef.current) {
        // The dot follows the mouse with slight delay for trailing effect
        const dotEasing = 0.2;
        const dotX = mouseX + (cursorX - mouseX) * dotEasing;
        const dotY = mouseY + (cursorY - mouseY) * dotEasing;
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) scale(${cursorVariant === 'click' ? 0.5 : 1})`;
      }
      
      requestRef.current = requestAnimationFrame(animateCursor);
    };
    
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Track clicks for animation
    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');
    
    // Track hover states on interactive elements
    const handleElementMouseEnter = () => setCursorVariant('hover');
    const handleElementMouseLeave = () => setCursorVariant('default');
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .interactive'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementMouseEnter);
      el.addEventListener('mouseleave', handleElementMouseLeave);
    });
    
    // Start the animation
    requestRef.current = requestAnimationFrame(animateCursor);
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      document.body.classList.remove('has-custom-cursor');
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementMouseEnter);
        el.removeEventListener('mouseleave', handleElementMouseLeave);
      });
      
      clearTimeout(initTimer);
    };
  }, []);
  
  if (!isActive) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor circle with glow effect */}
          <motion.div
            ref={cursorRef}
            className={`fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-screen ${cursorVariant === 'hover' ? 'cursor-hover' : ''} ${cursorVariant === 'click' ? 'cursor-click' : ''}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: cursorVariant === 'click' ? 0.9 : 0.7,
              scale: cursorVariant === 'hover' ? 2 : 1
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Inner circle */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full bg-[#FFD700] opacity-30 blur-sm" />
              <div className="absolute inset-2 rounded-full bg-[#FFD700] opacity-50" />
              {cursorVariant === 'hover' && (
                <div className="absolute inset-[-8px] rounded-full border-2 border-[#FFD700] opacity-20 animate-pulse" />
              )}
            </div>
          </motion.div>
          
          {/* Trailing particles */}
          <motion.div
            ref={cursorDotRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {/* Multiple trailing dots with different sizes and delays */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-[#FFD700]"
                  style={{
                    width: `${6 - i * 2}px`,
                    height: `${6 - i * 2}px`,
                    opacity: 0.3 - i * 0.1
                  }}
                  animate={{
                    scale: cursorVariant === 'click' ? [1, 1.5, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}