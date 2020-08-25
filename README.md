# FIFA Players REST API
An API which returns a list of players from EA Sports FIFA Ultimate Team. Returns either a single player name or a player name along with the club the belong too, their FIFA Ultimate Team rating, and the position they play. 

## Installation and Usage
Make sure you have a PostgreSQL database created. Ensure you have a table called `players` with columns `name`, `club`, `player`, `rating`. The `name` column must have a `UNIQUE` constraint. 
```
npm install
node server.js
```

## HTTP Requests

### Getting a Random Player Name

**Parameter**

```nameonly=true```

**Example Call**
- http://localhost:4000/api/players?nameonly=true
```
{
    "playerName": "Delph"
}
```

### Getting a Random Player Name + Club, Rating, and Position Info

**Example Call**
- http://localhost:4000/api/players
```
{
    "id": 1067,
    "playerName": "Delph",
    "club": "Manchester City",
    "rating": "80",
    "position": "Left Back"
}
```

## Built With
- Node.js
- Express
- PostgreSQL
