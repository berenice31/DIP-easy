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
  Inventory as InventoryIcon,
  ViewInAr as TemplateIcon,
  CloudUpload as CloudIcon,
  Percent as PercentIcon,
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
        <CardGrid columns={4} gap="lg" className="mb-8">
          {/* Produits */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Produits
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats?.totalProducts ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <InventoryIcon className="text-blue-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Produits brouillon
                  </p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {stats?.draftProducts ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <PendingIcon className="text-yellow-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Produits validés
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats?.validatedProducts ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="text-green-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>

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
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Modèles</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {stats?.templatesCount ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <TemplateIcon className="text-indigo-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Générations en attente
                  </p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {stats?.pendingGenerations ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CloudIcon className="text-purple-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Complétude moyenne
                  </p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">
                    {stats?.averageCompletion ?? 0}%
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <PercentIcon className="text-teal-600 text-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardGrid>

        {/* Graphique placeholder */}
        <Card className="mb-8">
          <CardHeader title="Historique des DIP générés" />
          <CardContent>
            <div className="text-center text-gray-400 py-10">
              (Graphique d'évolution à venir)
            </div>
          </CardContent>
        </Card>

        {/* Actions prioritaires placeholder */}
        <Card className="mb-8">
          <CardHeader title="Actions prioritaires" />
          <CardContent>
            <div className="text-center text-gray-400 py-10">
              (Aucune action prioritaire pour le moment)
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
