import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', mouseMove);
    
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);
  
  const variants = {
    default: {
      x: mousePosition.x - 150,
      y: mousePosition.y - 150
    }
  };
  
  return (
    <motion.div
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl pointer-events-none z-0"
      variants={variants}
      animate="default"
      transition={{ 
        type: "spring", 
        damping: 30, 
        stiffness: 100,
        mass: 0.5 
      }}
    />
  );
}