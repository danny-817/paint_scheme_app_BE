const paintscheme = require("../schema/paintSchemeModel");

async function patchPaintScheme(id, patchData) {
	try {
		const patchedScheme = await paintscheme.findByIdAndUpdate(
			id,
			patchData,
			{
				returnDocument: "after",
			}
		);
		// console.log(patchedScheme, "patchedScheme");
		return patchedScheme;
		// console.log(patchedScheme, "patched scheme");
	} catch (error) {
		// console.log(error, "error");
		throw error;
	}
}

module.exports = { patchPaintScheme };
