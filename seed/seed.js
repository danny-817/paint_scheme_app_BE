const paintScheme = require("../schema/paintSchemeModel");
const userProfile = require("../schema/userModel");

async function seed(paintSchemes, userProfiles) {
	await paintScheme.deleteMany();
	await userProfile.deleteMany();

	await paintScheme.insertMany(paintSchemes);
	await userProfile.insertMany(userProfiles);
}

module.exports = seed;
