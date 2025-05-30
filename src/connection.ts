import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { feedback?: mongoDB.Collection, users?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    //import config so it can accessed with process.env
    dotenv.config();
    //instantiate mongodb client at our cluster's uri address and connect to client
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || '');
    await client.connect();
        
    //instantiate mongodb database using client instance
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    //instantiate feedback mongodb collection from database instance and export for use elsewhere
    const feedbackCollection: mongoDB.Collection = db.collection(process.env.FEEDBACK_COLLECTION_NAME || '');
    collections.feedback = feedbackCollection;

    //instatiate users collection
    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME || '');
    collections.users = usersCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${feedbackCollection.collectionName}`);
 }

