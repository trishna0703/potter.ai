import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "../ui/sonner";

const AppShell = () => {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <Toaster />

      <Navbar />

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto p-2 py-4 sm:p-4 md:p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
