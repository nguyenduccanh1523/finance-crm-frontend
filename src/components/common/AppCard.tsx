import { Card, CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils/utils"

export function AppCard({ className, ...props }: CardProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}
