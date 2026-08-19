import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./routes/Login/Login";
import Dashboard from "./routes/Dashboard/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ROUTES } from "./lib/routes";
import Plants from "./routes/Plants/Plants";
import Shelves from "./routes/Shelves/Shelves";
import AppShell from "#components/layout/AppShell";

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
              <Route path="/plants" element={<Plants />} />
              <Route path="/shelves" element={<Shelves />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
