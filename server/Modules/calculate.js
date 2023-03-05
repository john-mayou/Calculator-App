/**
 * Recursive function that finds nested parenthese, evaluates those parts and replaces them with the calculated values
 * When no parentheses are left, that expression is sent to a helper function to calculate
 * @param {array} array // expression parts array
 * @returns number - final calculated value
 */
function calculate(array) {
	if (!array.includes(")")) {
		// base case, no parens
		return calculateExpression(array);
	} else {
		const { closeParen, openParen } = findParenExpressionIndexes(array); // finds index of matching parens
		let expressionWithParen = array.slice(openParen, closeParen + 1); // creates new array of parentheses expression
		const expressionNoParen = expressionWithParen.filter((elem) => {
			// i.e. [1, '+', 1] now
			return elem !== "(" && elem !== ")";
		}); // filters out parens
		const numItemsToRemove = closeParen - openParen + 1; // how many to splice from original array
		const newArray = array.splice(
			openParen,
			numItemsToRemove,
			calculateExpression(expressionNoParen)
		);
		return calculate(array); // call itself with smaller spliced original array
	}
}

/**
 * Finds the next operation of the expression to operate on and evaluates it
 * @param {array} array // expression parts array
 * @returns number - calculated value
 */
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

/**
 * Finds a matching parentheses pair and returns their index values
 * @param {array} array // expression parts array
 * @returns object with open paren index and closed paren index
 */
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

/**
 * Return the index value of the highest order of operation in the array
 * @param {array} array // expression parts array
 * @returns number
 */
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

/**
 * Calculates a 3 part expression (1+1)
 * @param {array} array // expression parts array
 * @returns number
 */
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
