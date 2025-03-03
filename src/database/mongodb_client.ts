import { MongoClient } from "mongodb";

export default process.env.MONGODB_URI === undefined
  ? null
  : new MongoClient(process.env.MONGODB_URI);