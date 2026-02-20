import "dotenv/config";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const count = await mongoose.connection.collection('products').countDocuments();
  console.log("SUCCESS_COUNT:" + count);
  process.exit(0);
}
check();
