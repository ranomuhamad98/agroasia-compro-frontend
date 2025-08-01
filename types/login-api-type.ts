export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      name?: string;
      role?: string;
    };
    expires_at?: string;
  };
}

export interface LoginError {
  status: number;
  message: string;
  data?: any;
} 