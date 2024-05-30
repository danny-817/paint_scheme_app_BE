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
	} catch (error) {
		throw error;
	}
}

module.exports = { patchPaintScheme };
