import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { AuthInput } from "@/components/common/AuthInput"
import type { Control } from "react-hook-form"
import { type ReactNode } from "react"

interface AuthTextFieldProps {
  control: Control<any>
  name: string
  label: string
  type?: string
  placeholder?: string
  icon?: ReactNode
  rightElement?: ReactNode
}

export function AuthTextField({
  control,
  name,
  label,
  type = "text",
  placeholder,
  icon,
  rightElement,
}: AuthTextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AuthInput
              {...field}
              type={type}
              placeholder={placeholder}
              icon={icon}
              rightElement={rightElement}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
