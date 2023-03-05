import request from "supertest";
// eslint-disable-next-line node/no-missing-import
import { app } from "../index";

describe("Server", () => {
  it("should return a 200 response when hitting the root URL", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
