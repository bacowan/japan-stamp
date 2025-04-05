import Stamp from "@/database/database_types/stamp";
import { defineConfig } from "cypress";
import { MongoClient, ObjectId, OptionalId } from "mongodb";
import { MongoMemoryServer } from 'mongodb-memory-server';
import stamps from './cypress/fixtures/stamps';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async initialize() {
          const server = await MongoMemoryServer.create({
            instance: {
              port: 27018
            }
          });
          const client = new MongoClient(server.getUri());
          const db = client.db("JapanStamp");
          await db.dropDatabase();
          const collection = db.collection<Stamp>("Stamps");
          await collection.insertMany(stamps);
          await collection.createIndex({ "location": "2dsphere" });
          return null;
        },

        async clean() {
          const server = await MongoMemoryServer.create({
            instance: {
              port: 27018
            }
          });
          const client = new MongoClient(server.getUri());
          const db = client.db("JapanStamp");
          await db.dropDatabase();
          await server.stop();
          return null;
        },

        log(value) {
          console.log(value);
          return null;
        }
      })
    },
    baseUrl: 'http://localhost:3000',
    experimentalRunAllSpecs: true
  },
});
