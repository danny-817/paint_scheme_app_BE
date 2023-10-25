const express = require("express");
const router = express.Router();
const paintScheme = require("../schema/paintSchemeModel");
//get all
router.get("/", async (req, res) => {
  console.log("test");
  try {
    const items = await paintScheme.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get one
router.get("/:id", getId, (req, res) => {
  res.json(res.item);
});

//create one
router.post("/", async (req, res) => {
  const item = new paintScheme({
    name: req.body.name,
    paint: req.body.paint,
    brushes: req.body.brushes,
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
router.delete("/:id", getId, async (req, res) => {
  try {
    await paintScheme.deleteOne(res.item._id);
    res.json({ message: "deleted subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getId(req, res, next) {
  let item;
  try {
    item = await paintScheme.findById(req.params.id);
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
