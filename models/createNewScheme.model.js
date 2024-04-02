const paintScheme = require("../schema/paintSchemeModel");
const userProfile = require("../schema/userModel");

async function createNewScheme(newScheme) {
	const schemeToAdd = new paintScheme(newScheme);
	const checkUser = await userProfile.exists({
		username: schemeToAdd.username,
	});
	if (!checkUser) {
		return Promise.reject({
			status: 400,
			msg: "Bad request",
		});
	}
	if (schemeToAdd.scheme_name.length === 0) {
		return Promise.reject({
			status: 400,
			msg: "Please enter a name for your paint scheme",
		});
	}
	const checkDoc = await paintScheme.exists({
		username: schemeToAdd.username,
		scheme_name: schemeToAdd.scheme_name,
	});
	if (checkDoc)
		return Promise.reject({
			status: 409,
			msg: "That paint scheme already exists.",
		});

	const addedScheme = await schemeToAdd.save();
	return addedScheme;
}

module.exports = { createNewScheme };
