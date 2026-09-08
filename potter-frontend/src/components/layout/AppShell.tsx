import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "../ui/sonner";

const AppShell = () => {
  return (
    <div className="h-screen bg-background overflow-hidden flex">
      <Toaster />
      <Sidebar />
      <div className="flex-1 min-w-0 h-dvh flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-2 pb-12 sm:px-4 md:px-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
