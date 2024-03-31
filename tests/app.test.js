const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");
const seed = require("../seed/seed");
const paintScheme = require("../schema/paintSchemeModel");

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

describe("GET - /api/paintschemes", () => {
	describe("GET ALL PAINT SCHEMES", () => {
		test("responds with all (20) saved paint schemes", () => {
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
		test("each item has an id,username and a scheme name", () => {
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
	describe("GET ONE PAINT SCHEME BY ID", () => {
		test("returns the correct paint schemes when given an ID", () => {
			getOneTestScheme = {
				username: "dannytest",
				scheme_name: "get one test scheme",
				paint_list: ["Devlan Mud", "Sunburst Yellow"],
				steps: [
					"Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
					"Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
				],
			};

			let testId;
			request(app)
				.post("/api/paintschemes")
				.send(getOneTestScheme)
				.then(({ body }) => {
					testId = body._id;
				})
				.then(() => {
					return request(app)
						.get(`/api/paintschemes/${testId}`)
						.expect(200)
						.then(({ body }) => {
							expect(body._id).toBe(testId);
							expect(body.scheme_name).toBe(
								"get one test scheme"
							);
						});
				});
		});
		test("validates the id used and returns an error message if its invalid", () => {
			request(app).get("/api/paintschemes/1234").then;
		});
	});
});

describe("CREATE - /api/paintschemes", () => {
	test("CREATE: can create new paint schemes", () => {
		createTestScheme = {
			username: "dannytest",
			scheme_name: "newly created scheme",
			paint_list: ["Corax White", "Phoenician Purple"],
			steps: [
				"Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
				"Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
				"Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
			],
		};
		return request(app)
			.post("/api/paintschemes")
			.send(createTestScheme)
			.expect(201)
			.then(({ body }) => {
				expect(body).toHaveProperty("_id");
				expect(body).toHaveProperty("username");
				expect(body).toHaveProperty("scheme_name");
			});
	});
	test("cannot create 2 schemes with the same name and username", async () => {
		createTestScheme = {
			username: "dannytest",
			scheme_name: "newly created scheme",
			paint_list: ["Corax White", "Phoenician Purple"],
			steps: [
				"Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
				"Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
				"Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
			],
		};

		return request(app)
			.post("/api/paintschemes")
			.send(createTestScheme)
			.expect(409)
			.then((response) => {
				expect(response.body.msg).toBe(
					"That paint scheme already exists."
				);
			});
	});
});
