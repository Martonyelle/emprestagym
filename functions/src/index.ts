import functions = require("firebase-functions");
import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");

import {getUserByEmail} from "./app/controllers/users";

// Start writing Firebase functions
// https://firebase.google.com/docs/functions/typescript
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.options("*", cors());

/**
 * ------------------------------------------
 *  API Routes
 * ------------------------------------------
 */
app.get("/oauth2callback", async (req: any, res: any) => {
  res.status(200).send("SUCESSO");
});

// USERS
app.post("/users/getByEmail", getUserByEmail);

// CUSTOMS
exports.app = functions.runWith({
  memory: "2GB",
}).https.onRequest(app);
