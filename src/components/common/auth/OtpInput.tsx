import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/utils"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const digit = e.target.value.replace(/\D/g, "")
    if (!digit) return

    const chars = value.split("")
    chars[idx] = digit[digit.length - 1]
    onChange(chars.join(""))

    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace") {
      const chars = value.split("")
      if (chars[idx]) {
        chars[idx] = ""
        onChange(chars.join(""))
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!text) return

    onChange(text.slice(0, length))
    e.preventDefault()
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, idx) => (
        <Input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el
          }}
          value={value[idx] ?? ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={idx === 0 ? handlePaste : undefined}
          inputMode="numeric"
          maxLength={1}
          className={cn(
            "h-12 w-12 rounded-lg text-center text-xl font-semibold",
            "transition-all",
            "bg-muted/40",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            error && "border-destructive ring-destructive/40",
          )}
        />
      ))}
    </div>
  )
}
