import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import CustomLoader from "../components/custom-ui/CustomLoader";
import ProtectedLayout from "./ProtectedLayout";

export default function AppLayout() {
  const { isAuthenticated, authLoading } = useAuth();

  return authLoading ? <CustomLoader /> : isAuthenticated ? <ProtectedLayout /> : <Navigate to="/auth/login" replace />;
}
