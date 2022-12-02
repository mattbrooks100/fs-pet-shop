import express from "express";
import { readFile, writeFile } from "fs/promises";
const app = express();
const PORT = process.env.PORT || 3000;

// Parse the HTTP request body
app.use(express.json());

// GET all pets
app.get("/pets", (req, res) => {
  readFile("./pets.json", "utf-8").then((data) => {
    res.json(JSON.parse(data));
  });
});

// GET a single pet
app.get("/pets/:id", (req, res) => {
  const petIndex = req.params.id;
  readFile("./pets.json", "utf-8").then((data) => {
    const petsArray = JSON.parse(data);
    if (petIndex < 0 || petIndex > petsArray.length - 1) {
      res.status(404).set("Content-Type", "text/plain").send("Not Found");
    } else {
      const pet = petsArray[petIndex];
      res.json(pet);
    }
  });
});

// Catch all for errors
// app.use((err, req, res, next) => {
//   res.status(404).send("Not Found");
// });

app.listen(PORT, () => console.log(`Server started on ports ${PORT}`));
