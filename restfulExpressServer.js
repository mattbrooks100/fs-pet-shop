//========================== SETUP ==========================//
// Import dependencies
import express from "express";
import { readFile, writeFile } from "fs/promises";
import morgan from "morgan";
// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;
// Parse the HTTP request body
app.use(express.json());
// Morgan middleware logs each HTTP request
app.use(morgan("tiny"));
//===========================================================//

//========================== ROUTES =========================//
// GET - read all pets
app.get("/pets", (req, res, next) => {
  readFile("./pets.json", "utf-8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
});

// GET - read a single pet
app.get("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  readFile("./pets.json", "utf-8")
    .then((data) => {
      const petsArray = JSON.parse(data);
      if (id < 0 || id > petsArray.length - 1) {
        res.status(404).set("Content-Type", "text/plain").send("Not Found");
      } else {
        const pet = petsArray[id];
        res.json(pet);
      }
    })
    .catch((err) => {
      next(err);
    });
});

// POST - create a new pet
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
        res.status(201).set("Content-Type", "application/json").send(newPet);
      })
      .catch((err) => {
        next(err);
      });
  }
});

// PATCH - update an existing pet's info
app.patch("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  const update = req.body;
  readFile("./pets.json", "utf-8").then((data) => {
    const petsArray = JSON.parse(data);
    const existingPet = petsArray[id];
    for (let key in update) {
      if (existingPet.hasOwnProperty(key)) {
        // if age is not an integer or name/kind is not a string, send error code
        if (
          (key === "age" && !Number.isInteger(update[key])) ||
          (key !== "age" && typeof update[key] !== "string")
        ) {
          res.status(400).set("Content-Type", "text/plain").send("Bad Request");
          // if age is an integer and name/kind are strings (everything is good), update the existing pet with the new info
        } else {
          existingPet[key] = update[key];
        }
        // if the key in update is not age/kind/name, send error code
      } else {
        res.status(400).set("Content-Type", "text/plain").send("Bad Request");
      }
    }
    return writeFile("./pets.json", JSON.stringify(petsArray)).then(() => {
      res.status(200).set("Content-Type", "application/json").send(existingPet);
    });
  });
});

// DELETE - removes a pet
app.delete("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  readFile("./pets.json", "utf-8").then((data) => {
    const petsArray = JSON.parse(data);
    const existingPet = petsArray[id];
    petsArray.splice(id, 1);
    return writeFile("./pets.json", JSON.stringify(petsArray)).then(() => {
      res.status(200).set("Content-Type", "application/json").send(existingPet);
    });
  });
});

//===========================================================//

//====================== ERROR HANDLING =====================//
// Handle internal server errors
app.use((err, req, res, next) => {
  res.status(500).set("Content-Type", "text/plain").send("Internal Server Error");
});

// Catch all for errors
app.use((req, res) => {
  res.status(404).set("Content-Type", "text/plain").send("Not Found");
});
//===========================================================//

// Start the server
app.listen(PORT, () => console.log(`Server started on ports ${PORT}`));
