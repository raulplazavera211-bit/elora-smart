import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./es";
import en from "./en";
import pt from "./pt";
import fr from "./fr";
import it from "./it";

export const SUPPORTED_LANGS = ["es", "en", "pt", "fr", "it"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_NAMES: Record<SupportedLang, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  it: "Italiano",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
      fr: { translation: fr },
      it: { translation: it },
    },
    fallbackLng: "es",
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      // Orden de detección: localStorage primero (preferencia guardada), luego navegador
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "elora_lang",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
