import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, getPlaceholderImageUrl, generateSrcSet, generateSizes } from '@/lib/imageOptimizer';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  onLoad
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const optimizedSrc = getOptimizedImageUrl(src, width);
  const placeholderSrc = getPlaceholderImageUrl(src);
  const srcSet = generateSrcSet(src);
  const sizes = generateSizes();
  
  // Preload high priority images
  useEffect(() => {
    if (priority && optimizedSrc) {
      const img = new Image();
      img.src = optimizedSrc;
    }
  }, [priority, optimizedSrc]);

  // Handle successful image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image load error
  const handleError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        height: height ? `${height}px` : 'auto',
        width: width ? `${width}px` : 'auto',
        background: '#111111'
      }}
    >
      {/* Low-quality placeholder */}
      {!isLoaded && !error && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-60"
          style={{ 
            filter: 'blur(10px)', 
            transform: 'scale(1.05)',
            transition: 'opacity 0.2s ease-in-out'
          }}
        />
      )}
      
      {/* Main image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet || undefined}
        sizes={sizes || undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-sm p-4 text-center">
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
}