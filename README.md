# ExpressJS SQLite Boiler Template

This example is built to show how ExpressJS can be used to teach QLD SATE Digital Solutions. 

PHP is a great option and widely used language with popular frameworks like Laravel or Symfony in the industry. But, teaching PHP only to create and interact with the backend is an unnecessary overhead for students.

If students already have a prior knowledge on Javascript, sticking with Javascript, by using ExpressJS, for the backend can be an excellent way to remove that overhead. ExpressJS is also a very popular framework in the web development space and up-to-date technology stack.


## Node Packages installed on this repository

- Express
- EJS (HTML templating engine for Express)
- SQLite (SQLite Client for Node.JS Apps)
- SQLite3 (Asynchronous SQLite3 bindings)
- nodemon (Development tool that automatically restarts the node application when changes are made)

If you want to use mySQL instead of SQLite, I recommend mysql2 package (https://www.npmjs.com/package/mysql2)

## What this app does

It has a very simple application that allows the user to interact with Books database with three tables (books, genres, authors).


## Getting Started

You must have NodeJS (https://nodejs.org/en/) installed on your machine

1. Clone the repository or extract the ZIP file as a folder.
2. Inside of the terminal or command prompt - while in the folder - run the below command. (Use your IDE (such as VSCode) terminal which will ensure you are in the folder)

npm install

3. Run the node application

npm run start

4. Open your browser and navigate to http://localhost:3000 to view the app