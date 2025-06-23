import api from "./api";

export interface DashboardStats {
  totalDips: number;
  totalProducts: number;
  draftProducts: number;
  validatedProducts: number;
  pendingDips: number;
  completedDips: number;
  templatesCount: number;
  pendingGenerations: number;
  averageCompletion: number;
  recentActivity: {
    id: string;
    type: string;
    title: string;
    date: string;
    status: string;
  }[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};
