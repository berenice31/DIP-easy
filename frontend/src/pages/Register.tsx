import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../stores/authStore";

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data.email, data.password);
      navigate("/login");
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...registerField("email", {
                  required: "Email requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email invalide",
                  },
                })}
                className="input"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                {...registerField("password", {
                  required: "Mot de passe requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                  },
                })}
                className="input"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="label">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...registerField("confirmPassword", {
                  required: "Confirmation du mot de passe requise",
                  validate: (value) =>
                    value === password ||
                    "Les mots de passe ne correspondent pas",
                })}
                className="input"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <div>
            <button type="submit" className="btn btn-primary w-full">
              S'inscrire
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
