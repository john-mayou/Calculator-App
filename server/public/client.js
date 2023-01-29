$(document).ready(onReady);

let calculationsArray = [];

function onReady() {
	$("#--equals-btn").on("click", handleEqualsSubmitButton);
	$("#--clear-btn").on("click", handleClearInput);
	$("#calculator-btn__box").on(
		"click",
		"button:not(#--equals-btn, #--clear-btn)",
		handleAddValueToInputField
	);
	$("#history-clear-btn").on("click", handleClearHistory);
}

// helper function for adding button value to input field
function handleAddValueToInputField() {
	let idOfbuttonPressed = $(this).attr("id");
	let buttonValue = $(`#${idOfbuttonPressed}`).text();
	let currentExpression = $("#expression-input").val();
	$("#expression-input").val(currentExpression + buttonValue);
}

function handleEqualsSubmitButton() {
	$.ajax({
		url: "/expressions",
		method: "POST",
		data: { expressionStr: $("#expression-input").val() },
	})
		.then((response) => {
			fetchMathExpressions();
		})
		.catch((error) => {
			console.error("/expressions POST Error", error);
		});
}

function fetchMathExpressions() {
	$.ajax({
		url: "/expressions",
		method: "GET",
	})
		.then((response) => {
			calculationsArray = response;
			render();
		})
		.catch((error) => {
			console.error("/expression GET Error", error);
		});
}

function handleClearInput() {
	$("#expression-input").val("");
}

function handleClearHistory() {
	$.ajax({
		url: "/delete-expressions",
		method: "DELETE",
	})
		.then((response) => {
			calculations = response;
			render();
		})
		.catch((error) => {
			console.error("/delete-expression DELETE Error", error);
		});
}

function render() {
	$("#prev-answers__list").empty();
	for (let calculation of calculationsArray) {
		$("#prev-answers__list").append(`
            <li>
				<span>${calculation.expressionArray.join(" ")}</span>
                <span>=</span>
				<span>${calculation.answer}</span>
            </li>
        `);
	}

	$("#current-answer__header").text(
		`${calculationsArray[calculationsArray.length - 1].answer}`
	);
}
