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

describe("/api/paintschemes", () => {
  test("GET: responds with all (20) saved paint schemes", () => {
    return request(app)
      .get("/api/paintschemes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(20);
      })
      .catch((err) => {
        throw err;
      });
  });
  test("each item has am id,username and a scheme name", () => {
    return request(app)
      .get("/api/paintschemes")
      .expect(200)
      .then(({ body }) => {
        body.forEach((scheme) => {
          expect(scheme).toHaveProperty("_id");
          expect(scheme).toHaveProperty("username");
          expect(scheme).toHaveProperty("scheme_name");
        });
      });
  });
});
