const http = require("http");
require("dotenv").config();
const app = require("./app");
require("./database"); // connects to SQLite and creates tables

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
