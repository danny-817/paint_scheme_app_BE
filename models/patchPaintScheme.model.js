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
		return patchedScheme;
		// console.log(patchedScheme, "patched scheme");
	} catch (error) {
		return error;
	}
}

module.exports = { patchPaintScheme };
