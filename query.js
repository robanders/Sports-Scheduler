var path    = require("path");
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(path.join(__dirname+'/sports.db'),function(err){
	if (err) {
    	return console.error(err.message);
  	}
  	console.log('Connected to the SQlite database.');
});

sql = `delete from teams` 
	db.run(sql, [], function(err) {
  		if (err) {
    		console.error(err.message);
  		}
  		console.log(`Row(s) deleted ${this.changes}`);
	});
	
db.serialize(() => {
	sql = `select * from teams`
	db.all(sql, [], function(err, teams) {
  		if (err) {
    		throw err;
  		}
  		teams.forEach(function(team) {
    		console.log('id', team.tid, 'alias', team.alias, 'name', team.teamname);
  		});
	});	
});
