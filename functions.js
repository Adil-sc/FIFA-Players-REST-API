const Pool = require("pg").Pool;
const fetch = require("node-fetch");
let methods = {};

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
 ** Helper function to perform a GET request on the provided URL
 *********************************************************************/
methods.getPlayers = async function (url) {
  let response = await fetch(url);
  return await response.json();
};

/*********************************************************************
 ** Function that obtains a list of players from the FIFA Ultimate Team endpoint and stores them in the postgreSQL DB
 *********************************************************************/
methods.displayPlayers = async function () {
  let result = await methods.getPlayers(
    "https://www.easports.com/fifa/ultimate-team/api/fut/item?quality=1-gold&rating=80-90&page=1"
  );
  console.log(result.items[0].firstName);
  pool.query(
    "INSERT INTO players (name,club,rating,position) VALUES ($1,$2,$3,$4) ON CONFLICT (name) DO NOTHING",
    ["Marcelo", "Real Madrid", "90", "Center Back"]
  );
  let notEndOfList = true;
  let playerCounter = 0;
  let pageCount = 1;
  let totalResultCount = 0;

  //Loop that iterates through the results object from the fetch API above
  while (notEndOfList) {
    //Display result
    //console.log(`${result.items[playerCounter].name} with rating: ${result.items[playerCounter].rating} from club:${result.items[playerCounter].club.name}`);

    //Insert player into the PostgreSQL DB
    pool.query(
      "INSERT INTO players (name,club,rating,position) VALUES ($1,$2,$3,$4) ON CONFLICT (name) DO NOTHING",
      [
        `${result.items[playerCounter].name}`,
        `${result.items[playerCounter].club.name}`,
        `${result.items[playerCounter].rating}`,
        `${result.items[playerCounter].positionFull}`,
      ]
    );

    console.log(totalResultCount);

    playerCounter++;
    totalResultCount++;

    //Reset the playerCounter everything it has reached the max count for each page
    //Increments the page count once we reach the end of the current page
    if (playerCounter === result.count) {
      pageCount++;
      //Update the result variable with the players from the next page
      result = await methods.getPlayers(
        `https://www.easports.com/fifa/ultimate-team/api/fut/item?quality=1-gold&rating=80-90&page=${pageCount}`
      );
      //Reset playerCount
      playerCounter = 0;
    }

    //Once we have reached the total result count, we end the loop
    if (totalResultCount === result.totalResults) {
      notEndOfList = false;
    }
  }
  console.log(totalResultCount);
};

/*********************************************************************
 ** Function that connects to the postgreSQL DB
 *********************************************************************/
methods.execute = async function () {
  try {
    await pool.connect();
    console.log("Connected to DB Successfully");
    const results = await pool.query("SELECT * FROM Players");
    console.log(results.rows);
  } catch (err) {
    console.log(err);
  } finally {
    //await pool.end();
    //console.log('Client disconnected from DB');
  }
};

module.exports = methods;
