import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "../ui/sonner";

const AppShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Top navigation */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
