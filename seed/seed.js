const paintScheme = require("../schema/paintSchemeModel");

async function seed(paintSchemes, Users) {
  await paintScheme.deleteMany();

  await paintScheme.insertMany(paintSchemes);
}

module.exports = seed;
