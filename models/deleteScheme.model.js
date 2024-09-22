const paintScheme = require("../schema/paintSchemeModel");

async function deleteSchemeById(id) {
	const deletionResult = await paintScheme.deleteOne({ _id: id });
	if (deletionResult.deletedCount == 0) {
		return Promise.reject({
			status: 404,
			msg: "No scheme exists with this ID.",
		});
	}
}

module.exports = { deleteSchemeById };
