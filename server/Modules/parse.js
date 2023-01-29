function expressionParse(string) {
	// finding matches of either number, operator or parenthesis
	const mathCharRegex = /[0-9]+(\.[0-9]+)?|[+\-*\/\(\)\^]/g;
	const expressionArray = string.match(mathCharRegex);

	// changing all string numbers ('3') to number types (3)
	const numberRegex = /[0-9]+(\.[0-9]+)?/;
	return expressionArray.map((elem) => {
		return numberRegex.test(elem) ? Number(elem) : elem;
	});
}

module.exports = expressionParse;
