const paintscheme = require("../schema/paintSchemeModel");

function getAllSchemes(req, res, next) {
  paintscheme.find().then((allSchemes) => {
    res.status(200).send(allSchemes);
  });
}

function postNewScheme(req, res, next) {
  paintscheme
    .create(req.body)
    .then((postedScheme) => {
      res.status(201).send(postedScheme);
    })
    .catch((err) =>
      res.status(400).send({ msg: "paintscheme validation failed" })
    );
}

module.exports = { getAllSchemes, postNewScheme };
