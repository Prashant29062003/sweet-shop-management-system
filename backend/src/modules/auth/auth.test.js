import request from "supertest";
import app from "../../app.js";

describe("Auth: Register", () => {

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty("_id");
    expect(res.body.data.user.email).toBe("test@example.com");
    expect(res.body.data.user.role).toBe("user");
      });
});

describe("Auth: Login", () => {
  it("should login an existing user", async () => {
    // Ensure user exists for this test (tests clear DB between tests)
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    // controller returns tokens inside response data
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
  });
});
