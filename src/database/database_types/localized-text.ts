import { SupportedLocale } from "@/localization/localization";

export type LocalizedText = {
    [key in SupportedLocale]?: string;
}