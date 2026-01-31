import { Outlet, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { setTheme } from "@/app/store/uiSlice"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils/utils"
import { Sun, Moon } from "lucide-react"
import { setLanguage } from "@/app/store/uiSlice"

export function AuthLayout() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((s) => s.ui.theme)
  const language = useAppSelector((s) => s.ui.language)
  const { t, i18n } = useTranslation("common")

  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"))
  }

  const switchLanguage = () => {
    const next = language === "vi" ? "en" : "vi"
    dispatch(setLanguage(next))
    i18n.changeLanguage(next)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Bên trái: hero (ẩn trên mobile nếu muốn) */}
      <div className="relative hidden flex-1 flex-col justify-between bg-gradient-to-br from-sky-600 via-indigo-600 to-slate-900 px-10 py-8 text-white lg:flex">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold">Finance CRM</div>
          <div className="text-xs opacity-80">Super Sales & Finance Hub</div>
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-semibold leading-tight">
            Manage revenue, deals and cash flow in one place.
          </h1>
          <p className="text-sm text-slate-100/80">
            Track subscriptions, CRM pipelines and personal finances with
            a single workspace.
          </p>
        </div>

        <div className="text-xs text-slate-100/70">
          © {new Date().getFullYear()} 3Nest – All rights reserved.
        </div>
      </div>

      {/* Bên phải: auth card */}
      <div className="flex min-h-screen flex-1 flex-col bg-background/60">
        {/* Top bar: theme + language + nav login/register */}
        <header className="flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Toggle
              aria-label="Toggle theme"
              pressed={theme === "dark"}
              onPressedChange={toggleTheme}
              className="h-9 w-9 rounded-full border bg-background/70"
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Toggle>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={switchLanguage}
            >
              {language.toUpperCase()}
            </Button>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/auth/login"
              className="rounded-md px-3 py-1 text-muted-foreground hover:bg-muted
              hover:text-foreground"
            >
              {t("login")}
            </Link>
            <Link
              to="/auth/register"
              className={cn(
                "rounded-md px-3 py-1 font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {t("register") ?? "Sign up"}
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
