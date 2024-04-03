const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userprofile = require("../schema/userModel");
const { getAllUserProfiles } = require("../models/getAllUserProfiles.model");
const { postNewUser } = require("../models/postNewUser.model");

router.get("/", (req, res, next) => {
	getAllUserProfiles().then((allUserProfiles) => {
		res.status(200).send(allUserProfiles);
	});
});

router.post("/", (req, res, next) => {
	const newUserData = req.body;
	postNewUser(newUserData).then((newUser) => {
		res.status(201).send(newUser);
	});
});

module.exports = router;
