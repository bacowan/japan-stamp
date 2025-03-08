import { LocalizedText } from "./localized-text";

export default interface Stamp {
    name: LocalizedText,
    description: LocalizedText,
    location: [number, number],
    image_url: string,
    last_updated: Date
}