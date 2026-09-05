import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "../lib/routes";
import useAuth from "./Login/useAuth";
import Overlay from "#components/layout/Overlay";

function ProtectedRoute() {
  const { currentUser } = useAuth();
  const { isLoading, data } = currentUser;

  if (isLoading) {
    return <Overlay />;
  }

  if (!data) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
