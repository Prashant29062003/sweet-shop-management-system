import supertest from "supertest";
import app from "../../app";
import mongoose from "mongoose";

describe("Auth: Register", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });
});