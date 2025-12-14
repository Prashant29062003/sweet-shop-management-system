import request from "supertest";
import app from "../../app.js";

describe("Inventory Module", () => {

  it("should fetch inventory (admin only)", async () => {
    const res = await request(app)
      .get("/api/v1/inventory");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

});
