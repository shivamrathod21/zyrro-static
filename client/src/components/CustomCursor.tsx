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
    
    // Smooth animation for cursor using RAF
    const animateCursor = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
      }
      
      const deltaTime = time - (previousTimeRef.current || 0);
      previousTimeRef.current = time;
      
      // Calculate cursor position with smooth easing
      const easing = 0.15; // Lower for smoother movement
      
      // Update cursor position with easing
      cursorX += (mouseX - cursorX) * easing;
      cursorY += (mouseY - cursorY) * easing;
      
      // Apply position to cursor elements with hardware acceleration
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      if (cursorDotRef.current) {
        // The dot follows the mouse more directly for precision
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
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
          {/* Main cursor circle */}
          <motion.div
            ref={cursorRef}
            className={`custom-cursor ${cursorVariant === 'hover' ? 'cursor-hover' : ''} ${cursorVariant === 'click' ? 'cursor-click' : ''}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: cursorVariant === 'click' ? 0.9 : 0.6,
              scale: cursorVariant === 'hover' ? 1.5 : 1,
              backgroundColor: cursorVariant === 'hover' ? 'rgba(255, 215, 0, 0.2)' : '#FFD700'
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          />
          
          {/* Small dot that follows exactly for precision */}
          <motion.div
            ref={cursorDotRef}
            className="fixed top-0 left-0 w-1 h-1 rounded-full bg-white pointer-events-none z-[10000]"
            style={{ marginLeft: '-0.5px', marginTop: '-0.5px' }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: cursorVariant === 'hover' ? 0 : 0.7,
              scale: cursorVariant === 'click' ? 1.5 : 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}