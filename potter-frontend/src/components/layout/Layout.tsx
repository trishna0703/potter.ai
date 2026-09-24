import Header from "./Header";
import { Outlet } from "react-router-dom";
import LandingFooter from "@/routes/Landing/components/LandingFooter";
import { Separator } from "#components/ui/separator";

const Layout = () => {
  return (
    <div className="min-h-screen bg-card">
      <Header />

      <Outlet />

      <Separator className={"max-w-6xl mx-auto"} />

      <footer>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <LandingFooter />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
