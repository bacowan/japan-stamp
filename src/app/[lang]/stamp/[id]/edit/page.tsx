import { isStamp, Stamp } from "@/app/database-structure/stamp";
import { notFound } from 'next/navigation';
import { MongoClient, ObjectId } from "mongodb";
import Script from 'next/script';
import PageClient from "./page-client";

async function getStamp(id: string): Promise<Stamp | null> {
  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const database = client.db('japan_stamp');
      const collection = database.collection('stamps');
      const stamp = await collection.findOne(new ObjectId(id));
      if (isStamp(stamp)) {
        return stamp;
      }
      else {
        return null;
      }
    }
    catch (e) {
      // TODO: Logging
      return null;
    }
    finally {
      client.close();
    }
  }
  else {
    // TODO: Logging
    return null;
  }
};

interface EditStampPageParams {
    id: string,
    lang: string
  }
  
export default async function EditStampPage({ params }: { params: EditStampPageParams }) {
  const stamp = await getStamp(params.id);

  if (stamp === null) {
    notFound();
  }
    
  return <main
    style={{
        "flex": "1 1 auto",
        "position": "relative",
        "padding": "1em"
      }}>
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""></Script>
        <PageClient id={params.id} stamp={stamp} lang={params.lang}/>
  </main>
  }