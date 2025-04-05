import Stamp from "@/database/database_types/stamp";
import { ObjectId, OptionalId } from "mongodb";

export default [
  {
    "_id": new ObjectId("67bc2897003b5d52e8ff48f6"),
    "name": {
      "en-US": "Aizuwakamatsu",
      "ja": "会津若松駅"
    },
    "description": {
      "en-US": "Inside the front entrance on the left."
    },
    "image_url": "fakeimage",
    "location": [
      139.9303531179879,
      37.50781461320631
    ],
    "last_updated": new Date("2025-05-05T00:00:00.000Z")
  }, // Aizu stamp is more recent but further
  {
    "_id": new ObjectId("67bc2897003b5d52e8ff48f5"),
    "name": {
      "en-US": "Tokyo",
      "ja": "東京"
    },
    "description": {
      "en-US": ""
    },
    "image_url": "fakeimage",
    "location": [
      139.6500,
      35.6764
    ],
    "last_updated": new Date("2025-04-04T00:00:00.000Z")
  } // Tokyo stamp is closer but less recent
] as OptionalId<Stamp>[]