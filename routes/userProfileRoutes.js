const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userprofile = require("../schema/userModel");
const { getAllUserProfiles } = require("../models/getAllUserProfiles.model");
const { postNewUser } = require("../models/postNewUser.model");
const { deleteUserById } = require("../models/deleteUser.model");
const { getUserById } = require("../models/getUserById.model");
const { patchUserProfile } = require("../models/patchUserProfile.model");

router.get("/", (req, res, next) => {
	getAllUserProfiles()
		.then((allUserProfiles) => {
			res.status(200).send(allUserProfiles);
		})
		.catch(next);
});

router.get("/:id", (req, res, next) => {
	const idToGet = req.params.id;
	if (mongoose.Types.ObjectId.isValid(idToGet)) {
		getUserById(idToGet)
			.then((retrievedUser) => {
				if (retrievedUser) {
					res.status(200).send(retrievedUser);
				} else
					res.status(404).send({
						msg: "No user found with this ID.",
					});
			})
			.catch(next);
	} else res.status(400).send({ msg: "Invalid ID used" });
});

router.post("/", (req, res, next) => {
	const newUserData = req.body;
	postNewUser(newUserData)
		.then((newUser) => {
			res.status(201).send(newUser);
		})
		.catch(next);
});

router.patch("/:id", (req, res, next) => {
	const id = req.params.id;
	const patchData = req.body;
	for (const key in patchData) {
		if (patchData[key] === false || patchData[key].length === 0) {
			res.status(400).send({ msg: "One or more fields were empty" });
		}
	}
	patchUserProfile(id, patchData)
		.then((patchedUser) => {
			res.status(200).send({ msg: "Patch successful.", patchedUser });
		})
		.catch(next);
});

router.delete("/:id", (req, res, next) => {
	const idToDelete = req.params.id;
	deleteUserById(idToDelete)
		.then((response) => {
			res.status(204).send();
		})
		.catch(next);
});

module.exports = router;
