import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  useRequestOtp,
  useResendOtp,
  useVerifyOtp,
  useCompleteRegistration,
} from "@/lib/hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "@/components/common/alert/Alert";
import { OtpInput } from "@/components/common/auth/OtpInput";
import { usePasswordToggle } from "@/lib/hooks/usePasswordToggle";
import { Eye, EyeOff } from "lucide-react";
import { useAppToast } from "@/components/common/toast/useToast";

type Step = "email" | "otp" | "profile";

export function RegisterPage() {
  const { t } = useTranslation("common");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const pwd1 = usePasswordToggle();
  const pwd2 = usePasswordToggle();
  const { showSuccess, showErrorToast } = useAppToast();

  const {
    requestOtp,
    loading: loadingRequest,
    error: requestError,
    setError: setRequestError,
  } = useRequestOtp();
  const {
    resendOtp,
    loading: loadingResend,
    error: resendError,
    setError: setResendError,
  } = useResendOtp();
  const {
    verifyOtp,
    loading: loadingVerify,
    error: verifyError,
    setError: setVerifyError,
  } = useVerifyOtp();
  const {
    completeRegistration,
    loading: loadingComplete,
    error: completeError,
    setError: setCompleteError,
  } = useCompleteRegistration();

  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const now = Date.now();
  const remainingSeconds = useMemo(() => {
    if (!expiresAt) return 0;
    const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
    return diff;
  }, [expiresAt, now]);

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => {
      // chỉ để trigger re-render, state now = Date.now() trong useMemo phụ thuộc vào expiresAt
      setExpiresAt((prev) => (prev ? prev : null));
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const showError =
    localError || requestError || resendError || verifyError || completeError;

  const clearErrors = () => {
    setLocalError(null);
    setRequestError(null);
    setResendError(null);
    setVerifyError(null);
    setCompleteError(null);
  };

  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email) {
      setLocalError("Email is required");
      return;
    }

    try {
      await requestOtp(email);
      setExpiresAt(Date.now() + 5 * 60 * 1000);
      setStep("otp");
    } catch {
      // error đã set ở hook
    }
  };

  const handleResend = async () => {
    clearErrors();
    try {
      await resendOtp(email);
      setExpiresAt(Date.now() + 5 * 60 * 1000);
    } catch {
      // error ở hook
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!otp) {
      setLocalError("OTP is required");
      return;
    }
    try {
      await verifyOtp(email, otp);
      setStep("profile");
    } catch {
      // error
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!fullName || !password || !confirmPassword) {
      return showErrorToast("All fields are required");
    }

    if (password !== confirmPassword) {
      return showErrorToast("Passwords do not match");
    }

    try {
      await completeRegistration({ email, fullName, password });

      showSuccess("Account created successfully!");

      setTimeout(() => navigate("/auth/login", { replace: true }), 900);
    } catch {
      showErrorToast(completeError || "Registration failed");
    }
  };

  return (
    <Card className="border bg-card/80 backdrop-blur">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          {step === "email"
            ? (t("register") ?? "Create account")
            : step === "otp"
              ? "Verify your email"
              : "Set your password"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {step === "email" &&
            t("desRegister")}
          {step === "otp" &&
            `We sent a 6-digit code to ${email}. Please enter it below.`}
          {step === "profile" &&
            "Create your password and profile to finish registration."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === "email" && (
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            {showError && <ErrorAlert message={showError} />}

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={loadingRequest}
            >
              {loadingRequest ? t("sending") : t("sendEmail")}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form className="space-y-4" onSubmit={handleOtpSubmit}>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="otp">OTP</Label>
              <OtpInput value={otp} onChange={setOtp} error={!!showError} />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {remainingSeconds > 0
                  ? `Code expires in ${formatTime(remainingSeconds)}`
                  : "Code expired"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={remainingSeconds > 0 || loadingResend}
                onClick={handleResend}
              >
                {loadingResend ? "Resending..." : "Resend code"}
              </Button>
            </div>

            {showError && <ErrorAlert message={showError} />}

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={loadingVerify}
            >
              {loadingVerify ? "Verifying..." : "Continue"}
            </Button>
          </form>
        )}

        {step === "profile" && (
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>

            <div className="space-y-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={pwd1.type}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={pwd1.toggle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {pwd1.visible ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={pwd2.type}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={pwd2.toggle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {pwd2.visible ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {showError && <ErrorAlert message={showError} />}

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={loadingComplete}
            >
              {loadingComplete ? "Creating account..." : "Create account"}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center text-xs text-muted-foreground">
        {step !== "email" && (
          <button
            type="button"
            className="underline"
            onClick={() => setStep("email")}
          >
            Change email
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
