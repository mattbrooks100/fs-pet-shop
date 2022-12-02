import express from "express";
import { write } from "fs";
import { readFile, writeFile } from "fs/promises";
const app = express();
const PORT = process.env.PORT || 3000;

// Parse the HTTP request body
app.use(express.json());

// GET all pets
app.get("/pets", (req, res, next) => {
  readFile("./pets.json", "utf-8")
    .then((data) => {
      res.json(JSON.parse(data));
    })
    .catch((err) => {
      next(err);
    });
});

// GET a single pet
app.get("/pets/:id", (req, res, next) => {
  const petIndex = req.params.id;
  readFile("./pets.json", "utf-8")
    .then((data) => {
      const petsArray = JSON.parse(data);
      if (petIndex < 0 || petIndex > petsArray.length - 1) {
        res.status(404).set("Content-Type", "text/plain").send("Not Found");
      } else {
        const pet = petsArray[petIndex];
        res.json(pet);
      }
    })
    .catch((err) => {
      next(err);
    });
});

// POST a pet
app.post("/pets", (req, res, next) => {
  const newPet = req.body;
  if (!Number.isInteger(newPet.age) || !newPet.age || !newPet.kind || !newPet.name) {
    res.status(404).set("Content-Type", "text/plain").send("Bad Request");
  } else {
    readFile("./pets.json", "utf-8")
      .then((data) => {
        const petsArray = JSON.parse(data);
        petsArray.push(newPet);
        writeFile("./pets.json", JSON.stringify(petsArray));
        res.set("Content-Type", "application/json").send(newPet);
      })
      .catch((err) => {
        next(err);
      });
  }
});

// Handle internal server errors
app.use((err, req, res, next) => {
  res.status(500).set("Content-Type", "text/plain").send("Internal Server Error");
});

// Catch all for errors
app.use((req, res) => {
  res.status(404).set("Content-Type", "text/plain").send("Not Found");
});

app.listen(PORT, () => console.log(`Server started on ports ${PORT}`));
