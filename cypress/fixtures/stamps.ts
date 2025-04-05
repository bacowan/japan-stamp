import Stamp from "@/database/database_types/stamp";
import { ObjectId, OptionalId } from "mongodb";

export default [
  {
    "_id": new ObjectId("67bc2897003b5d52e8ff48f6"),
    "name": {
      "en-US": "Aaaa",
      "ja": "会津若松駅"
    },
    "description": {
      "en-US": "Inside the front entrance on the left."
    },
    "image_url": "",
    "location": [
      139.9303531179879,
      37.50781461320631
    ],
    "last_updated": new Date("2025-03-03T00:00:00.000Z")
  }
] as OptionalId<Stamp>[]