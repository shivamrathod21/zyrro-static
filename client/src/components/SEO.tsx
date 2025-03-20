import { Helmet } from 'react-helmet';

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
};

export default function SEO({
  title = 'Zyro Visuals | Premium Gaming and Esports Video Editing',
  description = 'Elevate your gaming content with professional video editing for streamers, content creators, and esports teams. High-quality gaming highlights, montages, and trailers that amplify your online presence.',
  keywords = 'gaming video editing, esports video editing, streamer content, gaming montages, gaming highlights, professional video editing, twitch highlights, youtube gaming',
  ogTitle,
  ogDescription,
  ogImage = 'https://zyrovisuals.com/og-image.jpg',
  ogUrl = 'https://zyrovisuals.com',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl = 'https://zyrovisuals.com',
  structuredData
}: SEOProps) {
  // Default structured data for a video editing service
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Zyro Visuals',
    description: description,
    url: canonicalUrl,
    logo: 'https://zyrovisuals.com/logo.png',
    sameAs: [
      'https://twitter.com/zyrovisuals',
      'https://www.instagram.com/zyrovisuals',
      'https://www.youtube.com/zyrovisuals',
      'https://www.linkedin.com/in/shivamrathod721'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128',
      longitude: '-74.0060'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    priceRange: '$$',
    telephone: '+1-555-123-4567',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '40.7128',
        longitude: '-74.0060'
      },
      geoRadius: '50000'
    },
    offers: {
      '@type': 'Offer',
      category: 'Video Editing Services',
      description: 'Professional gaming video editing for content creators, streamers, and esports teams.',
      availability: 'https://schema.org/InStock'
    }
  };
  
  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={ogUrl} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Additional Meta Tags for SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Zyro Visuals" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  );
}