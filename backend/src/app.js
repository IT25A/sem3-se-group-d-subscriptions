const express = require("express");
const cors = require("cors");
const usersRouter = require("./modules/users/users.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", usersRouter);

module.exports = app;
