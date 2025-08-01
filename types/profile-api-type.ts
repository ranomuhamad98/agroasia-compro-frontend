export interface ProfileResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name?: string;
      role?: string;
      avatar?: string;
      phone?: string;
      address?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
}

export interface ProfileError {
  status: number;
  message: string;
  data?: any;
} 