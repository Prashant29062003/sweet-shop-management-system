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

