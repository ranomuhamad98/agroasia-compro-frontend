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

// Our People types based on API specification
export interface OurPeoplePayload {
  image_link: string;
  name: string;
  title: string;
  lokasi: string;
  bertani_sejak: number;
  bermitra_sejak: number;
  keterangan: string;
  status: boolean;
}

export interface OurPeopleData {
  id: string;
  image_link: string;
  name: string;
  title: string;
  lokasi: string;
  bertani_sejak: number;
  bermitra_sejak: number;
  keterangan: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOurPeopleReturn {
  status: number;
  message: string;
  data: OurPeopleData;
}

export interface AboutApiData {
  jumbotron: AboutJumbotron;
  milestones: AboutMilestone[];
  video: AboutVideo;
  our_people: OurPeopleData[];
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