import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const AuthInput = React.forwardRef<
  HTMLInputElement,
  AuthInputProps
>(({ className, icon, rightElement, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}

      <Input
        ref={ref}
        className={cn(
          "h-11",
          icon && "pl-10",
          rightElement && "pr-10",
          className
        )}
        {...props}
      />

      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
})
AuthInput.displayName = "AuthInput"
