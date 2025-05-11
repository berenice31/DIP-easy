import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function Layout() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600">
                  DIP-easy
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-secondary">
                  Déconnexion
                </button>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="btn btn-secondary">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
