const userprofile = require("../schema/userModel");
const mongodb = require("mongodb");

async function postNewUser(newUserData) {
	try {
		const profileToAdd = new userprofile(newUserData);

		const addedUserProfile = await profileToAdd.save();

		return addedUserProfile;
	} catch (error) {
		if (error && error.code === 11000) {
			return {
				errorMessage:
					"User already exists, check your details and try again.",
				errorCode: error.code,
			};
		} else return error;
	}
}

module.exports = { postNewUser };
