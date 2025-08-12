export interface MilestonePayload {
  title: string;
  sub_title: string;
  content: string;
  media_link: string;
  tahun: number;
  position: number;
  status: boolean;
}

export interface Milestone extends MilestonePayload {
  id: string;
  input_time: string;
  update_time: string;
}

export interface MilestoneListResponse {
  status: number;
  message: string;
  milestones: Milestone[];
}