const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS
app.use(cors());

// Middleware for parsing req.body
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to render index.html
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Import and mount the pastryRouter at the '/pastrypicker' path.
const pastryRouter = require("./server/pastryPicker");
app.use("/pastrypicker", pastryRouter);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
