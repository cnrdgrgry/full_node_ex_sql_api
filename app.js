const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5001;

//CORS - Not necessarily required without a gui landing page, but stll putting in as best practice
app.use(cors());

// Middleware for parsing req.body
app.use(express.json());

// Import and mount the pastryRouter at the '/pastrypicker' path.
const pastryRouter = require("./server/pastryPicker");
app.use("/pastrypicker", pastryRouter);

app.get("/", (request, response) => {
	response.json({
		info: "Node.js, Express, and Postgres API. Please visit /pastrypicker for more choice!",
	});
});

//Start the server, listening.
app.listen(PORT, () => {
	console.log(`Cors enabled Expess server is listening on port ${PORT}`);
});

module.exports = app;
