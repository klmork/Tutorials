const fs = require("fs");
const http = require("http");

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const productJson = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(productJson);

// Server + simple routing
const server = http.createServer((req, res) => {
  const pathName = req.url;
  console.log("pathName: ", pathName);
  switch (pathName) {
    case "/":
    case "/overview":
      res.writeHead(200, { "content-type": "text/html" });
      const overviewHTML = templateOverview.replace(
        /{%PRODUCTCARDS%}/g,
        templateCard
      );
      res.end(overviewHTML);
      break;
    case "/product":
      res.writeHead(200, { "content-type": "text/html" });
      res.end(templateProduct);
      break;
    case "/api":
      console.log(productData);
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(productJson);
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
