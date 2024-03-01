const app = require("./app");

const http = require("http");

const server = http.createServer(app);

const port = 8000;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
