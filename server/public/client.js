$(document).ready(onReady);

let expressionList = [];
let currentAnswer;

function onReady() {
	$("#--equals-btn").on("click", handleEqualsSubmitButton);
	$("#--clear-btn").on("click", handleClearInput);
	$("#calculator-btn__box").on(
		"click",
		"button:not(#--equals-btn, #--clear-btn)",
		handleAddValueToInputField
	);
}

// helper function for adding button value to input field
function handleAddValueToInputField() {
	let idOfbuttonPressed = $(this).attr("id");
	let buttonValue = $(`#${idOfbuttonPressed}`).text();
	let currentExpression = $("#expression-input").val();
	$("#expression-input").val(currentExpression + buttonValue);
}

function handleEqualsSubmitButton() {
	// testing if the input is valid: TODO

	// if valid, break it up into parts
	let mathPartsRegex = /[0-9]+(\.[0-9]+)?|[+\-*\/\(\)\^]/g;
	let expressionParts = $("#expression-input").val().match(mathPartsRegex);

	console.log(expressionParts);
	$.ajax({
		url: "/expressions",
		method: "POST",
		data: { parts: expressionParts },
	})
		.then((response) => {
			fetchMathExpressions();
		})
		.catch((error) => {
			console.log("/expressions POST Error", error);
		});
}

function fetchMathExpressions() {
	$.ajax({
		url: "/expressions",
		method: "GET",
	})
		.then((response) => {
			expressionList = response;
			currentAnswer = response[response.length - 1].answer;
			render();
		})
		.catch((error) => {
			console.log("/expression GET Error", error);
		});
}

function handleClearInput() {
	$("#expression-input").val("");
}

function render() {
	$("#prev-answers__list").empty();
	for (let statement of expressionList) {
		$("#prev-answers__list").append(`
            <li>
				<span>${statement.expressionParts.join(" ")}</span>
                <span>=</span>
				<span>${statement.answer}</span>
            </li>
        `);
	}

	$("#current-answer__header").text(
		`${expressionList[expressionList.length - 1].answer}`
	);
}
