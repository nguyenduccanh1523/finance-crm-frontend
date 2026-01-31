import { toast } from "sonner";

export const useAppToast = () => {
  const showSuccess = (msg: string) =>
    toast.success(msg, { duration: 2000 });

  const showError = (msg: string) =>
    toast.error(msg, { duration: 2500 });

  const showErrorToast = (msg: string) =>
    toast.error(msg, { duration: 2500 });

  const showInfo = (msg: string) =>
    toast.warning(msg, { duration: 2000 });

  return { showSuccess, showError, showErrorToast, showInfo };
};
