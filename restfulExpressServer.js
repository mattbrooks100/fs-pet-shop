//========================== SETUP ==========================//
// Import dependencies
import express from "express";
import { readFile, writeFile } from "fs/promises";
import morgan from "morgan";
import postgres from "postgres";
// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;
// Parse the HTTP request body
app.use(express.json());
// Morgan middleware logs each HTTP request
app.use(morgan("tiny"));
// Connect to "petshop" database
const sql = postgres({ database: "petshop" });
//===========================================================//

//========================== ROUTES =========================//
// GET - read all pets
app.get("/pets", (req, res, next) => {
  sql`SELECT * FROM pets`
    .then((text) => {
      res.send(text);
    })
    .catch(next);
});

// GET - read a single pet
app.get("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  sql`SELECT * FROM pets WHERE id = ${id}`
    .then((result) => {
      if (result.length === 0) {
        res.status(404).set("Content-Type", "text/plain").send("Not Found: id out of bounds");
      } else {
        res.json(result[0]);
      }
    })
    .catch(next);
});

// POST - create a new pet
app.post("/pets", (req, res, next) => {
  const { age, name, kind } = req.body;
  if (!Number.isInteger(age) || !age || !kind || !name) {
    res.status(404).set("Content-Type", "text/plain").send("Bad Request");
  } else {
    sql`INSERT INTO pets (age, name, kind) VALUES (${age}, ${name}, ${kind}) RETURNING *`
      .then((result) => {
        res.status(201).json(result[0]);
      })
      .catch(next);
  }
});

// PATCH - update an existing pet's info
app.patch("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  const { age, name, kind } = req.body;
  // Update age if it is defined and an integer
  if (Number.isInteger(age)) {
    sql`UPDATE pets SET age = ${age} WHERE id = ${id} RETURNING *`
      .then((result) => {
        if (result.length === 0) {
          res.status(404).set("Content-Type", "text/plain").send("Not Found: id out of bounds");
        } else {
          res.status(201).json(result[0]);
        }
      })
      .catch(next);
    // Update name if it's a string
  } else if (typeof name === "string") {
    sql`UPDATE pets SET name = ${name} WHERE id = ${id} RETURNING *`
      .then((result) => {
        if (result.length === 0) {
          res.status(404).set("Content-Type", "text/plain").send("Not Found: id out of bounds");
        } else {
          res.status(201).json(result[0]);
        }
      })
      .catch(next);
    // Update kind if it's a string
  } else if (typeof kind === "string") {
    sql`UPDATE pets SET kind = ${kind} WHERE id = ${id} RETURNING *`
      .then((result) => {
        if (result.length === 0) {
          res.status(404).set("Content-Type", "text/plain").send("Not Found: id out of bounds");
        } else {
          res.status(201).json(result[0]);
        }
      })
      .catch(next);
  }
});

// DELETE - removes a pet
app.delete("/pets/:id", (req, res, next) => {
  const { id } = req.params;
  sql`DELETE FROM pets WHERE id = ${id} RETURNING *`
    .then((result) => {
      if (result.length === 0) {
        res.status(404).set("Content-Type", "text/plain").send("Not Found: id out of bounds");
      } else {
        res.status(200).json(result[0]);
      }
    })
    .catch(next);
});

//===========================================================//

//====================== ERROR HANDLING =====================//
// Handle internal server errors
app.use((err, req, res, next) => {
  res.status(500).set("Content-Type", "text/plain").send("Internal Server Error");
});

// Catch all for client errors
app.use((req, res) => {
  res.status(404).set("Content-Type", "text/plain").send("Not Found");
});
//===========================================================//

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
