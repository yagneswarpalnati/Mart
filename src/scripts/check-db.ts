import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

async function checkCount() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is undefined");
    await mongoose.connect(uri);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`COLLECTIONS: ${collections.map(c => c.name).join(', ')}`);
    
    // Check if pluralization is the issue (Product vs Products)
    for (const coll of collections) {
      const c = await mongoose.connection.collection(coll.name).countDocuments();
      console.log(`Collection '${coll.name}' has ${c} documents.`);
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkCount();
