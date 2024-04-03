const userProfile = require("../schema/userModel");

function getAllUserProfiles() {
	console.log("in the new function");
	return userProfile.find().then((response) => {
		return response;
	});
}

module.exports = { getAllUserProfiles };
