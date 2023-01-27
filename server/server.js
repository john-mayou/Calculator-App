// Boilerplate
const express = require("express");
const app = express();
// app.use === 'middleware'
app.use(express.static("server/public"));
// body parser
app.use(express.urlencoded({ extended: true }));

// Listen
const PORT = 5000;
app.listen(PORT, () => {
	console.log("Port Listening", PORT);
});
