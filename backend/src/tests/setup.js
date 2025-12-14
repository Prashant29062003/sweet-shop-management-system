import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

let mongoServer;

beforeAll(async () => {
  // If a MONGO_URI is provided, use it; otherwise spin up an in-memory MongoDB for tests.
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    return;
  }

  // Use mongodb-memory-server for tests (install as dev dependency):
  // npm install --save-dev mongodb-memory-server
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
