function isValidExpression(string) {
	// finding matches of either number, operator or parenthesis
	const mathCharRegex = /[0-9]+(\.[0-9]+)?|[+\-*\/\(\)\^]/g;
	const expressionArray = string.match(mathCharRegex);

	return (
		validateMatchingParentheses(string) &&
		!/[+\-*\/\^]{2,}/g.test(string) && // two operators touching
		expressionArray.length >= 3 && // expression needs 3 parts i.e 1+1
		expressionArray.join("") === string && // checking for straggling letters/periods
		expressionArray.filter((s) => /[0-9]+/g.test(s)).length >= 2 && // 2+ numbers
		expressionArray.filter((s) => /[+\-*\/\^]+/g.test(s)).length >= 1 && // 1+ operator
		expressionArray.every((s) => s !== " ") // no spaces
	);
}

function validateMatchingParentheses(string) {
	let stack = [];
	// loop through string
	for (let i = 0; i < string.length; i++) {
		let char = stack[stack.length - 1]; // last item on stack

		if (string[i] === "(") {
			stack.push(string[i]);
		} else if (char === "(" && string[i] === ")") {
			// correct match
			stack.pop();
		} else if (char === undefined && string[i] === ")") {
			// no matching open
			return false;
		}
	}
	// if all '(' on the stack have been popped (no unclosed parens)
	return stack.length ? false : true;
}

module.exports = isValidExpression;
