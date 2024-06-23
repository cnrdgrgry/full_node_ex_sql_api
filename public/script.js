//NB I claim little credit for most the script on this page; there is heavy GPT influence. I just wanted something working in a rush, didn't want to bother with a full separate REACT app at this stage.

document.addEventListener("DOMContentLoaded", function () {
	const pastryList = document.getElementById("pastry-list");
	const form = document.getElementById("add-pastry-form");
	const submitButton = document.querySelector("#add-pastry-form button");

	// Fetch and display all pastries
	async function fetchAndDisplayPastries() {
		try {
			const response = await fetch(
				"http://localhost:5001/pastrypicker/pastries"
			);
			if (!response.ok) {
				throw new Error("Error fetching pastries");
			}
			const pastries = await response.json();
			// This is clearing existing list - if there is one (i.e. on refresh).
			pastryList.innerHTML = "";
			// This is listing the pastries and rendering with displayPastry
			pastries.forEach((pastry) => {
				displayPastry(pastry);
			});
		} catch (error) {
			console.error("Error fetching pastries:", error);
		}
	}

	// Function to create display for individual pastry item during the above listing function
	function displayPastry(pastry) {
		const listItem = document.createElement("li");
		listItem.id = `pastry-${pastry.id}`;
		listItem.innerHTML = `ID: ${pastry.id} - ${pastry.name} - ${
			pastry.primary_flavour
		} - £${pastry.price.toFixed(2)}
      <button class="edit-button" data-id="${pastry.id}">Edit</button>
      <button class="delete-button" data-id="${pastry.id}">Delete</button>`;
		pastryList.appendChild(listItem);
	}

	// Initial fetch and display pastries
	fetchAndDisplayPastries();

	// Handling the form submission to add/edit a pastry
	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const name = document.getElementById("name").value;
		const primaryFlavour = document.getElementById("primaryFlavour").value;
		const countryOfOrigin = document.getElementById("countryOfOrigin").value;
		const price = document.getElementById("price").value;

		try {
			let response;
			let pastryId = form.dataset.pastryId;

			if (!pastryId) {
				// Adding a new pastry
				response = await fetch("http://localhost:5001/pastrypicker/pastries", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						primaryFlavour,
						countryOfOrigin,
						price,
					}),
				});
			} else {
				// Editing an existing pastry
				response = await fetch(
					`http://localhost:5001/pastrypicker/pastries/${pastryId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name,
							primaryFlavour,
							countryOfOrigin,
							price,
						}),
					}
				);

				// Reset the form state after editing - basically changing the button text content
				form.removeAttribute("data-pastry-id");
				submitButton.textContent = "Add Pastry";
			}

			if (!response.ok) {
				throw new Error("Error adding or editing pastry");
			}

			const pastry = await response.json();

			if (!pastryId) {
				// Add new pastry to the list
				displayPastry(pastry);
			} else {
				// Update existing pastry in the list
				const listItem = document.getElementById(`pastry-${pastry.id}`);
				listItem.innerHTML = `ID: ${pastry.id} - ${pastry.name} - ${
					pastry.primary_flavour
				} - £${pastry.price.toFixed(2)}
          <button class="edit-button" data-id="${pastry.id}">Edit</button>
          <button class="delete-button" data-id="${pastry.id}">Delete</button>`;
			}

			form.reset(); // Reset form fields after submission

			// Fetch and display updated list of pastries after successful operation
			fetchAndDisplayPastries();
		} catch (error) {
			console.error("Error adding or editing pastry:", error);
		}
	});

	// Event listener for delete and edit buttons
	pastryList.addEventListener("click", async function (event) {
		if (event.target.classList.contains("delete-button")) {
			const pastryId = event.target.dataset.id;

			try {
				const response = await fetch(
					`http://localhost:5001/pastrypicker/pastries/${pastryId}`,
					{
						method: "DELETE",
					}
				);

				if (!response.ok) {
					throw new Error("Failed to delete pastry.");
				}

				// Remove the deleted pastry from the DOM
				document.getElementById(`pastry-${pastryId}`).remove();

				// Fetch and display updated list of pastries after successful operation
				fetchAndDisplayPastries();
			} catch (error) {
				console.error("Error deleting pastry:", error);
			}
		} else if (event.target.classList.contains("edit-button")) {
			const pastryId = event.target.dataset.id;

			try {
				const response = await fetch(
					`http://localhost:5001/pastrypicker/pastries/${pastryId}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch pastry details for editing.");
				}

				const pastry = await response.json();

				// Populate form with existing pastry details for editing
				document.getElementById("name").value = pastry.name;
				document.getElementById("primaryFlavour").value =
					pastry.primary_flavour;
				document.getElementById("countryOfOrigin").value =
					pastry.country_of_origin;
				document.getElementById("price").value = pastry.price;

				// Change submit button text to "Edit"
				submitButton.textContent = "Edit Pastry";

				// Store the pastry ID in form dataset attribute
				form.dataset.pastryId = pastryId;
			} catch (error) {
				console.error("Error fetching pastry details:", error);
			}
		}
	});
});
