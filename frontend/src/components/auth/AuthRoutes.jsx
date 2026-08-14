import { Navigate } from "react-router";
import { useAuth } from "../../utils/AuthContext.jsx";

const AuthLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface">
    <p className="text-sm text-muted">Loading…</p>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const IndexRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />;
};
