const path = require("path");
require("dotenv").config();

module.exports = {
  storage: process.env.DB_PATH || path.resolve(__dirname, "../../database.sqlite"),
};
