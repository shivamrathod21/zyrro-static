import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const requestRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      contextRef.current = ctx;
    }

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5,
          targetAlpha: Math.random() * 0.5
        });
      }

      particlesRef.current = particles;
    };

    // Animation loop
    const animate = (timestamp: number) => {
      const ctx = contextRef.current;
      if (!ctx) return;

      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      const deltaTime = (timestamp - previousTimeRef.current) / 16; // Normalize to ~60fps
      previousTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enable smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Apply velocity with delta time
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;

        // Smooth bounce off edges with easing
        const bounce = 0.8;
        if (particle.x < 0) {
          particle.x = 0;
          particle.vx = Math.abs(particle.vx) * bounce;
        } else if (particle.x > canvas.width) {
          particle.x = canvas.width;
          particle.vx = -Math.abs(particle.vx) * bounce;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy = Math.abs(particle.vy) * bounce;
        } else if (particle.y > canvas.height) {
          particle.y = canvas.height;
          particle.vy = -Math.abs(particle.vy) * bounce;
        }

        // Enhanced mouse interaction with velocity influence
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const easedForce = force * force * (3 - 2 * force); // Smooth step interpolation
          particle.targetAlpha = Math.min(0.9, 0.5 + easedForce * 0.4);
          
          // Enhanced particle movement with mouse velocity influence
          const repelStrength = 0.02 * deltaTime;
          const velocityInfluence = 0.3;
          
          // Combine repulsion with mouse velocity
          particle.vx = particle.vx * 0.92 +
            (-dx / distance) * easedForce * repelStrength +
            velocityRef.current.x * velocityInfluence * easedForce;
          particle.vy = particle.vy * 0.92 +
            (-dy / distance) * easedForce * repelStrength +
            velocityRef.current.y * velocityInfluence * easedForce;
          
          // Add slight randomness for organic movement
          particle.vx += (Math.random() - 0.5) * 0.05;
          particle.vy += (Math.random() - 0.5) * 0.05;
        } else {
          particle.targetAlpha = 0.15 + Math.random() * 0.1;
          
          // Smoother return to neutral state
          particle.vx *= 0.95;
          particle.vy *= 0.95;
        }

        // Smooth alpha transition with easing
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.15 * deltaTime;

        // Draw particle with anti-aliasing
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${particle.alpha})`;
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Handle mouse movement with velocity tracking
    const handleMouseMove = (e: MouseEvent) => {
      const { x: prevX, y: prevY } = mouseRef.current;
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // Calculate mouse velocity
      velocityRef.current = {
        x: (currentX - prevX) * 0.1,
        y: (currentY - prevY) * 0.1
      };

      mouseRef.current = {
        x: currentX,
        y: currentY,
        prevX: prevX,
        prevY: prevY
      };
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Initialize and start animation
    initParticles();
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      style={{ background: 'transparent' }}
    />
  );
}