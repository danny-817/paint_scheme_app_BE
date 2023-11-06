const express = require("express");
const router = express.Router();
const paintscheme = require("../schema/paintSchemeModel");
const {
  getAllSchemes,
  postNewScheme,
} = require("../controllers/paintScheme_controller");
// /api/paintschemes
//get all

// router.get("/", (req, res) => {
//   getAllSchemes().then((allSchemes) => {
//     res.status(200).send(allSchemes);
//   });
// });

router.get("/", getAllSchemes);

//get one
router.get("/:id", getId, (req, res) => {
  //console.log("get one");
  res.json(res.item);
});

//create one
// router.post("/", async (req, res) => {
//   const item = new paintscheme({
//     username: req.body.username,
//     scheme_name: req.body.scheme_name,
//     scheme_for: req.body.scheme_for,
//     paint_list: req.body.paint_list,
//     steps: req.body.steps,
//     notes: req.body.notes,
//   });

//   try {
//     const newItem = await item.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.post("/", postNewScheme);

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
  const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!mongoIdRegex.test(req.params.id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  //console.log(req.params.id, "getId function");
  let item;
  try {
    item = await paintscheme.findById(req.params.id);
    //console.log(item);
    if (item == null) {
      return res.status(404).send({ msg: "Paint scheme not found" });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.msg });
  }
  res.item = item;
  //console.log(res.item._id);
  next();
}
module.exports = router;
