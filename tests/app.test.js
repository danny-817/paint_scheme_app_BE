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
	test.only("cannot create 2 schemes with the same name and username", async () => {
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
		// // Create and save the first scheme
		// const firstScheme = new paintScheme(createTestScheme);
		// await firstScheme.save();

		// // Attempt to create and save another scheme with the same data
		// const secondScheme = new paintScheme(createTestScheme);
		// let error;
		// try {
		// 	await secondScheme.save();
		// } catch (err) {
		// 	console.log(err);
		// 	error = err;
		// }

		// // Check the error
		try {
			await request(app).post("/api/paintschemes").send(createTestScheme);
			await request(app).post("/api/paintschemes").send(createTestScheme);
		} catch (error) {
			console.log(error, "test block");
		}

		// Check that the save operation failed due to a duplicate key error
		// expect(error).toBeDefined();
		// expect(error.name).toBe("MongoError");
		// expect(error.code).toBe(11000);
		// MongoDB duplicate key error code
	});
});
