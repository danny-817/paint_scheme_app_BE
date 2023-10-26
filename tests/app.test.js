const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");
const seed = require("../seed/seed");

const app = require("../server");
const { Long } = require("mongodb");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
  await seed(testSchemes);
});

afterAll(() => {
  mongoose.connection.close();
});

describe("non existant path", () => {
  test("return a 404 error code and 'url not found' when given a non-existant url", () => {
    return request(app)
      .get("/badpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("url not found");
      });
  });
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
