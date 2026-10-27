"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import en from "../../locales/en.json";
import lt from "../../locales/lt.json";
import ru from "../../locales/ru.json";

export const LANGUAGES = ["en", "lt", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];
export type Dictionary = typeof en;
export type TranslationVars = Record<string, string | number>;

const dictionaries: Record<Language, Dictionary> = { en, lt, ru };
const STORAGE_KEY = "starcup.language";

export function isLanguage(value: string | null): value is Language {
  return value !== null && (LANGUAGES as readonly string[]).includes(value);
}

export function interpolate(template: string, vars?: TranslationVars) {
  if (!vars) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name)
      ? String(vars[name])
      : match,
  );
}

function readStoredLanguage(): Language | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
}

type I18nValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dict: Dictionary;
  t: (path: string, vars?: TranslationVars) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (!stored || stored === "en") return;

    const timeout = window.setTimeout(() => setLanguageState(stored), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;

    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Storage can be unavailable in private mode. Language still works.
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    document.documentElement.lang = next;
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = dictionaries[language];

    const t = (path: string, vars?: TranslationVars) => {
      const result = path.split(".").reduce<unknown>((current, part) => {
        if (current && typeof current === "object") {
          return (current as Record<string, unknown>)[part];
        }
        return undefined;
      }, dict);

      return typeof result === "string" ? interpolate(result, vars) : path;
    };

    return { language, setLanguage, dict, t };
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return value;
}
