"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLanguage } from "@/app/store/uiSlice";
import { useTranslation } from "react-i18next";

import enFlag from "@/assets/flags/en.svg";
import viFlag from "@/assets/flags/vi.svg";
import { cn } from "@/lib/utils/utils";

export function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((s) => s.ui.language);
  const { i18n } = useTranslation();

  const flag = language === "vi" ? viFlag : enFlag;
  const label = language === "vi" ? "VI" : "EN";

  const toggle = () => {
    const next = language === "vi" ? "en" : "vi";
    dispatch(setLanguage(next));
    i18n.changeLanguage(next);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className={cn(
        "flex items-center gap-2 border",
        "rounded-md px-3 py-2 hover:bg-accent transition",
      )}
    >
      <img src={flag} alt="flag" className="h-4 w-6 rounded-sm shadow-sm" />
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
}
