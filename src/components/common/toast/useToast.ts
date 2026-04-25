import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export const useAppToast = () => {
  const showSuccess = useCallback(
    (msg: string) => toast.success(msg, { duration: 2000 }),
    [],
  );

  const showError = useCallback(
    (msg: string) => toast.error(msg, { duration: 2500 }),
    [],
  );

  const showErrorToast = useCallback(
    (msg: string) => toast.error(msg, { duration: 2500 }),
    [],
  );

  const showInfo = useCallback(
    (msg: string) => toast.warning(msg, { duration: 2000 }),
    [],
  );

  return useMemo(
    () => ({ showSuccess, showError, showErrorToast, showInfo }),
    [showSuccess, showError, showErrorToast, showInfo],
  );
};
