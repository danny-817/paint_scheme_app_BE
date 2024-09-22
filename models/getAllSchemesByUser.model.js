const paintScheme = require("../schema/paintSchemeModel");
const users = require("../schema/userModel");

async function getAllSchemesByUser(userName) {
	try {
		const allUserSchemes = await paintScheme.find({ username: userName });
		if (allUserSchemes.length === 0) {
			return Promise.reject({
				status: 200,
				msg: "This user has no paintschemes saved",
			});
		}
		return allUserSchemes;
	} catch (error) {}
}

module.exports = { getAllSchemesByUser };
