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

function hasPriorityAndStatus(requestQuery) {
  return requestQuery.priority != undefined && requestQuery.status != undefined;
}

function hasPriority(requestQuery) {
  return requestQuery.priority != undefined;
}

function hasStatus(requestQuery) {
  return requestQuery.status != undefined;
}

`
API 1
API to GET list of all todo's whose status is 'TO DO'
`;
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;
  let getTodosQuery = "";
  switch (true) {
    case hasPriorityAndStatus(request.query):
      getTodosQuery = `
        SELECT
            *
        FROM 
            todo
        WHERE
            todo LIKE "%${search_q}%"
            AND priority LIKE "${priority}"
            AND status LIKE "${status}";
        `;
      break;
    case hasPriority(request.query):
      getTodosQuery = `
        SELECT
            *
        FROM 
            todo
        WHERE
            todo LIKE "%${search_q}%"
            AND priority LIKE "${priority}";
        `;
      break;
    case hasStatus(request.query):
      getTodosQuery = `
        SELECT
            *
        FROM 
            todo
        WHERE
            todo LIKE "%${search_q}%"
            AND status LIKE "${status}";
        `;
      break;
    default:
      getTodosQuery = `
        SELECT
            *
        FROM 
            todo
        WHERE
            todo LIKE "%${search_q}%";
        `;
      break;
  }

  const todosWithStatusToDo = await db.all(getTodosQuery);
  response.send(todosWithStatusToDo);
});
