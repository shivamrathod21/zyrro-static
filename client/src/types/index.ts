export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  category: string;
  imageSrc: string;
}

export interface Creator {
  name: string;
  subscribers: string;
  testimonial: string;
  avatar: string;
  isCustomAvatar?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  channel: string;
  serviceType: string;
  projectDetails: string;
  budgetRange: string;
}
