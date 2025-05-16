import React from "react";
import {
  Card,
  CardGrid,
  CardHeader,
  CardContent,
} from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Loading } from "../components/common/Loading";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/api";
import { dashboardService, DashboardStats } from "../services/dashboard";
import { Layout } from "../components/layout/Layout";
import {
  Description as DescriptionIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface User {
  email: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getStats,
  });

  if (isLoadingUser || isLoadingStats) {
    return <Loading fullScreen text="Chargement du tableau de bord..." />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {user?.email}
          </h1>
          <p className="mt-2 text-gray-600">
            Voici un aperçu de vos DIP et activités récentes
          </p>
        </div>

        {/* Statistiques */}
        <CardGrid columns={3} gap="lg" className="mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total des DIP
                  </p>
                  <p className="text-3xl font-bold text-primary-600 mt-2">
                    {stats?.totalDips || 0}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <DescriptionIcon className="text-primary-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    DIP en attente
                  </p>
                  <p className="text-3xl font-bold text-warning-600 mt-2">
                    {stats?.pendingDips || 0}
                  </p>
                </div>
                <div className="p-3 bg-warning-100 rounded-full">
                  <PendingIcon className="text-warning-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    DIP complétés
                  </p>
                  <p className="text-3xl font-bold text-success-600 mt-2">
                    {stats?.completedDips || 0}
                  </p>
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <CheckCircleIcon className="text-success-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardGrid>

        {/* Actions rapides */}
        <Card className="mb-8">
          <CardHeader title="Actions rapides" />
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button className="flex flex-col items-center justify-center p-4 text-center transition-colors rounded-lg hover:bg-gray-50">
                <span className="text-2xl">📝</span>
                <span className="mt-2 text-sm font-medium">Nouveau DIP</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 text-center transition-colors rounded-lg hover:bg-gray-50">
                <span className="text-2xl">📋</span>
                <span className="mt-2 text-sm font-medium">Templates</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 text-center transition-colors rounded-lg hover:bg-gray-50">
                <span className="text-2xl">📊</span>
                <span className="mt-2 text-sm font-medium">Rapports</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 text-center transition-colors rounded-lg hover:bg-gray-50">
                <span className="text-2xl">⚙️</span>
                <span className="mt-2 text-sm font-medium">Paramètres</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader title="Activité récente" />
          <CardContent>
            {!stats?.recentActivity?.length ? (
              <div className="py-8 text-center text-gray-500">
                Aucune activité récente
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "success"
                          : activity.status === "pending"
                          ? "warning"
                          : "info"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
