const express = require("express");
const router = express.Router();
const paintscheme = require("../schema/paintSchemeModel");
//get all
router.get("/", async (req, res) => {
  try {
    const items = await paintscheme.find();
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
  const item = new paintscheme({
    username: req.body.username,
    scheme_name: req.body.scheme_name,
    scheme_for: req.body.scheme_for,
    paint_list: req.body.paint_list,
    steps: req.body.steps,
    notes: req.body.notes,
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
