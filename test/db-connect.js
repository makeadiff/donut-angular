function ConnectDatabase() {
	var mysql = require('mysql');

	var secret = require('../secret.json');

	this.connection = mysql.createConnection({
		host: secret.database.host,
		user: secret.database.user,
		password: secret.database.password,
		database: 'Project_Donut'
	});
};
module.exports = ConnectDatabase;
