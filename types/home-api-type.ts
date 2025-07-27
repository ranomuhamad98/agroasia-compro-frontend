import type { GlobalApiFooter, GlobalApiHeader } from "./global-api-type";

export interface AboutUs {
  media_link: string;
  title: string;
  sub_title: string;
  list: {
    title: string;
    content: string;
  }[];
}

export interface Category {
  name: string;
  image: string;
  id: string;
}

export interface TopProduct {
  name: string;
  summary: string;
  image: string;
  category: string;
  id: string;
}

export interface TopProductSection {
  image: string;
  title: string;
}

export interface Program {
  image: string;
  title: string;
  list: {
    title: string;
    content: string;
  }[];
}

export interface Featured {
  icon: string;
  title: string;
  content: string;
}

export interface FAQ {
  title: string;
  content: string;
}

export interface Header {
  option_language_active: boolean;
  logo: string;
  city: string;
  email: string;
}

export interface Footer {
  about_us: string;
  whatsapp_prerequisite_text: string;
  copyright_text: string;
  sosmed_linkedin: string;
  email: string;
  phone_number: string;
  pt_name: string;
  whatsapp_number: string;
  address: string;
  about_us_text: string;
  sosmed_facebook: string;
  sosmed_twitter: string;
  sosmed_youtube: string;
}

export interface HomeApiResponse {
  status: number;
  message: string;
  slider: any[];
  about_us: AboutUs;
  categories: Category[];
  top_products: TopProduct[];
  top_product_section: TopProductSection;
  program: Program;
  featured: Featured[];
  testimonials: any[];
  faq: FAQ[];
  header: GlobalApiHeader;
  footer: GlobalApiFooter;
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
} 