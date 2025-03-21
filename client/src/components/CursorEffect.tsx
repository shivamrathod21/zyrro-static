import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number }>>(Array(5).fill({ x: 0, y: 0 }));
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>(Array(5).fill(null));
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    let animationFrameId: number;
    let currentMouseX = 0;
    let currentMouseY = 0;
    
    const updatePositions = () => {
      setMousePosition({
        x: currentMouseX,
        y: currentMouseY
      });

      // Update trail positions with a delay effect
      setTrailPositions(prev => {
        const newPositions = [...prev];
        newPositions.pop();
        newPositions.unshift({ x: currentMouseX, y: currentMouseY });
        return newPositions;
      });

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    const handleMouseMove = (e: MouseEvent) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
    };

    // Handle hover effects on interactive elements
    const handleElementHover = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, .interactive');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementHover);
      element.addEventListener('mouseleave', handleElementLeave);
    });

    window.addEventListener('mousemove', handleMouseMove);

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementHover);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, []);

  // Magnetic effect animation
  const magneticAnimation = {
    scale: isHovering ? 1.5 : 1,
    opacity: isHovering ? 0.8 : 0.4,
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full bg-[#FFD700] mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 2 : 1,
          opacity: 0.6,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 400,
          mass: 0.3,
          restDelta: 0.001
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 rounded-full border-2 border-[#FFD700] pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
          ...magneticAnimation
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
          restDelta: 0.001
        }}
      />

      {/* Particle trails */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={index}
          ref={el => trailRefs.current[index] = el}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FFD700] pointer-events-none"
          style={{
            opacity: 0.2 - index * 0.03,
            filter: `blur(${index * 2}px)`,
            zIndex: 49 - index
          }}
          animate={{
            x: pos.x - 4,
            y: pos.y - 4,
            scale: 1 - index * 0.1
          }}
          transition={{
            type: "spring",
            damping: 40 + index * 3,
            stiffness: 300,
            mass: 0.2 + index * 0.05,
            restDelta: 0.001
          }}
        />
      ))}

      {/* Background glow effect */}
      <motion.div
        className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 blur-3xl pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 100,
          mass: 1
        }}
      />
    </>
  );
}