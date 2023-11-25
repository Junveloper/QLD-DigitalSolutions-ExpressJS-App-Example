import express from "express";
import { checkOrInitialiseThenReturnDatabase } from "./databaseChecker.js";
import path from "path";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/*
   The below function is from databaseChecker.js
   If the database file does not have the tables we need, it will create them.
   You can find CREATE statement in there.
   Your student may have used db client and could create tables directly from there (tablePlus, HediSQL, DB Browser for SQLite, etc.)
*/

const db = await checkOrInitialiseThenReturnDatabase();

// Backend Routes start from the below.
// Run npm install on the project folder to install the dependencies.
// Run npm run start to start the server.
app.get("/", async (req, res) => {
	const genres = await db.all("SELECT * FROM Genres");
	const authors = await db.all("SELECT * FROM Authors");
	const books = await db.all(`
   SELECT Books.*, 
      Genres.name AS genre_name, 
      Authors.first_name AS author_first_name, 
      Authors.last_name AS author_last_name
   FROM Books
   INNER JOIN Genres ON Books.genre_id = Genres.id
   INNER JOIN Authors ON Books.author_id = Authors.id
 `);

	// console.log(books);

	res.render("index", { genres, authors, books });
});

app.post("/create/book", async (req, res) => {
	try {
		const { title, genre, author, published_year, summary } = req.body;
		await db.run(
			`INSERT INTO Books (title, genre_id, author_id, published_year, summary) VALUES (?, ?, ?, ?, ?)`,
			[title, genre, author, published_year, summary]
		);
		res.redirect("/");
	} catch (error) {
		// console.error(error);
		res.status(500).send("An error occurred while creating the book");
	}
});

app.post("/delete/book/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await db.run("DELETE FROM Books WHERE id = ?", [id]);
		res.redirect("/");
	} catch (error) {
		// console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/genre", async (req, res) => {
	const genres = await db.all("SELECT * FROM Genres");
	res.render("genre", { genres });
});

app.post("/create/genre", async (req, res) => {
	const { name } = req.body;
	if (!name) {
		return res.status(400).send("Genre name is required");
	}
	try {
		await db.run("INSERT INTO Genres (Name) VALUES (?)", [name]);
		res.redirect("/genre");
	} catch (error) {
		// console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/delete/genre/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await db.run("DELETE FROM Genres WHERE id = ?", [id]);
		res.redirect("/genre");
	} catch (error) {
		// console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/author", async (req, res) => {
	const authors = await db.all("SELECT * FROM Authors");
	res.render("author", { authors });
});

app.post("/create/author", async (req, res) => {
	const { first_name, last_name } = req.body;
	if (!first_name || !last_name) {
		return res.status(400).send("Author name is required");
	}
	try {
		await db.run(
			"INSERT INTO Authors (first_name, last_name) VALUES (?, ?)",
			[first_name, last_name]
		);
		res.redirect("/author");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.post("/delete/author/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await db.run("DELETE FROM Authors WHERE id = ?", [id]);
		res.redirect("/author");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(port, () => {
	console.log(`Book app listening on port ${port}`);
});
