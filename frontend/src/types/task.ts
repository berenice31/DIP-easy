export interface Task {
  id: string;
  titre: string;
  description?: string;
  statut: "en_cours" | "terminee" | "annulee";
  priorite: "basse" | "moyenne" | "haute";
  date_echeance?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  titre: string;
  description?: string;
  statut: Task["statut"];
  priorite: Task["priorite"];
  date_echeance?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export interface TaskResponse {
  items: Task[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
