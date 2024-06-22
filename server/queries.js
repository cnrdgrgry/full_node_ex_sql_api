const pool = require("./db");

const getPastries = async (request, response) => {
	try {
		const results = await pool.query("SELECT * FROM pastries ORDER BY id ASC");
		response.status(200).json(results.rows);
	} catch (error) {
		console.error(error);
		response.status(500).send("Server Error");
	}
};

const getPastryById = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		const results = await pool.query("SELECT * FROM pastries WHERE id = $1", [
			id,
		]);
		response.status(200).json(results.rows);
	} catch (error) {
		console.error(error);
		response
			.status(500)
			.send("Server Error: We have sold out of your pastry today.");
	}
};

const createPastry = async (request, response) => {
	const { name, primaryFlavour, countryOfOrigin, price } = request.body;

	try {
		const results = await pool.query(
			"INSERT INTO pastries (name, primary_flavour, country_of_origin, price) VALUES ($1, $2, $3, $4)",
			[name, primaryFlavour, countryOfOrigin, price]
		);
		response.status(201).send(`Pastry added successfully`);
	} catch (error) {
		console.error(error);
		response
			.status(500)
			.send("Server Error: We didn't bake your pastry today.");
	}
};

const updatePastry = async (request, response) => {
	const id = parseInt(request.params.id);
	const { name, primaryFlavour, countryOfOrigin, price } = request.body;

	try {
		await pool.query(
			"UPDATE pastries SET name = $1, primary_flavour = $2, country_of_origin = $3, price = $4 WHERE id = $5",
			[name, primaryFlavour, countryOfOrigin, price, id]
		);
		response.status(200).send(`Pastry modified with ID: ${id}`);
	} catch (error) {
		console.error(error);
		response.status(500).send("Server Error");
	}
};

const deletePastry = async (request, response) => {
	const id = parseInt(request.params.id);

	try {
		await pool.query("DELETE FROM pastries WHERE id = $1", [id]);
		response.status(200).send(`Pastry deleted with ID: ${id}`);
	} catch (error) {
		console.error(error);
		response.status(500).send("Server Error");
	}
};

module.exports = {
	getPastries,
	getPastryById,
	createPastry,
	updatePastry,
	deletePastry,
};
