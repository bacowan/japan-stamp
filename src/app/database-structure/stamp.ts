import checkAttribute from "@/utils/check-attribute";
import { isLocaleText, locales, LocaleText } from "@/utils/translation/locale-text";

export function isStamp(input: any): input is Stamp {
    return isLocaleText(input.name) &&
        "location" in input &&
        Array.isArray(input.location.coordinates) &&
        input.location.type === "Point" &&
        isLocaleText(input.description) &&
        "image-path" in input &&
        typeof input["image-path"] === "string";
}

export interface Stamp {
    name: LocaleText,
    location: {
        coordinates: number[]
        type: "Point"
    },
    description: LocaleText,
    "image-path": string,
    "created-by": string,
    "updated-by": string,
    "created-on": Date,
    "updated-on": Date
}