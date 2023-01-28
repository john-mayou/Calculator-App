// Boilerplate
const express = require("express");
const app = express();
app.use(express.static("server/public"));
app.use(express.urlencoded({ extended: true }));

// State
let expressionsList = [
	{
		expressionParts: ["2", "+", "3"],
		answer: 5,
	},
	{
		expressionParts: ["3", "*", "4"],
		answer: 12,
	},
];

app.post("/expressions", (req, res) => {
	let expressionParts = req.body.parts;
	expressionParts = expressionParts.map((elem) => {
		let numberRegex = /[0-9]+(\.[0-9]+)?/;
		return numberRegex.test(elem) ? Number(elem) : elem;
	}); // changing string numbers to numbers

	let answer = calculateExpression([...expressionParts]);

	const newExpressionObj = {
		expressionParts,
		answer,
	};

	expressionsList.push(newExpressionObj);
	res.sendStatus(201);
});

app.get("/expressions", (req, res) => {
	res.send(expressionsList);
	res.sendStatus(200);
});

// Helper functions
function calculateParentheses(array) {
	if (!array.includes(")")) {
		return calculateExpression(array);
	} else {
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
		closingParen: indexOfFirstClosingParen,
		openParen: indexOfMathingOpenParen,
	};
}

function findHighestOrderOfOperations(array) {
	if (array.indexOf("*") !== -1) {
		// update to find
		return array.indexOf("*");
	} else if (array.indexOf("/") !== -1) {
		return array.indexOf("/");
	} else if (array.indexOf("+") !== -1) {
		return array.indexOf("+");
	} else if (array.indexOf("-") !== -1) {
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
		default:
			console.log("Error operating on two args");
	}
}

// Listen
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
