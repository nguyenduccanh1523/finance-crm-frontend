// src/app/providers/ThemeProvider.tsx
import { type ReactNode, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { setTheme, type Theme } from "@/app/store/uiSlice"

function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    root.classList.toggle("dark", prefersDark)
    return
  }

  root.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppSelector((s) => s.ui.theme)
  const dispatch = useAppDispatch()

  // apply theme khi load + khi theme thay đổi
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // nếu chọn system thì lắng nghe thay đổi hệ thống
  useEffect(() => {
    if (theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = (event: MediaQueryListEvent) => {
      applyTheme(event.matches ? "dark" : "light")
    }
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])

  // đảm bảo có giá trị mặc định
  useEffect(() => {
    if (!theme) dispatch(setTheme("light"))
  }, [theme, dispatch])

  return <>{children}</>
}
