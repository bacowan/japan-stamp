export const supportedLocales = ['en-US', 'ja'] as const;
export type SupportedLocale = typeof supportedLocales[number];