const paintscheme = require("../schema/paintSchemeModel");

async function getSchemeById(id) {
	const singleScheme = await paintscheme.findById(id);
	if (!singleScheme) {
		return Promise.reject({
			status: 404,
			msg: "No paint scheme found with this ID",
		});
	}
	return singleScheme;
}

module.exports = { getSchemeById };
