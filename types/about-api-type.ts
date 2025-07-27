import type { GlobalApiFooter, GlobalApiHeader } from "./global-api-type";

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

export interface AboutApiData {
  jumbotron: AboutJumbotron;
  milestones: AboutMilestone[];
  video: AboutVideo;
  our_people: any[];
  our_value: AboutValueSection;
  gallery: any[];
  header: GlobalApiHeader;
  footer: GlobalApiFooter;
}

export interface AboutApiResponse {
  status: number;
  message: string;
  data: AboutApiData;
} 