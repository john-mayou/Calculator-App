$(document).ready(onReady);

let expressionList = [];
let currentAnswer;

function onReady() {
	render();
	$("#--equals-btn").on("click", handleEqualsSubmitButton);
	$("#--clear-btn").on("click", handleClearInput);
	$("#calculator-btn__box").on(
		"click",
		".calc-btn:not(#--equals-btn)",
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
	// testing if the input is valid

	// if valid, break it up into parts
	let mathPartsRegex = /[0-9]+(\.[0-9]+)?|[+\-*\/]/g;
	let expressionParts = $("#expression-input").val().match(mathPartsRegex);

	$.ajax({
		url: "/expressions",
		method: "POST",
		data: { parts: expressionParts },
	}).then((response) => {
		fetchMathExpressions();
	});
}

function handleClearInput() {
	$("#expression-input").val("");
}

function fetchMathExpressions() {
	$.ajax({
		url: "/expressions",
		method: "GET",
	}).then((response) => {
		expressionList = response;
		currentAnswer = response[response.length - 1].answer;
		render();
	});
}

function render() {
	$("#prev-answers__list").empty();
	for (let statement of expressionList) {
		$("#prev-answers__list").append(`
            <li>
                ${statement.expressionParts.join(" ")} = ${statement.answer}
            </li>
        `);
	}
}
