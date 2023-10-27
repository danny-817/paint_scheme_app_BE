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
  test("GET: each item has am id,username and a scheme name", () => {
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
  test.only("gets a single paint scheme when provided with a mongodb id", () => {
    const testId = "653c0bf2201372814cf934f1";
    const testScheme = {
      username: "dannytest",
      scheme_name: "Bytecard",
      paint_list: [
        "Corax White",
        "Phoenician Purple",
        "Caledor Sky",
        "Lupercal Green",
        "Wraithbone",
        "Death Korps Drab",
        "Dryad Bark",
        "Iron Hands Steel",
        "Daemonette Hide",
        "Khorne Red",
        "Runelord Brass",
      ],
      steps: [
        "Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
        "Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
        "Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
        "Cupidatat laborum enim nostrud cillum voluptate amet incididunt consequat voluptate est esse eiusmod pariatur ad. ",
        "Id ut mollit nisi enim nisi excepteur occaecat anim. Sit tempor cillum culpa quis ut.",
      ],
    };
    return request(app)
      .get(`/api/paintschemes/${testId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(testScheme);
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
});

//GET one
//PATCH one
//DELETE one
