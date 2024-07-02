import checkAttribute from "@/utils/check-attribute";


export function toStampArray(input: any): Stamp[] {
    if (Array.isArray(input)) {
        return input.map(i => {
            checkAttribute(i, "_id");
            checkAttribute(i, "name");
            checkAttribute(i, "location", "coordinates", "");
            checkAttribute(i, "image-url");
            checkAttribute(i, "description");
            return {
                id: i._id,
                name: i.name,
                location: {
                    lat: Number(i.location.coordinates[1]),
                    lon: Number(i.location.coordinates[0])
                },
                imageUrl: i.imageUrl,
                description: i.description
            };
        })
    }
    else {
        throw "Stamps should be an array"
    }
}

export default interface Stamp {
    id: string,
    name: {
        english?: string,
        japanese?: string
    },
    location: {
        lat: number,
        lon: number
    },
    imageUrl: string,
    description: {
        english?: string,
        japanese?: string
    }
}