#!/usr/bin/env node

import { readFile, writeFile } from "fs/promises";

const subcommand = process.argv[2];
const petIndex = process.argv[3];

switch (subcommand) {
  case "read":
    readFile("./pets.json", "utf-8").then((text) => {
      const pets = JSON.parse(text);
      if (petIndex === undefined) {
        console.log(pets);
      } else if (petIndex < 0 || petIndex >= pets.length) {
        console.error("Usage: node pets.js read INDEX");
        process.exit(1);
      } else {
        console.log(pets[petIndex]);
      }
    });
    break;
  case "create":
    readFile("./pets.json", "utf-8").then((text) => {
      const pets = JSON.parse(text);
      if (process.argv.length === 6) {
        const age = parseInt(process.argv[3]);
        const kind = process.argv[4];
        const name = process.argv[5];
        const newAnimal = { age, kind, name };
        pets[pets.length] = newAnimal;
        writeFile("./pets.json", JSON.stringify(pets));
      } else {
        console.error("Usage: node pets.js create AGE KIND NAME");
        process.exit(1);
      }
    });
    break;
  case "update":
    if (process.argv.length === 7) {
      readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        if (petIndex < 0 || petIndex >= pets.length) {
          console.error("Usage: node pets.js update INDEX AGE KIND NAME");
          process.exit(1);
        } else {
          pets[petIndex].age = parseInt(process.argv[4]);
          pets[petIndex].kind = process.argv[5];
          pets[petIndex].name = process.argv[6];
          writeFile("./pets.json", JSON.stringify(pets));
        }
      });
    } else {
      console.error("Usage: node pets.js update INDEX AGE KIND NAME");
      process.exit(1);
    }
    break;
  case "destroy":
    if (process.argv.length === 4) {
      readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        if (petIndex < 0 || petIndex >= pets.length) {
          console.error("Usage: node pets.js destroy INDEX");
          process.exit(1);
        } else {
          pets.splice(petIndex, 1);
          writeFile("./pets.json", JSON.stringify(pets));
        }
      });
    } else {
      console.error("Usage: node pets.js destroy INDEX");
      process.exit(1);
    }
    break;
  default:
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}
