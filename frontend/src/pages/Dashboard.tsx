import { useAuthStore } from "../stores/authStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tableau de bord
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Bienvenue, {user?.email}
            </h2>
            <p className="text-gray-600">
              Vous êtes connecté en tant que{" "}
              {user?.role === "admin" ? "administrateur" : "utilisateur"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
