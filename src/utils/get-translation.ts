export default function getTranslations(lang: string, val: { english?: string, japanese?: string }): string {
    if (lang === "jp" && val.japanese !== undefined) {
        return val.japanese;
    }
    else {
        return val.english ?? "";
    }
}