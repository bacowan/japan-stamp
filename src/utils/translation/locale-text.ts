export const locales = ['en-US', 'jp'] as const;

export type LocaleKeys = typeof locales[number];

export function isLocaleText(input: any): input is LocaleText {
    return input && locales.some(l => l in input);
}

export type LocaleText = {
    [key in LocaleKeys]?: string;
}

export function isSupportedLocale(input: string): input is LocaleKeys {
    return locales.includes(input as LocaleKeys);
}