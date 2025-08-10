export interface Testimonial {
  id?: string;
  pic: string;
  name: string;
  profession: string;
  message: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTestimonialRequest {
  pic: string;
  name: string;
  profession: string;
  message: string;
  status: boolean;
}

export interface TestimonialApiResponse {
  status: number;
  message: string;
  data?: Testimonial | Testimonial[];
}

export interface TestimonialListResponse {
  status: number;
  message: string;
  testimonials: Testimonial[];
}

export interface CreateTestimonialResponse {
  status: number;
  message: string;
  testimonial: Testimonial;
}
