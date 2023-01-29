// Boilerplate
const express = require("express");
const app = express();
app.use(express.static("server/public"));
app.use(express.urlencoded({ extended: true }));

// State
let calculationsArray = [
	{
		expressionArray: [2, "+", 3],
		answer: 5,
	},
	{
		expressionArray: [3, "*", 4],
		answer: 12,
	},
];

// Endpoints
app.post("/expressions", (req, res) => {
	const { expressionStr } = req.body;
	if (!isValidExpression(expressionStr)) {
		res.sendStatus(400);
		return;
	}

	const expressionArray = expressionParse(expressionStr);
	const answer = calculate([...expressionArray]);

	const newExpressionObj = {
		expressionArray,
		answer,
	};

	calculationsArray.push(newExpressionObj);
	res.sendStatus(201);
});

app.get("/expressions", (req, res) => {
	res.status(200);
	res.send(calculationsArray);
});

app.delete("/delete-expressions", (req, res) => {
	res.status();
});

// INPUT PARSE AND VALIDATE FUNCTIONS BELOW THIS LINE

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

// CALCULATE FUNCTION BELOW THIS LINE
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

// Listen
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
