/**
 * Image optimization utilities for improving performance
 */

/**
 * Get a resized image URL for responsive images
 * This uses URL parameters that many image CDNs support
 * 
 * @param url Original image URL
 * @param width Desired width
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(url: string, width: number = 800, quality: number = 80): string {
  // Check if it's an Unsplash image which has its own optimization API
  if (url.includes('unsplash.com')) {
    // Extract base URL without any existing parameters
    const baseUrl = url.split('?')[0];
    // Add Unsplash API parameters
    return `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  
  // Default case - return original URL
  return url;
}

/**
 * Generates a blurred placeholder image URL
 * 
 * @param url Original image URL
 * @returns URL for tiny blurred placeholder
 */
export function getPlaceholderImageUrl(url: string): string {
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    // Very small blurred image for placeholder
    return `${baseUrl}?w=20&blur=50&q=30`;
  }
  
  return url;
}

/**
 * Generates responsive image srcset attribute
 * 
 * @param url Base image URL
 * @returns srcset string for responsive images
 */
export function generateSrcSet(url: string): string {
  if (!url.includes('unsplash.com')) {
    return ''; // Only works with providers that support size parameters
  }
  
  const baseUrl = url.split('?')[0];
  const sizes = [320, 640, 960, 1280, 1920];
  
  return sizes
    .map(size => `${baseUrl}?w=${size}&q=80&auto=format&fit=crop ${size}w`)
    .join(', ');
}

/**
 * Generates sizes attribute for responsive images
 */
export function generateSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Optimized image component props
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * React component equivalent (JSX version to be used in actual component)
 * 
 * Example usage:
 * <OptimizedImage 
 *   src="https://example.com/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   className="rounded-lg"
 * />
 */
/* 
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false 
}: OptimizedImageProps) {
  const optimizedSrc = getOptimizedImageUrl(src, width);
  const placeholderSrc = getPlaceholderImageUrl(src);
  const srcSet = generateSrcSet(src);
  const sizes = generateSizes();
  
  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={{ backgroundColor: '#222', color: 'transparent' }}
    />
  );
}
*/