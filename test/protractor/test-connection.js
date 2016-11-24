 
var ConnectDatabase = require("../db-connect");
var db_connection = new ConnectDatabase();
db = db_connection.connection;
db.connect();

db.query('SELECT * from roles', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});


db.end();