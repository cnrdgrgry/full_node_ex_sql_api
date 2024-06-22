const express = require("express");
const router = express.Router();

// Requiring database connection
const db = require("./db");

// Defining the routes

// Get all pastries from the database
router.get("/", (req, res) => {
	db.all("SELECT * FROM pastries", (err, rows) => {
		if (err) {
			res
				.status(500)
				.send("Error 500: Internal server error; pastries not found!");
		} else {
			res.status(200).json(rows);
		}
	});
});

// Get a single pastry option by using its id
router.get("/:pastryId", (req, res) => {
	const { pastryId } = req.params;
	db.get("SELECT * FROM pastries WHERE id = ?", [pastryId], (err, row) => {
		if (err) {
			res.status(500).send("Error 500: Internal server error!");
		} else if (!row) {
			res
				.status(404)
				.send("Error 404: That particular baked good has not been found");
		} else {
			res.status(200).json(row);
		}
	});
});

// Create a new pastry for the database
router.post("/", (req, res) => {
	const { name, primaryFlavour, countryOfOrigin, price } = req.body;

	if (!name || !primaryFlavour || !countryOfOrigin || !price) {
		return res
			.status(400)
			.send(
				"Error 400: Pastry name, flavour, country of origin and price are all required!"
			);
	}

	// Check if the pastry with the same name already exists
	const checkSql = "SELECT * FROM pastries WHERE name = ?";
	db.get(checkSql, [name], (err, row) => {
		if (err) {
			res.status(500).send("Error 500: Internal server error!");
		} else if (row) {
			// If a pastry with the same name exists, return a 409 Conflict status
			res.status(409).send("Error 409: Pastry with this name already exists!");
		} else {
			// If no pastry with the same name exists, proceed to insert
			const insertSql =
				"INSERT INTO pastries (name, primary_flavour, country_of_origin, price) VALUES (?, ?, ?, ?)";
			db.run(
				insertSql,
				[name, primaryFlavour, countryOfOrigin, price],
				function (err) {
					if (err) {
						res.status(500).send("Error 500: Error baking pastry!");
					} else {
						const id = this.lastID;
						res
							.status(201)
							.json({ id, name, primaryFlavour, countryOfOrigin, price });
					}
				}
			);
		}
	});
});

// Update a single pastry by ID
router.put("/:pastryId", (req, res) => {
	const { pastryId } = req.params;
	const { name, primaryFlavour, countryOfOrigin, price } = req.body;

	if (!name || !primaryFlavour || !countryOfOrigin || !price) {
		return res
			.status(400)
			.send(
				"Error 400: Pastry name, flavour, country of origin and price are all required!"
			);
	} else {
		const sql =
			"UPDATE pastries SET name = ?, primary_flavour = ?, country_of_origin = ?, price = ? WHERE id = ?";
		db.run(
			sql,
			[name, primaryFlavour, countryOfOrigin, price, pastryId],
			function (err) {
				if (err) {
					res.status(500).send("Error 500: Internal server error!");
				} else if (this.changes === 0) {
					res
						.status(404)
						.send("Error 404: That particular baked good has not been found");
				} else {
					res.status(200).json({
						id: pastryId,
						name,
						primaryFlavour,
						countryOfOrigin,
						price,
					});
				}
			}
		);
	}
});

// Delete a single pastry by its id
router.delete("/:pastryId", (req, res) => {
	const { pastryId } = req.params;
	db.run("DELETE FROM pastries WHERE id = ?", [pastryId], function (err) {
		if (err) {
			res.status(500).send("Error 500: Internal server error");
		} else if (this.changes === 0) {
			res.status(404).send("Error 404: Baked goods not found!");
		} else {
			res.status(204).send();
		}
	});
});

// Exporting the router
module.exports = router;
