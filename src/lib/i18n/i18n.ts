// src/lib/i18n/i18n.ts
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enCommon from "./locales/en/index"
import viCommon from "./locales/vi/index"

const resources = {
  en: { common: enCommon },
  vi: { common: viCommon },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
