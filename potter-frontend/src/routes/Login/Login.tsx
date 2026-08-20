import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import useUserStore, { type UserType } from "../../store/UserStore";
import { useEffect } from "react";
import { ROUTES } from "../../lib/routes";
import { Card } from "#components/ui/card";

const Login = () => {
  const { SignInWithGoogle } = useAuth();
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ user });
    if (user) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [user]);

  const responseMessage = async (response: CredentialResponse) => {
    if (response.credential) {
      let user: UserType = await SignInWithGoogle(response.credential);

      setUser(user);
    }
  };

  const errorMessage = () => {};

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="bg-card border-border shadow-sm w-1/4 flex flex-col items-center justify-center gap-4 p-8 h-auto">
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
        <span className="w-2/3">
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </span>
      </Card>
    </main>
  );
};

export default Login;
