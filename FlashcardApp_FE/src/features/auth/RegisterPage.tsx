import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const { isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-10">
      <RegisterForm />
    </div>
  );
}
