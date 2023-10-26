const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");
const seed = require("../seed/seed");

const app = require("../server");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
  await seed(testSchemes);
});

afterAll(() => {
  mongoose.connection.close();
});

describe("paint scheme tests", () => {
  test("responds with all (20) saved paint schemes", () => {
    return request(app)
      .get("/api/paintschemes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(20);
      })
      .catch((err) => {
        throw error;
      });
  });
  test("each item has a username and a scheme name", () => {});
});
