const userProfile = require("../schema/userModel");

async function deleteUserById(id) {
	const deletionResult = await userProfile.deleteOne({ _id: id });
	if (deletionResult.deletedCount === 0) {
		return Promise.reject({
			status: 404,
			msg: "No user exists with this ID.",
		});
	} else return deletionResult;
}

module.exports = { deleteUserById };
