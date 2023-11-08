const paintscheme = require("../schema/paintSchemeModel");

function getAllSchemes(req, res, next) {
  paintscheme.find().then((allSchemes) => {
    res.status(200).send(allSchemes);
  });
}

function getOneScheme(req, res, next) {
  const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!mongoIdRegex.test(req.params.id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  paintscheme
    .findById(req.params.id)
    .then((scheme) => {
      if (!scheme) {
        return Promise.reject({ status: 404, msg: "Paint scheme not found" });
      } else {
        res.status(200).send(scheme);
      }
    })
    .catch(next);
}

function postNewScheme(req, res, next) {
  //check if scheme already exists
  paintscheme
    .find({ scheme_name: req.body.scheme_name })
    .then((scheme) => {
      if (scheme.length === 0) {
        paintscheme
          .create(req.body)
          .then((postedScheme) => {
            res.status(201).send(postedScheme);
          })
          .catch((err) =>
            res.status(400).send({ msg: "paintscheme validation failed" })
          );
      } else {
        res
          .status(400)
          .send({ msg: "A paint scheme by the name already exists" });
      }
    })
    .catch((err) => console.error(err));
}

function patchScheme(req, res, next) {
  const mongoIdRegex = /^[a-fA-F0-9]{24}$/;
  if (!mongoIdRegex.test(req.params.id)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  const id = req.params.id;

  paintscheme
    .findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { returnDocument: "after" }
    )
    .then((response) => {
      if (response) {
        console.log(response, "response");
        return res.status(200).send(response);
      } else {
        return res.status(404).send({ msg: "Paint scheme not found" });
      }
    })
    .catch(next);
}

// return Business.findOneAndUpdate(
//   { _id },
//   { $set: body },
//   { returnDocument: "after" }
// ).then((response) => {
//   if (!response) {
//     return Promise.reject({ status: 404, msg: "Business not found" });
//   }
//   return response;
// });
module.exports = { getAllSchemes, postNewScheme, getOneScheme, patchScheme };
