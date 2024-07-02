function checkAttributeRecursion(obj: any, objChainName: string, ...attributeNames: string[]) {
    if (attributeNames.length < 1) {
        return;
    }
    else if (attributeNames[0] === '') {
        if (!Array.isArray(obj)) {
            throw `${objChainName} is not an array`;
        }
        else {
            for (let o in obj) {
                checkAttributeRecursion(o, objChainName + "[]", ...attributeNames.slice(1));
            }
        }
    }
    else {
        if (!(attributeNames[0] in obj)) {
            throw `missing ${objChainName + attributeNames[0]}`;
        }
        else {
            checkAttributeRecursion(obj[attributeNames[0]], objChainName + attributeNames[0], ...attributeNames.slice(1));
        }
    }
}




function checkAttribute(obj: any, ...attributeNames: string[]) {
    checkAttributeRecursion(obj, "", ...attributeNames);
}

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