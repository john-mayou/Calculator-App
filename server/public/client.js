$(document).ready(onReady);

let calculationsArray = [];

/**
 * Fetches server state on load, holds event listeners
 */
function onReady() {
	fetchMathExpressions();

	$("#--equals-btn").on("click", handleEqualsSubmitButton);
	$("#--clear-btn").on("click", handleClearInput);
	$("#calculator-btn__box").on(
		"click",
		"button:not(#--equals-btn, #--clear-btn)",
		handleAddValueToInputField
	);
	$("#history-clear-btn").on("click", handleClearHistory);
}

/**
 * Finds value of the button click, adds it to the calulator display
 */
function handleAddValueToInputField() {
	let idOfbuttonPressed = $(this).attr("id");
	let buttonValue = $(`#${idOfbuttonPressed}`).text();
	let currentExpression = $("#expression-input").val();
	$("#expression-input").val(currentExpression + buttonValue);
}

/**
 * Sends the server the expression string, re-renders when done
 */
function handleEqualsSubmitButton() {
	$.ajax({
		url: "/expressions",
		method: "POST",
		data: { expressionStr: $("#expression-input").val() },
	})
		.then(() => {
			fetchMathExpressions();
		})
		.catch((error) => {
			console.error("/expressions POST Error", error);
			alert("Invalid Input");
		});
}

/**
 * Fetches the math expressions from the server, then sets local state with the response, re-renders
 */
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

/**
 * Resets calculator display
 */
function handleClearInput() {
	$("#expression-input").val("");
	$("#current-answer__header").text("");
}

/**
 * Sends a request to the server to clear the data, re-renders the DOM with an empty state
 */
function handleClearHistory() {
	$.ajax({
		url: "/delete-expressions",
		method: "DELETE",
	})
		.then((response) => {
			calculationsArray = response;
			render();
		})
		.catch((error) => {
			console.error("/delete-expression DELETE Error", error);
		});
}

/**
 * Clears the expression history table, re-renders with the expressionsArray local state
 */
function render() {
	$("#prev-answers__tbody").empty();
	for (let calculation of calculationsArray) {
		$("#prev-answers__tbody").append(`
		<tr>
            <td class='expression-td'>${calculation.expressionArray.join(
				" "
			)}</td>
			<td class='equals-td'>=</td>
			<td class='answer-td'>${calculation.answer}</td>
		</tr>
        `);
	}

	$("#current-answer__header").text(
		`${calculationsArray[calculationsArray.length - 1].answer}` // grabs the answer from the last calculation of the array
	);
}
