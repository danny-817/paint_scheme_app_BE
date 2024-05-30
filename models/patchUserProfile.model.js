const userProfile = require("../schema/userModel");

async function patchUserProfile(id, patchData) {
	try {
		const patchedUserProfile = await userProfile.findByIdAndUpdate(
			id,
			patchData,
			{ returnDocument: "after" }
		);
		return patchedUserProfile;
	} catch (error) {
		throw error;
	}
}

module.exports = { patchUserProfile };
