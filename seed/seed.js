const paintScheme = require("../schema/paintSchemeModel");
const user = require("../schema/userModel");

async function seed(paintSchemes, users) {
  await paintScheme.deleteMany();
  await user.deleteMany();

  await paintScheme.insertMany(paintSchemes);
  await user.insertMany(users);
}

module.exports = seed;
