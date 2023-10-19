const express = require("express");
const router = express.Router();
const testModel = require("../models/testmodel");
//get all
router.get("/", async (req, res) => {
  try {
    const items = await testModel.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get one
router.get("/:id", (req, res) => {
  res.send(req.params.id);
});

//create one
router.post("/", async (req, res) => {
  const item = new testModel({
    name: req.body.name,
    type: req.body.type,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update one
router.patch("/", (req, res) => {});

//delete one
router.delete("/:id", (req, res) => {
  req.params.id;
});
module.exports = router;
