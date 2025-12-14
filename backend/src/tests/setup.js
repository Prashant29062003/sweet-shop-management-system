import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

// Ensure secrets exist for JWT generation during tests
if (!process.env.ACCESS_TOKEN_SECRET) {
    process.env.ACCESS_TOKEN_SECRET = 'TEST_ACCESS_SECRET_0123456789ABCDEF';
}
// process.env.ACCESS_TOKEN_EXPIRY = '1d';
if (!process.env.REFRESH_TOKEN_SECRET) {
    process.env.REFRESH_TOKEN_SECRET = 'TEST_REFRESH_SECRET_FEDCBA9876543210';
}
// process.env.REFRESH_TOKEN_EXPIRY = '10d';

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
