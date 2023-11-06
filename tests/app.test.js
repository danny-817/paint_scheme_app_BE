const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");
const testUsers = require("../data/test_users");
const seed = require("../seed/seed");

const app = require("../server");
const { Long } = require("mongodb");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
  await seed(testSchemes, testUsers);
});

afterAll(() => {
  mongoose.connection.close();
});

describe("non existant/misspelt path", () => {
  test("return a 404 error code and 'url not found' when given a non-existant url", () => {
    return request(app)
      .get("/badpath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("url not found");
      });
  });
  test("return a 404 error code and 'url not found' when the url is misspelt", () => {
    return request(app)
      .get("/api/paintscheme")
      .expect(404)
      .expect(({ body }) => {
        expect(body.msg).toBe("url not found");
      });
  });
});
let testSchemeId = [];
describe("/api/paintschemes", () => {
  test("GET: responds with all (20) saved paint schemes", () => {
    return request(app)
      .get("/api/paintschemes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(20);
        testSchemeId = body[0]._id;
      })
      .catch((err) => {
        throw err;
      });
  });
  test("GET: each item has an id,username and a scheme name", () => {
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
  /*due to mongoDB generating id's each time the db is seeded, the id changes with each seed. the variable testSchemeId used below is set when the test that gets all data runs. See above.*/
  test("GET: gets a single paint scheme when provided with a mongodb id", () => {
    return request(app)
      .get(`/api/paintschemes/${testSchemeId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("_id");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("scheme_name");
      });
  });
  test("GET: when given an valid but incorrect mongoDB id, returns a 404 and a message of paint scheme not found", () => {
    return request(app)
      .get("/api/paintschemes/654028105f5ab025df869811")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Paint scheme not found");
      });
  });
  test("GET: when given something other than a valid mongoDB id, returns  400 and a message of Bad request", () => {
    return request(app)
      .get("/api/paintschemes/paintscheme")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST: when posting a new document, returns that document and a 201 code", () => {
    const testPost = {
      username: "test_poster",
      scheme_name: "test_scheme",
      scheme_for: "jest test",
      paint_list: ["Corax White", "Phoenician Purple"],
      steps: [
        "Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
        "Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
        "Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
      ],
    };

    return request(app)
      .post("/api/paintschemes")
      .send(testPost)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("username", expect.any(String));
        expect(body).toHaveProperty("scheme_name", expect.any(String));
        expect(body).toHaveProperty("scheme_for", expect.any(String));
        expect(body).toHaveProperty("paint_list", expect.any(Array));
        expect(body).toHaveProperty("steps", expect.any(Array));
      });
  });
  test("POST: responds with an error and a message of bad request if not provided with the correct keys", () => {
    const badTestPost = {
      steps: [
        "Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
        "Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
        "Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
      ],
    };
    return request(app)
      .post("/api/paintschemes")
      .send(badTestPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("paintscheme validation failed");
      });
  });
  test("POST: when trying to post a scheme where the name already exists in the database, returns a 400 and a message of `A paint scheme by the name already exists`", () => {
    const testPost = {
      username: "test_poster",
      scheme_name: "test_scheme",
      scheme_for: "jest test",
      paint_list: ["Corax White", "Phoenician Purple"],
      steps: [
        "Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
        "Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
        "Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
      ],
    };
    return request(app)
      .post("/api/paintschemes")
      .send(testPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("A paint scheme by the name already exists");
      });
  });
});

//GET one
//PATCH one
//DELETE one
