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
	const expressionParts = req.body.parts;
	const answer = Number(expressionParts[0]) + Number(expressionParts[2]);

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

// Listen
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
