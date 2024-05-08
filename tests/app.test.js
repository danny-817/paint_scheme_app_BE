const mongoose = require("mongoose");
const request = require("supertest");
const testSchemes = require("../data/test_schemes");
const testUsers = require("../data/test_users");
const seed = require("../seed/seed");
const paintScheme = require("../schema/paintSchemeModel");

const app = require("../server");
const { Long } = require("mongodb");

beforeAll(async () => {
	await mongoose.connect(process.env.TEST_DATABASE_URL);
	await seed(testSchemes, testUsers);
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
});
describe("GET - /api/paintschemes/${id} ", () => {
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
		return request(app)
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
						expect(body.scheme_name).toBe("get one test scheme");
					});
			});
	});
	test("validates the id used and returns an error message and a 400 code if its invalid", () => {
		request(app)
			.get("/api/paintschemes/1234")
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Invalid ID used");
			});
	});
	test("returns and code of 404 when the id is valid but not in use", async () => {
		request(app)
			.get("/api/paintschemes/53cb6b9b4f4ddef1ad47f943")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe(
					"No paint scheme found with this ID"
				);
			});
	});
});

describe("POST - /api/paintschemes", () => {
	test("when posting a new scheme, responds with a 201 code and a copy of the scheme", () => {
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
				expect(body).toHaveProperty("_id", expect.any(String));
				expect(body).toHaveProperty("username", expect.any(String));
				expect(body).toHaveProperty("scheme_name", expect.any(String));
				expect(body).toHaveProperty("paint_list", expect.any(Array));
				expect(body).toHaveProperty("steps", expect.any(Array));
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
	test("responds with a 400 code and a msg of Bad Request if the request doesn't have a username", () => {
		badUserNameScheme = {
			username: "badUserName",
			scheme_name: "bad username test scheme",
			paint_list: ["Devlan Mud", "Sunburst Yellow"],
			steps: [
				"Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
				"Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
			],
		};

		return request(app)
			.post("/api/paintschemes")
			.send(badUserNameScheme)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe("Bad request");
			});
	});
	test("responds with a 400 code and a msg of Please enter a name for your paint scheme if there is no scheme name", () => {
		invalidNameScheme = {
			username: "dannytest",
			scheme_name: "",
			paint_list: ["Corax White", "Phoenician Purple"],
			steps: [
				"Ipsum sint minim tempor dolor deserunt dolor non veniam cupidatat elit irure. ",
				"Et laboris velit consequat esse fugiat amet elit cillum esse magna nisi.",
				"Aliquip adipisicing laborum est eiusmod qui ipsum do veniam non eu sunt esse. ",
			],
		};

		return request(app)
			.post("/api/paintschemes")
			.send(invalidNameScheme)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe(
					"Please enter a name for your paint scheme"
				);
			});
	});
});

describe("GET - /api/userprofiles", () => {
	test("responds with a 200 and a list of all user profiles (5)", () => {
		return request(app)
			.get("/api/userprofiles")
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveLength(5);
				response.body.forEach((profile) => {
					expect(profile).toHaveProperty(
						"username",
						expect.any(String)
					);
					expect(profile).toHaveProperty(
						"password",
						expect.any(String)
					);
					expect(profile).toHaveProperty(
						"email_address",
						expect.any(String)
					);
					expect(profile).toHaveProperty(
						"security_answers",
						expect.any(Array)
					);
				});
			});
	});
	test("responds with a 404 code and a message of Path nto found if the path is incorrect", () => {
		return request(app)
			.get("/api/users")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe("url not found");
			});
	});
});
describe("GET - /api/userprofiles/${id}", () => {
	test("responds with a 200 code and the specified user", async () => {
		newUserToGet = {
			username: "newusertoget",
			password: "newusertogetpassword",
			email_address: "newusertoget@email.com",
			security_answers: ["get", "this", "user"],
		};
		const userToGetResponse = await request(app)
			.post("/api/userprofiles")
			.send(newUserToGet);

		const createdUser = userToGetResponse.body;

		console.log(createdUser);

		return request(app)
			.get(`/api/userprofiles/${createdUser._id}`)
			.expect(200)
			.then((response) => {
				expect(response.body).toHaveProperty(
					"username",
					"newusertoget"
				);
				expect(response.body).toHaveProperty(
					"password",
					"newusertogetpassword"
				);
				expect(response.body).toHaveProperty(
					"email_address",
					"newusertoget@email.com"
				);
				expect(response.body).toHaveProperty("security_answers", [
					"get",
					"this",
					"user",
				]);
				expect(response.body).not.toBe(newUserToGet);
			});
	});
});

describe("POST - /api/userprofiles", () => {
	test("responds with a 201 code and a copy of the user when creating a new user", () => {
		newUserData = {
			username: "newuser",
			password: "newuserpassword",
			email_address: "newuser@email.com",
			security_answers: ["new", "user", "answers"],
		};

		return request(app)
			.post("/api/userprofiles")
			.send(newUserData)
			.expect(201)
			.then(({ body }) => {
				expect(body).not.toBe(newUserData);
				expect(body.__v).toBe(0);
				expect(body).toHaveProperty("username", expect.any(String));
				expect(body).toHaveProperty("password", expect.any(String));
				expect(body).toHaveProperty(
					"email_address",
					expect.any(String)
				);
				expect(body).toHaveProperty(
					"security_answers",
					expect.any(Array)
				);
				expect(body).toHaveProperty("_id", expect.any(String));
			});
	});
	test("responds with an error and a message of <email_address>is not a valid email address! when in invalid email address is used", () => {
		badEmailUserData = {
			username: "bad_email_user",
			password: "badEmailuserpassword",
			email_address: "newuseratemailcom",
			security_answers: ["bad", "email", "answers"],
		};

		return request(app)
			.post("/api/userprofiles")
			.send(badEmailUserData)
			.then((response) => {
				expect(response.body.errors.email_address.message).toBe(
					"newuseratemailcom is not a valid email address!"
				);
			});
	});
	test("responds with an error and an message when trying to post a user that already exists", () => {
		duplicateUserData = {
			username: "dannytest",
			password: "newuserpassword2",
			email_address: "newuser2@email.com",
			security_answers: ["new", "user", "answers"],
		};

		return request(app)
			.post("/api/userprofiles")
			.send(duplicateUserData)
			.then((response) => {
				expect(response.body.errorCode).toBe(11000);
				expect(response.body.errorMessage).toBe(
					"User already exists, check your details and try again."
				);
			});
	});
});

describe("DELETE - /api/useprofiles/${id}", () => {
	test("responds with a code of 204 ", async () => {
		userToDelete = {
			username: "delete this user",
			password: "deletethispassword",
			email_address: "deleted@email.com",
			security_answers: ["delete", "me", "now"],
		};
		const createdUserResponse = await request(app)
			.post("/api/userprofiles")
			.send(userToDelete);
		const createdUser = createdUserResponse.body;
		return request(app)
			.delete(`/api/userprofiles/${createdUser._id}`)
			.expect(204);
		// .then((response) => {
		// 	console.log(response, "response");
		// 	 Check for the existence of the deletedCount property
		// 	expect(response.body).toHaveProperty("deletedCount");
		// });
	});
	test("responds with a 404 if the id is non-existant", () => {
		return request(app)
			.delete("/api/userprofiles/53cb6b9b4f4ddef1ad47f943")
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe("No user exists with this ID.");
			});
	});
});
