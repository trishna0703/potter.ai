import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/UserStore";
import { ROUTES } from "../lib/routes";

function ProtectedRoute() {
  const isAuthenticatedUser = useUserStore((state) => state.user);

  if (!isAuthenticatedUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
