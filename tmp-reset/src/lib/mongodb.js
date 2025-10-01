// lib/mongodb.ts
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;
if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env");
}
if (process.env.NODE_ENV === "development") {
    // Use global variable to maintain a cached connection during hot reloads in dev
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
}
else {
    // In production, create a new client for every connection
    client = new MongoClient(uri);
    clientPromise = client.connect();
}
export default clientPromise;
