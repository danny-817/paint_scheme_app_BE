const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const paintscheme = require("../schema/paintSchemeModel");
const { getAllSchemes } = require("../models/getAllSchemes.model");
const { createNewScheme } = require("../models/createNewScheme.model");
const { getSchemeById } = require("../models/getSchemeById.model");
const { patchPaintScheme } = require("../models/patchPaintScheme.model");
const { deleteSchemeById } = require("../models/deleteScheme.model");

router.get("/", (req, res) => {
	getAllSchemes().then((allSchemes) => {
		res.status(200).send(allSchemes);
	});
});

router.get("/:id", (req, res, next) => {
	const id = req.params.id;
	if (mongoose.Types.ObjectId.isValid(id)) {
		getSchemeById(id)
			.then((singleScheme) => {
				res.status(200).send(singleScheme);
			})
			.catch(next);
	} else res.status(400).send({ msg: "Invalid ID used" });
});

router.post("/", (req, res, next) => {
	createNewScheme(req.body)
		.then((addedScheme) => {
			res.status(201).send(addedScheme);
		})
		.catch(next);
});

router.patch("/:id", (req, res, next) => {
	id = req.params.id;
	patchData = req.body;
	for (const key in patchData) {
		if (patchData[key] === false || patchData[key].length === 0) {
			res.status(400).send({ msg: "One or more fields were empty" });
		}
	}
	patchPaintScheme(id, patchData)
		.then((patchedScheme) => {
			res.status(200).send({ msg: "Patch successful.", patchedScheme });
		})
		.catch(next);
});

router.delete("/:id", (req, res, next) => {
	const idToDelete = req.params.id;
	deleteSchemeById(idToDelete)
		.then((response) => {
			res.status(204).send();
		})
		.catch(next);
});

module.exports = router;
