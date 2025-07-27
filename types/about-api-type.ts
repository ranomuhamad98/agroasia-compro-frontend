export interface AboutMilestone {
  title: string;
  sub_title: string;
  content: string;
  media_link: string;
  tahun: number;
  position: number;
  id: string;
}

export interface AboutVideo {
  video_link: string;
  our_worker: string;
}

export interface AboutValue {
  title: string;
  content: string;
}

export interface AboutValueSection {
  list: AboutValue[];
  sub_title: string;
  title: string;
}

export interface AboutJumbotron {
  image: string;
  title: string;
}

export interface AboutHeader {
  option_language_active: boolean;
  logo: string;
  city: string;
  email: string;
}

export interface AboutFooter {
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

export interface AboutApiData {
  jumbotron: AboutJumbotron;
  milestones: AboutMilestone[];
  video: AboutVideo;
  our_people: any[];
  our_value: AboutValueSection;
  gallery: any[];
  header: AboutHeader;
  footer: AboutFooter;
}

export interface AboutApiResponse {
  status: number;
  message: string;
  data: AboutApiData;
} 