const fs = require("fs/promises");

function provideEndpoints(request, response) {
	fs.readFile("endpoints.json", "utf-8").then((apiJson) => {
		response.send(JSON.parse(apiJson));
		//console.log(apiJson, "endpoints");
	});
}

module.exports = provideEndpoints;
