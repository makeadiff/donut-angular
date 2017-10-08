function ConnectDatabase() {
	var mysql = require('mysql');

	var secret = require('../secret.json');

	this.connection = mysql.createConnection({
		host: secret.database.host,
		user: secret.database.user,
		password: secret.database.password,
		database: 'makeadiff_cfrapp'
	});
};
module.exports = ConnectDatabase;
