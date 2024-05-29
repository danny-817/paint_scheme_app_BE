const userProfile = require("../schema/userModel");

async function getUserById(idToGet) {
	// console.log(idToGet);
	try {
		const singleUser = await userProfile.findById(idToGet);
		return singleUser;
	} catch (error) {}
}

module.exports = { getUserById };
