import { isSupportedLocale, LocaleKeys, locales, LocaleText } from "./locale-text";

export function textFromLang(text: LocaleText, lang: string): string {
    if (isSupportedLocale(lang)) {
        if (text[lang]) {
            return text[lang];
        }
        else {
            for (let i = 0; i < locales.length; i++) {
                const val = text[locales[i]];
                if (val) {
                    return val;
                }
            }
            return "";
        }
    }
    else {
        return "";
    }
}