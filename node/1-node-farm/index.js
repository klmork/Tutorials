const fs = require("fs");
const http = require("http");

// Server + simple routing
const server = http.createServer((req, res) => {
  const pathName = req.url;
  console.log("pathName: ", pathName);
  switch (pathName) {
    case "/":
    case "/overview":
      res.end("this is the OVERVIEW");
      break;
    case "/product":
      res.end("this is the PRODUCT");
      break;
    default:
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>404: Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
