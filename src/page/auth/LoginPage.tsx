import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { AuthTextField } from "@/components/common/auth/AuthTextField";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { usePasswordToggle } from "@/lib/hooks/usePasswordToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useLogin } from "@/lib/hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "@/components/common/alert/Alert";
import { useAppToast } from "@/components/common/toast/useToast";
import { useTranslation } from "react-i18next";
import { ngrokClient } from "@/lib/api/axiosClient";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const pwd = usePasswordToggle();
  const { showSuccess, showError, showInfo } = useAppToast();
  const { t, i18n } = useTranslation("common");

  const [successMessage, setSuccessMessage] = useState("");
  const [testData, setTestData] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState("");

  const fetchTestAPI = async () => {
    setTestLoading(true);
    setTestError("");
    setTestData(null);
    try {
      const response = await ngrokClient.get(
        "/ngrok-api/api/search-session/f72ee998ef5ab586ab7d855c5a1f763d?limit=50",
      );
      setTestData(response.data);
      showSuccess("API test successful!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch API data";
      setTestError(errorMessage);
      showError(errorMessage);
    } finally {
      setTestLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const user = await login(data.email, data.password);

      showSuccess(t("loginSuccess"));

      setTimeout(() => {
        if (
          user.roles.includes("ADMIN") ||
          user.roles.includes("SUPER_ADMIN")
        ) {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      }, 500);
    } catch (err) {
      showError(error || t("loginFailed"));
    }
  };

  return (
    <Card className="auth-card border bg-card/90 backdrop-blur animate-in fade-in slide-in-from-right-4 duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">{t("login")}</CardTitle>
        <CardDescription>{t("desLogin")}</CardDescription>
      </CardHeader>

      <CardContent>
        {error && <ErrorAlert message={error} />}
        {successMessage && <SuccessAlert message={successMessage} />}
        {testError && <ErrorAlert message={testError} />}

        {testData && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
            <p className="font-semibold text-blue-900">API Response:</p>
            <pre className="mt-2 max-h-32 overflow-auto text-xs text-blue-800">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AuthTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
            />

            <AuthTextField
              control={form.control}
              name="password"
              label="Password"
              type={pwd.type}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={pwd.toggle}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {pwd.visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              className="mt-2 h-11 w-full text-base"
              disabled={loading || form.formState.isSubmitting}
            >
              {(loading || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("login")}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="mt-2 h-11 w-full text-base"
              disabled={testLoading}
              onClick={fetchTestAPI}
            >
              {testLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Test API
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => showInfo(t("underDevelopment"))}
        >
          {t("forgotPassword")}
        </span>

        <span
          className="cursor-pointer hover:underline"
          onClick={() => navigate("/auth/register")}
        >
          {t("createAccount")}
        </span>
      </CardFooter>
    </Card>
  );
}
