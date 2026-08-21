import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./routes/Login/Login";
import Dashboard from "./routes/Dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROUTES } from "./lib/routes";
import Plants from "./routes/Plants/Plants";
import Shelves from "./routes/Shelves/Shelves";
import AppShell from "#components/layout/AppShell";
import HealthConcerns from "./routes/HealthConcerns/HealthConcerns";
import ActiveConcern from "./routes/HealthConcerns/components/ActiveConcern";
import RaiseConcern from "./routes/HealthConcerns/RaiseConcern";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PLANTS} element={<Plants />} />
              <Route path={ROUTES.SHELVES} element={<Shelves />} />
              <Route path={ROUTES.CONCERNS} element={<HealthConcerns />} />
              <Route path={ROUTES.RAISE} element={<RaiseConcern />} />
              <Route path={ROUTES.CONCERNSACTIVE} element={<ActiveConcern />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
