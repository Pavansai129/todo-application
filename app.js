const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

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

function hasTodo(requestQuery) {
  return requestQuery.todo != undefined;
}

let getTodosQuery = "";

let updateDatabaseQuery = "";

`
API 1
API to GET list of all todo's whose status is 'TO DO'
`;
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;
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

`API 2: To get specific todo with todoId`;
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getSpecificTodosQuery = `
        SELECT
            * 
        FROM 
            todo
        WHERE 
            id = ${todoId};
    `;
  const todosWithStatusToDo = await db.get(getSpecificTodosQuery);
  response.send(todosWithStatusToDo);
});

//API 3: to post the data to the database
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postTodosQuery = `
  INSERT INTO
      todo (id, todo, priority, status)
  VALUES
      (${id}, "${todo}", "${priority}", "${status}");
  `;
  await db.run(postTodosQuery);
  response.send("Todo Successfully Added");
});

// API 4 update the data in the database
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo, priority, status } = request.body;
  switch (true) {
    case hasPriority(request.body):
      updateDatabaseQuery = `
        UPDATE
          todo
        SET 
          priority = "${priority}"
        WHERE
          id = ${todoId};
        `;
      await db.run(updateDatabaseQuery);
      response.send("Priority Updated");
      break;
    case hasStatus(request.body):
      updateDatabaseQuery = `
        UPDATE
          todo
        SET 
          status = "${status}"
        WHERE
          id = ${todoId};
        `;
      await db.run(updateDatabaseQuery);
      response.send("Status Updated");
      break;
    case hasTodo(request.body):
      updateDatabaseQuery = `
        UPDATE
          todo
        SET 
          todo = "${todo}"
        WHERE
          id = ${todoId};
        `;
      await db.run(updateDatabaseQuery);
      response.send("Todo Updated");
      break;
  }
});

//API 5 to delete data in database with specific Id
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteDataQuery = `
    DELETE FROM 
      todo
    WHERE 
      id = ${todoId};
    `;
  await db.run(deleteDataQuery);
  response.send("Todo Deleted");
});

module.exports = app;
