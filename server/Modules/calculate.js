function calculate(array) {
	if (!array.includes(")")) {
		// base case, no parens
		return calculateExpression(array);
	} else {
		const { closeParen, openParen } = findParenExpressionIndexes(array);
		let expressionWithParen = array.slice(openParen, closeParen + 1);
		const expressionNoParen = expressionWithParen.filter((elem) => {
			// i.e. [1, '+', 1] now
			return elem !== "(" && elem !== ")";
		});
		const numItemsToRemove = closeParen - openParen + 1; // how many to splice
		const newArray = array.splice(
			openParen,
			numItemsToRemove,
			calculateExpression(expressionNoParen)
		);
		return calculate(array); // call itself until no parens left
	}
}

function calculateExpression(array) {
	while (array.length > 1) {
		// index before highest operation
		const indexToSlice = findHighestOrderOfOperations(array) - 1;
		// always evaluate 3 items at a time i.e. 1+1
		const sliceToEvaluate = array.slice(indexToSlice, indexToSlice + 3);
		// replace the 3 indexes with the the evaluated value
		array.splice(indexToSlice, 3, operateOnTwoArgs(sliceToEvaluate));
	}
	return array[0];
}

function findParenExpressionIndexes(array) {
	const indexOfFirstClosingParen = array.indexOf(")");
	let indexOfMathingOpenParen;

	// finds the matching open parenthesis working
	// backwards from the first closed paren
	for (let i = indexOfFirstClosingParen; i >= 0; i--) {
		if (array[i] === "(") {
			indexOfMathingOpenParen = i;
			break;
		}
	}

	return {
		closeParen: indexOfFirstClosingParen,
		openParen: indexOfMathingOpenParen,
	};
}

function findHighestOrderOfOperations(array) {
	if (array.includes("^")) {
		return array.indexOf("^");
	} else if (array.includes("*")) {
		return array.indexOf("*");
	} else if (array.includes("/")) {
		return array.indexOf("/");
	} else if (array.includes("+")) {
		return array.indexOf("+");
	} else if (array.includes("-")) {
		return array.indexOf("-");
	} else {
		console.log("Error finding order of operations");
	}
}

function operateOnTwoArgs(array) {
	// parameter is an array of 3 values, [number, operator, number]
	const arg1 = array[0];
	const operator = array[1];
	const arg2 = array[2];

	switch (operator) {
		case "*":
			return arg1 * arg2;
		case "/":
			return arg1 / arg2;
		case "+":
			return arg1 + arg2;
		case "-":
			return arg1 - arg2;
		case "^":
			return arg1 ** arg2;
		default:
			console.log("Error operating on two args");
	}
}

module.exports = calculate;
