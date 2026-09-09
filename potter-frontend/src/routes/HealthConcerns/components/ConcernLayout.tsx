import Navbar from "#components/layout/Navbar";
import Sidebar from "#components/layout/Sidebar";
import { Toaster } from "#components/ui/sonner";

import { Outlet } from "react-router-dom";

const ConcernLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex">
      <Toaster />
      <Sidebar />
      <div
        className="flex-1 min-w-0 h-dvh flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/concerns_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: " center",
        }}
      >
        <Navbar />

        <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-2 pb-12 sm:px-4 md:px-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ConcernLayout;
