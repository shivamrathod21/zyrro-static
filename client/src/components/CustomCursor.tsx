import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Don't show custom cursor immediately to avoid jumpy start
    const timer = setTimeout(() => setIsActive(true), 500);
    
    // Track mouse position
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    // Track clicks for animation
    const mouseDown = () => setCursorVariant('click');
    const mouseUp = () => setCursorVariant('default');
    
    // Track hover states
    const handleMouseEnter = () => setCursorVariant('hover');
    const handleMouseLeave = () => setCursorVariant('default');
    
    // Add listeners for cursor behavior
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    
    // Add listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      clearTimeout(timer);
    };
  }, []);
  
  const getVariantStyle = () => {
    switch(cursorVariant) {
      case 'default':
        return {
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          height: 20,
          width: 20,
          backgroundColor: '#FFD700',
          opacity: 0.5
        };
      case 'hover':
        return {
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          height: 40,
          width: 40,
          backgroundColor: '#FFD700',
          border: '2px solid white',
          opacity: 0.8
        };
      case 'click':
        return {
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          height: 10,
          width: 10,
          backgroundColor: 'white',
          opacity: 0.8
        };
      default:
        return {};
    }
  };
  
  if (!isActive) return null;
  
  return (
    <motion.div
      className="custom-cursor"
      animate={getVariantStyle()}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        mass: 0.5
      }}
      style={{ mixBlendMode: 'difference' }}
    />
  );
}