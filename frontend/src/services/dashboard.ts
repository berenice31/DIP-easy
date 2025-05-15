import api from "./api";

export interface DashboardStats {
  totalDips: number;
  pendingDips: number;
  completedDips: number;
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
