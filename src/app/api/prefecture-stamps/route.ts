import { MongoClient } from "mongodb";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export async function GET(request: Request) {
  if (process.env.MONGODB_URI !== undefined) {
    const client = new MongoClient(process.env.MONGODB_URI);
  
    try { 
      await client.connect();
      const database = client.db('japan_stamp');
      const collection = database.collection('prefecture_stamps'); 
      const allData = await collection.find({}).toArray(); 
  
      return new Response(JSON.stringify(allData));
    } finally {
      await client.close(); 
    }
  }
}