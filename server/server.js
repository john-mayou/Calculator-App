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

// INPUT PARSE AND VALIDATE FUNCTIONS BELOW THIS LINE
function expressionParse(string) {
	// splitting by either number or operator
	const mathCharRegex = /[0-9]+(\.[0-9]+)?|[+\-*\/\(\)\^]/g;
	const expressionArray = string.match(mathCharRegex);

	// changing all string numbers ('3') to number types (3)
	const numberRegex = /[0-9]+(\.[0-9]+)?/;
	return expressionArray.map((elem) => {
		return numberRegex.test(elem) ? Number(elem) : elem;
	});
}

function validateExpression(string) {}

// CALCULATE FUNCTION BELOW THIS LINE
function calculate(array) {
	if (!array.includes(")")) {
		return calculateExpression(array);
	} else {
		const { closeParen, openParen } = findParenExpressionIndexes(array);
		let expressionWithParen = array.slice(openParen, closeParen + 1);
		const expressionNoParen = expressionWithParen.filter((elem) => {
			return elem !== "(" && elem !== ")";
		});
		console.log(expressionNoParen);
		const numItemsToRemove = closeParen - openParen + 1;
		const newArray = array.splice(
			openParen,
			numItemsToRemove,
			calculateExpression(expressionNoParen)
		);
		return calculate(array);
	}
}

function calculateExpression(array) {
	while (array.length > 1) {
		const indexToSlice = findHighestOrderOfOperations(array) - 1;
		const sliceToEvaluate = array.slice(indexToSlice, indexToSlice + 3);
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
