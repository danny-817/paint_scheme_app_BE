const express = require("express");
const router = express.Router();
const paintscheme = require("../schema/paintSchemeModel");
const { getAllSchemes } = require("../models/getAllSchemes.model");
const { createNewScheme } = require("../models/createNewScheme.model");
// /api/paintschemes
//get all

router.get("/", (req, res) => {
	getAllSchemes().then((allSchemes) => {
		res.status(200).send(allSchemes);
	});
});
// router.get("/", async (req, res) => {
//   try {
//     const items = await paintscheme.find();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//get one
router.get("/:id", getId, (req, res) => {
	res.json(res.item);
});

//create one
// router.post("/", async (req, res) => {
// 	const item = new paintscheme({
// 		username: req.body.username,
// 		scheme_name: req.body.scheme_name,
// 		scheme_for: req.body.scheme_for,
// 		paint_list: req.body.paint_list,
// 		steps: req.body.steps,
// 		notes: req.body.notes,
// 	});

// 	try {
// 		const newItem = await item.save();
// 		res.status(201).json(newItem);
// 	} catch (err) {
// 		res.status(400).json({ message: err.message });
// 	}
// });
router.post("/", (req, res, next) => {
	createNewScheme(req.body)
		.then((addedScheme) => {
			res.status(201).send(addedScheme);
		})
		.catch((error) => {
			// Handle the error
			console.log(error, "new error");
			res.status(400).send({ message: error.message });
		});
});

//update one
router.patch("/:id", getId, (req, res) => {});

//delete one
router.delete("/:id", getId, async (req, res) => {
	try {
		await paintscheme.deleteOne(res.item._id);
		res.json({ message: "deleted subscriber" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function getId(req, res, next) {
	let item;
	try {
		item = await paintscheme.findById(req.params.id);
		if (item == null) {
			return res.status(404).json({ message: "cannot find item" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
	res.item = item;
	console.log(res.item._id);
	next();
}
module.exports = router;
