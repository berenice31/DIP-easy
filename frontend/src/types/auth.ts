export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  role: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
