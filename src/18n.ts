import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { store } from "@/store/store";
 

const state = store.getState(); // Get the state directly from the store
  
const { language } = state.app;

i18n
.use(Backend)
.use(initReactI18next) // passes i18n down to react-i18next
.use(LanguageDetector)
.init({
  /*resources: {
    en: {
      translation: {
        "Welcome to React": "Welcome to React and react-i18next"
      }
    },
    ar: {
      translation: {
        "Welcome to React": "Welcome to React and react-i18next arabic"
      }
    }
  },*/
   // Load translations from public/locales
   backend: {
    loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
  },
  debug: false, // Enable debug mode for development

  lng:  language? language: "ar", // default language
  fallbackLng: "en",
   
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  react: {
    useSuspense: false, // Set to false if you want to avoid suspense
  },
});

export default i18n;