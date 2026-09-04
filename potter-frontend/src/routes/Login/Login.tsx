import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/UserStore";
import { useEffect } from "react";
import { ROUTES } from "../../lib/routes";
import { Card } from "#components/ui/card";
import { showErrorToast } from "#lib/utils";
import Overlay from "#components/layout/Overlay";

const Login = () => {
  const { SignInWithGoogle, currentUser } = useAuth();
  const { isLoading } = currentUser;
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(ROUTES.PLANTS, { replace: true });
    }
  }, [user, setUser, navigate]);

  if (isLoading) return <Overlay />;

  const responseMessage = async (response: CredentialResponse) => {
    if (response.credential) {
      await SignInWithGoogle(response.credential);
    }
  };

  const errorMessage = () => {
    showErrorToast("Login Failed. Please try again later.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="bg-card border-border shadow-sm w-full sm:w-8/10 md:w-6/10 lg:w-4/10 flex flex-col items-center justify-center gap-4 p-8 h-screen md:h-auto">
        <img src="/Plant.svg" alt="Logo" className="w-48 h-48 mt-8" />
        <div className="flex flex-col items-center">
          <h2 className="text-foreground text-lg font-medium">
            Welcome back to
          </h2>
          <h1 className="text-primary text-5xl font-bold">Potter.ai</h1>
        </div>
        <p className="text-muted-foreground">
          Continue caring for your plants.
        </p>
        <span className="w-2/3 flex justify-center">
          <GoogleLogin
            onSuccess={responseMessage}
            onError={errorMessage}
            width={200}
          />
        </span>
      </Card>
    </main>
  );
};

export default Login;
