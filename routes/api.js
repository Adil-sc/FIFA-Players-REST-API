const express = require("express");
const router = express.Router();
const Pool = require("pg").Pool;
const fetch = require("node-fetch");
const removeDiacritics = require("diacritics").remove;

/*********************************************************************
 ** Creates a pool for postgreSQL DB
 *********************************************************************/
const pool = new Pool({
  user: "me",
  password: "password",
  host: "localhost",
  database: "api",
  port: 5432,
});

/*********************************************************************
 ** Route which sends back a list of players from the DB to the client
 *********************************************************************/
router.get("/players", (req, res) => {
  //Source: https://wanago.io/2018/11/05/cors-cross-origin-resource-sharing/
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");

  if (req.query.nameonly === "true") {
    let player = {};

    //Finds a random player in the players DB and returns their name. Rather slow operation, but fine for a small table
    pool.query(
      "SELECT * FROM players ORDER BY random() LIMIT 1",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return;
        }
        player.playerName = removeDiacritics(results.rows[0].name);
        //res.json(removeDiacritics(results.rows[0].name));
        res.json(player);
      }
    );
  } else {
    let player = {};

    //Finds a random player in the players DB and returns their name. Rather slow operation, but fine for a small table
    pool.query(
      "SELECT * FROM players ORDER BY random() LIMIT 1",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return;
        }
        player.id = results.rows[0].id;
        player.playerName = removeDiacritics(results.rows[0].name);
        player.club = results.rows[0].club;
        player.rating = results.rows[0].rating;
        player.position = results.rows[0].position;

        res.json(player);
      }
    );
  }

  //res.send({type:'GET'});

  //You can use req.query.PARAMNAME, where PARAMNAME is a query passed in via the URL
  //This can be used if we want to return players full name, or just the last name
});

//Allow routes to be used in the server.js file
module.exports = router;
