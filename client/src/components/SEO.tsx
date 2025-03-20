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
  title = 'Zyro Visuals - Premium Gaming Video Editing Services',
  description = 'Professional video editing services for gaming content creators. Elevate your gaming content with stunning visual effects, transitions, and cinematics.',
  keywords = 'gaming video editing, game highlight editing, gaming montage, esports editing, stream highlights, gaming content creation',
  ogTitle = 'Zyro Visuals - Premium Gaming Video Editing Services',
  ogDescription = 'Transform your gaming content with professional video editing. Elevate your YouTube and Twitch content to hook viewers and grow your channel.',
  ogImage = 'https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals-og.png',
  ogUrl = 'https://zyro-visuals.com',
  twitterCard = 'summary_large_image',
  twitterTitle = 'Zyro Visuals - Premium Gaming Video Editing',
  twitterDescription = 'Professional video editing services for gaming creators. We make content that hooks viewers.',
  twitterImage = 'https://raw.githubusercontent.com/shivamrathod21/ZYRO_VISUAL/main/images/zyro-visuals-twitter.png',
  canonicalUrl = 'https://zyro-visuals.com',
  structuredData
}: SEOProps) {
  // Create structured data for local business
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Zyro Visuals',
    description: description,
    image: ogImage,
    url: canonicalUrl,
    telephone: '+1-555-555-5555',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Online Service',
      addressLocality: 'Remote',
      addressRegion: 'World',
      postalCode: '00000',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.0060
    },
    sameAs: [
      'https://www.linkedin.com/in/shivamrathod721',
      'https://twitter.com/zyrovisuals',
      'https://www.youtube.com/zyrovisuals',
      'https://www.instagram.com/zyrovisuals'
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '17:00'
    },
    priceRange: '$$'
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Zyro Visuals" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Zyro Visuals" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#FFD700" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
}