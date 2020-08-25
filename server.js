const express = require("express");
const bodyParser = require("body-parser");
const Pool = require("pg").Pool;
const fetch = require("node-fetch");
const helperFuncs = require("./functions");

//Set up express app
const app = express();

//Initalize routes
app.use("/api", require("./routes/api"));

app.use(bodyParser.json());

helperFuncs.execute();
helperFuncs.displayPlayers();

//Listen for requests
//process.env.port ||  if we put on heroku and need to get the port.
app.listen(4000, () => {
  console.log("Now listenting for requests");
});
