import 'server-only'
import { SupportedLocale } from './localization'
import Dictionary from './dictionaries/dictionary'
 
const dictionaries: {[key: string]: () => Promise<Dictionary>} = {
  "en-US": () => import('./dictionaries/en.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: SupportedLocale): Promise<Dictionary> =>
    dictionaries[locale]?.() ?? dictionaries["en-US"]();