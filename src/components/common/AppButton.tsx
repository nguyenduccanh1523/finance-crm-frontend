import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils/utils"

interface AppButtonProps extends ButtonProps {
  loading?: boolean
}

export function AppButton({
  className,
  loading,
  disabled,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button
      className={cn(
        "h-10 rounded-lg font-medium",
        loading && "opacity-70 pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "..." : children}
    </Button>
  )
}
