const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");

const app = require("../server");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
});

afterAll(() => {
  mongoose.connection.close();
});

describe("paint scheme tests", () => {
  test("responds with all saved paint schemes", async () => {
    await request(app)
      .get("/api/paintschemes")
      .expect(200)
      .then(({ body }) => {
        console.log("test block", body);
      });
  });
});
