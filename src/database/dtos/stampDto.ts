import { WithId } from "mongodb"
import Stamp from "../database_types/stamp"
import { LocalizedText } from "../database_types/localized-text"

export function StampMongoToDto(mongoStamp: WithId<Stamp>): StampDto {
    return {
        id: mongoStamp._id.toString(),
        name: mongoStamp.name,
        description: mongoStamp.description,
        image_url: mongoStamp.image_url,
        lon: +mongoStamp.location[0].toString(),
        lat: +mongoStamp.location[1].toString(),
        last_updated: mongoStamp.last_updated
    }
}

export default interface StampDto {
    id: string,
    name: LocalizedText,
    description: LocalizedText,
    image_url: string,
    lon: number,
    lat: number,
    last_updated: Date
}