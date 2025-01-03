const fs = require("fs");
const http = require("http");
const url = require("url");

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

const fillInProduct = (template, product) => {
  let output = template;
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%LOCATION%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(
    /{%NOTORGANIC%}/g,
    product.organic ? "" : "not-organic"
  );
  return output;
};
const productJson = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(productJson);

// Server + simple routing
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  switch (pathname) {
    case "/":
    case "/overview":
      res.writeHead(200, { "content-type": "text/html" });
      const cardsHTML = productData
        .map((product) => {
          return fillInProduct(templateCard, product);
        })
        .join("");
      const overviewHTML = templateOverview.replace(
        /{%PRODUCTCARDS%}/g,
        cardsHTML
      );
      res.end(overviewHTML);
      break;
    case "/product":
      const id = query?.id;
      if (id && productData[id]) {
        res.writeHead(200, { "content-type": "text/html" });
        const productHMLT = fillInProduct(templateProduct, productData[id]);
        res.end(productHMLT);
      } else {
        res.writeHead(404, {
          "Content-type": "text/html",
        });
        res.end("<h1>404: Product not found</h1>");
      }
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
