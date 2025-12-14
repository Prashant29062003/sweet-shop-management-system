import request from "supertest";
import app from "../../app.js";

describe("Sweet Module", () => {

  it("should create a sweet (admin access)", async () => {
    const res = await request(app)
      .post("/api/v1/sweets")
      .send({
        name: "peda",
        price: 10,
        quantity: 100
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("peda");
  });

  it("should get all sweets", async () => {
    const res = await request(app)
      .get("/api/v1/sweets");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

});
