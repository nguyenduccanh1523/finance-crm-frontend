// src/components/common/alert/Alert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert
      variant="destructive"
      className="animate-in fade-in slide-in-from-top-2"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function SuccessAlert({ message }: { message: string }) {
  return (
    <Alert
      className="border-green-500 text-green-700 animate-in fade-in slide-in-from-top-2"
    >
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
