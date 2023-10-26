const paintscheme = require("../schema/paintSchemeModel");

function getAllSchemes() {
  return paintscheme.find().then((response) => {
    return response;
  });
}

module.exports = { getAllSchemes };
