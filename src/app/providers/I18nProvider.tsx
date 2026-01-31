// src/app/providers/I18nProvider.tsx
import "@/lib/i18n/i18n" // chỉ cần import để init một lần
import type { ReactNode } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/lib/i18n/i18n"

export function I18nProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
