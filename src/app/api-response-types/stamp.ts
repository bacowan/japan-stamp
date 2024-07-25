import checkAttribute from "@/utils/check-attribute";
import { LocaleText } from "@/utils/translation/locale-text";

// TODO: Use user defined type guards instead
export function toStampArray(input: any): Stamp[] {
    if (Array.isArray(input)) {
        return input.map(i => {
            try {
                checkAttribute(i, "_id");
                checkAttribute(i, "name");
                checkAttribute(i, "location", "coordinates", "");
                checkAttribute(i, "image-path");
                checkAttribute(i, "description");
            }
            catch {
                return null;
            }
            return {
                id: i._id,
                name: i.name,
                location: {
                    lat: Number(i.location.coordinates[1]),
                    lon: Number(i.location.coordinates[0])
                },
                imageUrl: i["image-path"],
                description: i.description
            };
        })
        .filter(x => x !== null)
    }
    else {
        throw "Stamps should be an array"
    }
}

export default interface Stamp {
    id: string,
    name: LocaleText,
    location: {
        lat: number,
        lon: number
    },
    imageUrl: string,
    description: LocaleText
}