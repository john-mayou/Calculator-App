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

	let answer;
	let copyExpressionParts = [...expressionParts];

	// finding answer
	while (copyExpressionParts.length > 1) {
		let indexToSlice =
			findHighestOrderOfOperations(copyExpressionParts) - 1;
		let sliceToEvaluate = copyExpressionParts.slice(
			indexToSlice,
			indexToSlice + 3
		);
		copyExpressionParts.splice(
			indexToSlice,
			3,
			operateOnTwoArgs(sliceToEvaluate)
		);
	}
	// when done evaluating parts
	answer = copyExpressionParts[0];

	console.log("Parts: ", expressionParts);
	console.log("Answer", answer);

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
function findHighestOrderOfOperations(array) {
	if (array.indexOf("*") !== -1) {
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
