export interface Log {
  id: string;
  niveau: "info" | "warning" | "error";
  message: string;
  details?: string;
  created_at: string;
}

export interface CreateLogRequest {
  niveau: Log["niveau"];
  message: string;
  details?: string;
}

export interface LogResponse {
  items: Log[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
