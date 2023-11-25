import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const checkOrInitialiseThenReturnDatabase = async () => {
	try {
		const databaseClient = await open({
			driver: sqlite3.Database,
			filename: "server/database/bookDbFile.db",
		});
		const tablesToCheck = ["books", "genres", "authors"];

		for (const tableName of tablesToCheck) {
			const tableExists = await databaseClient.get(
				`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
				[tableName]
			);
			if (!tableExists) {
				console.log(
					`Table ${tableName} does not exist. Creating the table now`
				);
				let createTableQuery = "";
				if (tableName === "books") {
					createTableQuery = `
                    CREATE TABLE books (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        genre_id INTEGER,
                        author_id INTEGER,
                        summary TEXT,
                        published_year INTEGER NOT NULL,
                        FOREIGN KEY (genre_id) REFERENCES genres (id),
                        FOREIGN KEY (author_id) REFERENCES authors (id)
                    );
                `;
				} else if (tableName === "genres") {
					createTableQuery = `
                    CREATE TABLE genres (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    );
                `;
				} else if (tableName === "authors") {
					createTableQuery = `
                    CREATE TABLE authors (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        first_name TEXT NOT NULL,
                        last_name TEXT NOT NULL
                    );
                `;
				}
				await databaseClient.exec(createTableQuery);
			} else {
				console.log(`Table ${tableName} exists. Checking the next table.`);
			}
		}

		return databaseClient;
	} catch (error) {
		throw new Error("Connecting to database failed.", error);
	}
};
