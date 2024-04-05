const userProfile = require("../schema/userModel");

function getAllUserProfiles() {
	return userProfile.find().then((response) => {
		return response;
	});
}

module.exports = { getAllUserProfiles };
