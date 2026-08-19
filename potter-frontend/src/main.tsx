import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TooltipProvider } from "#components/ui/tooltip";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </StrictMode>
  </GoogleOAuthProvider>,
);
