const express = require("express");
const router = express.Router();
const paintscheme = require("../schema/paintSchemeModel");
const {
  getAllSchemes,
  postNewScheme,
  getOneScheme,
  patchScheme,
} = require("../controllers/paintScheme_controller");
const { Long } = require("mongodb");

router.get("/", getAllSchemes);

router.get("/:id", getOneScheme);

router.post("/", postNewScheme);

router.patch("/:id", patchScheme);

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

  let item;
  try {
    item = await paintscheme.findById(req.params.id);

    if (item == null) {
      return res.status(404).send({ msg: "Paint scheme not found" });
    }
  } catch (err) {
    return res.status(500).send({ msg: err.msg });
  }
  res.item = item;

  next();
}
module.exports = router;
