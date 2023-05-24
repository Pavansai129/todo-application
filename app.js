const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

`
API 1
API to GET list of all todo's whose status is 'TO DO'
`;
app.get("/todos/", async (request, response) => {
  const { search_q = "TO DO" } = request.query;
  const todosWithStatusToDoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        status LIKE "${search_q}";
    `;
  const todosWithStatusToDo = await db.all(todosWithStatusToDoQuery);
  response.send(todosWithStatusToDo);
});
