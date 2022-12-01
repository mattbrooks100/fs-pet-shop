import http, { request } from "http";
import { readFile, writeFile } from "fs/promises";
const petRegExp = /^\/pets\/(\d+)$/;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  if (method === "GET" && url === "/pets") {
    readFile("./pets.json", "utf-8").then((text) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(text);
    });
  } else if (method === "GET" && petRegExp.test(url)) {
    const matches = petRegExp.exec(url);
    const petIndex = matches[1];
    readFile("./pets.json", "utf-8").then((text) => {
      const animals = JSON.parse(text);
      if (petIndex > animals.length - 1) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found");
      } else {
        const animalJSON = JSON.stringify(animals[petIndex]);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(animalJSON);
      }
    });
  } else if (method === "POST" && url === "/pets") {
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        const parsedBody = JSON.parse(body);
        if (
          parsedBody.age === undefined ||
          parsedBody.name === undefined ||
          parsedBody.kind === undefined ||
          !Number.isInteger(parsedBody.age)
        ) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "text/plain");
          res.end("Bad Request");
        } else {
          const ageInt = parseInt(parsedBody.age);
          parsedBody.age = ageInt;
          readFile("./pets.json", "utf-8")
            .then((text) => {
              const animals = JSON.parse(text);
              animals[animals.length] = parsedBody;
              const animalsJSON = JSON.stringify(animals);
              writeFile("./pets.json", animalsJSON);
            })
            .then(() => {
              res.setHeader("Content-Type", "application/json");
              res.end("Pet added!");
            });
        }
      });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
