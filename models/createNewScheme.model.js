const paintScheme = require("../schema/paintSchemeModel");

async function createNewScheme(newScheme) {
	const schemeToAdd = new paintScheme(newScheme);
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
