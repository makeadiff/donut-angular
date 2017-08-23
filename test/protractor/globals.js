skip = false;

var ConnectDatabase = require("../db-connect");
var db_connection = new ConnectDatabase();
db = db_connection.connection;
db.connect();
