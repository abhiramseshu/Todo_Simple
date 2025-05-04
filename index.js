const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    var index = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) res.status(404).send();
    else res.json(todos[index]);
  });
});

app.post("/todos", (req, res) => {
  let obj = {
    id: Math.floor(Math.random() * 100000),
    title: req.body.title,
    description: req.body.description,
  };
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    todos.push(obj);
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(obj);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) res.status(404).send();
    else {
      const updatedTodo = {
        id: todos[index].id,
        title: req.body.title,
        description: req.body.description,
      };
      todos[index] = updatedTodo;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).json(updatedTodo);
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) {
      res.status(404).send();
    } else {
      todos.splice(index, 1);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});

// module.exports = app;
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.listen(3000, () => {
  console.log("server has started succesfully");
});
