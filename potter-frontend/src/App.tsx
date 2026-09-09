import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Login from "./routes/Login/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROUTES } from "./lib/routes";
import Plants from "./routes/Plants/Plants";
import AppShell from "#components/layout/AppShell";
import HealthConcerns from "./routes/HealthConcerns/HealthConcerns";
import RaiseConcern from "./routes/HealthConcerns/RaiseConcern";
import ChatInterface from "./routes/Assessment/ChatInterface";
import Schedules from "./routes/Plants/ManageSchedules/Schedules";
import ConcernLayout from "./routes/HealthConcerns/components/ConcernLayout";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route
                path={ROUTES.DASHBOARD}
                element={<Navigate to="/plants" replace />}
              />
              <Route path={ROUTES.PLANTS} element={<Plants />} />

              <Route
                path={ROUTES.SCHEDULES + "/:plant_id"}
                element={<Schedules />}
              />
              {/* <Route path={ROUTES.SHELVES} element={<Shelves />} /> */}
              <Route path={ROUTES.CONCERNS} element={<HealthConcerns />} />
            </Route>
            <Route element={<ConcernLayout />}>
              <Route
                path={"/concerns/active/:assessment_id"}
                element={<ChatInterface />}
              />
              <Route path={ROUTES.RAISE} element={<RaiseConcern />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
