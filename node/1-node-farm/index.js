const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const fillInProduct = require("./modules/replaceTemplate");

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

const slugs = new Map(
  productData.map((product, index) => {
    const slug = slugify(product.productName, { lower: true });
    return [slug, index];
  })
);
// Server + simple routing
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);
  const productRegex = new RegExp("/product/([a-zA-Z-_]+)/?$");

  if (pathname === "/" || pathname === "/overview") {
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
  } else if (productRegex.test(pathname)) {
    const slug = productRegex.exec(pathname)[1];
    const id = slugs.get(slug);
    if (id !== undefined) {
      res.writeHead(200, { "content-type": "text/html" });
      const productHMLT = fillInProduct(templateProduct, productData[id]);
      res.end(productHMLT);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>404: Product not found</h1>");
    }
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(productJson);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>404: Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
