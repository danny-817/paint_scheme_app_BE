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
router.get("/:id", getId, (req, res) => {
  res.send(res.item.name);
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
router.patch("/:id", getId, (req, res) => {});

//delete one
router.delete("/:id", getId, (req, res) => {
  req.params.id;
});

async function getId(req, res, next) {
  let item;
  try {
    item = await testModel.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ messgage: "cannot find item" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.item = item;
  next();
}
module.exports = router;
