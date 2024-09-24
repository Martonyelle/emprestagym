import functions = require("firebase-functions");
import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");

import {getUserByEmail} from "./app/controllers/users";
import { createCustomer, deleteCustomer, createSubscription, receiveInCash, handlePaymentsWebhooks } from "./app/controllers/asaasController";

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

// Rotas do Asaas
app.post('/asaas/customer', createCustomer);
app.delete('/asaas/customer', deleteCustomer);
app.post('/asaas/subscription', createSubscription);
app.post('/asaas/payment/cash', receiveInCash);
app.post('/asaas/webhook', handlePaymentsWebhooks);

// USERS
app.post("/users/getByEmail", getUserByEmail);

// CUSTOMS
exports.app = functions.runWith({
  memory: "2GB",
}).https.onRequest(app);
