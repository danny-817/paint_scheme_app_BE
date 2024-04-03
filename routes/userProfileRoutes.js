const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userprofile = require("../schema/userModel");
const { getAllUserProfiles } = require("../models/getAllUserProfiles.model");

router.get("/", (req, res) => {
	getAllUserProfiles().then((allUserProfiles) => {
		res.status(200).send(allUserProfiles);
	});
});

module.exports = router;
