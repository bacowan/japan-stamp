import 'server-only'
import Locale from './locales/locale'

const dictionaries: {[key: string]: () => Promise<Locale>} = {
    "en-US": () => import('./locales/en.json').then((module) => module.default),
    "jp": () => import('./locales/jp.json').then((module) => module.default),
}
   
  export const getTranslations = async (locale: string): Promise<Locale> =>
    dictionaries[locale]?.() ?? dictionaries["en-US"]();