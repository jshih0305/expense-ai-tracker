import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// 在開發模式下 hot reload 會重新執行模組，把連線快取在 global 上避免重複建立連線
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalWithMongoose.mongooseCache = cache;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("請在 .env.local 設定 MONGODB_URI");
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
