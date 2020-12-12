var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/sports_app", {useMongoClient: true});


var teamSchema = new mongoose.Schema({
	 name: String,
     alias:  String,
     id:  String,
     sport :  String 
});

var Team = mongoose.model("Team", teamSchema);

var scheduleSchema = new mongoose.Schema({
	sport : String,
    id: String,
    status: String,
    scheduled: String,
    home_points: String,
    away_points: String,
    home: {
    	name: String,
        alias: String,
        id: String,
    },
    away: {
        name: String,
        alias: String,
        id: String,
    }
});

var Schedule = mongoose.model("Schedule", scheduleSchema);

var userTeamSchema = new mongoose.Schema({
	name: String,
    id:  String, 
    username: String
});

var UserTeam = mongoose.model("UserTeam", userTeamSchema);


var https = require('https');

var proxy = 'https://cors-anywhere.herokuapp.com/';
var nflurl = 'https://api.sportradar.us/nfl-ot2/games/2017/REG/schedule.json?api_key=taq6n7u2k3tfwgc87kgnge55'
var nbaurl = 'https://api.sportradar.us/nba/trial/v4/en/games/2017/REG/schedule.json?api_key=trt7629wc3wm3xcju2afsybc'
var nhlurl = 'https://api.sportradar.us/nhl/trial/v5/en/games/2017/REG/schedule.json?api_key=j9hezzr9b9sexbbcmgyj7hqc'
var mburl = 'https://api.sportradar.us/ncaamb/trial/v4/en/games/2017/REG/schedule.json?api_key=txk4dvvn55bp98zds33rzqn5'


var addTeams = function(myteams) {

	Team.insertMany(myteams)
    	.then(function(docs) {
    		console.log("added teams", docs);
         // do something with docs
    	})
    	.catch(function(err) {
        	console.log("error")
    	});
};

var displayTeams = function() {
	Team.find({}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("display teams");
			console.log(teams);
		}
	});
};

var deleteTeams = function() {
	Team.remove({}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("delete teams");
			//console.log(teams);
		}
	});
};

var addSched = function(mysched) {

	Schedule.insertMany(mysched)
    	.then(function(docs) {
    		console.log("added sched", docs);
         // do something with docs
    	})
    	.catch(function(err) {
        	console.log("error adding sched")
    	});
};

var displaySched = function() {
	Schedule.find({}, function(err,schedule){
		if(err){
			console.log("error on find schedule")
		} else{
			console.log("display schedule");
			console.log(schedule);
		}
	});
};

var deleteSched = function() {
	Schedule.remove({}, function(err,schedule){
		if(err){
			console.log("error on delete schedule")
		} else{
			console.log("delete schedule");
			//console.log(teams);
		}
	});
};

var addUserTeams = function(teams) {

	UserTeam.insertMany(teams)
    	.then(function(docs) {
    		console.log("added teams", docs);
         // do something with docs
    	})
    	.catch(function(err) {
        	console.log("error")
    	});
};

var displayUserTeams = function() {
	UserTeam.find({}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("display user teams");
			console.log(teams);
		}
	});
};

var deleteUserTeams = function() {
	UserTeam.remove({}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("delete user teams");
			//console.log(teams);
		}
	});
};

var getsched = function(sport,url) {
	var myteams = [];
    var myids = [];
    var teamInput;
 	var teamID;
	var mysched = [];
 	var schedInput;

	https.get(url, function(result) {
    	var responseParts = [];
   		result.setEncoding('utf8');
    	result.on("data", function(chunk) {
        	//add this chunk to the output to send
        	responseParts.push(chunk);
    	});
    	result.on("end", function(){
        	//now send your complete response
        	var d = responseParts.join('');
        	console.log(d.length);
  	    	var sched = JSON.parse(d);
  	    	//console.log(nflsch.weeks[0].games[0].home.name, nflsch.weeks[0].games[0].home.alias, nflsch.weeks[0].games[0].home.id);
  	    	//console.log(sched);
  	    	processSched(sport,sched);
  	    	addTeams(myteams);
  	    	addSched(mysched);
        	//res.end(responseParts.join(''));
    	});
	});


var processSched = function(sport,schedule) {
	 //myteams.length = 0;
     //myids.length = 0;
     //mysched.length = 0;
	if(sport == 'NFL'){
		for(var w = 0; w < schedule.weeks.length; w++){
			for(var i = 0; i < schedule.weeks[w].games.length; i++){
				//console.log(schedule.games[i].home.name, schedule.games[i].home.alias, schedule.games[i].home.id);
				//console.log(nflsch.weeks[0].games[0].home.name, nflsch.weeks[0].games[0].home.alias, nflsch.weeks[0].games[0].home.id);
				teamInput = {"id": schedule.weeks[w].games[i].home.id, "alias": schedule.weeks[w].games[i].home.alias, "name": schedule.weeks[w].games[i].home.name , "sport": sport};
				teamID = schedule.weeks[w].games[i].home.id;

				schedInput = 
					{"sport": sport , 
					"id": schedule.weeks[w].games[i].id , 
					"status": schedule.weeks[w].games[i].status , 
					"scheduled": schedule.weeks[w].games[i].scheduled,
      				"home_points": schedule.weeks[w].games[i].home_points,
      				"away_points": schedule.weeks[w].games[i].away_points,
      				"home": {
        				"name": schedule.weeks[w].games[i].home.name,
        				"alias": schedule.weeks[w].games[i].home.alias,
        				"id": schedule.weeks[w].games[i].home.id},
        			"away": {
        				"name": schedule.weeks[w].games[i].away.name,
        				"alias": schedule.weeks[w].games[i].away.alias,
        				"id": schedule.weeks[w].games[i].away.id}};
        		//console.log(schedInput);		
        		mysched.push(schedInput);

				if(myids.includes(teamID)) {

				} else {
					myids.push(teamID);
					myteams.push(teamInput);
					//console.log(teamInput);
				}
			}
		}	
	} else {
		for(var i = 0; i < schedule.games.length; i++){
			//console.log(schedule.games[i].home.name, schedule.games[i].home.alias, schedule.games[i].home.id);
			//teamInput = {schedule.games[i].home.id, schedule.games[i].home.alias, schedule.games[i].home.name , sport};
			teamInput = {"id": schedule.games[i].home.id, "alias": schedule.games[i].home.alias, "name": schedule.games[i].home.name , "sport": sport};
			teamID = schedule.games[i].home.id;
			schedInput = 
				{"sport": sport , 
				"id": schedule.games[i].id , 
				"status": schedule.games[i].status , 
				"scheduled": schedule.games[i].scheduled,
      			"home_points": schedule.games[i].home_points,
      			"away_points": schedule.games[i].away_points,
      			"home": {
        			"name": schedule.games[i].home.name,
        			"alias": schedule.games[i].home.alias,
        			"id": schedule.games[i].home.id},
        		"away": {
        			"name": schedule.games[i].away.name,
        			"alias": schedule.games[i].away.alias,
        			"id": schedule.games[i].away.id}};
        	//console.log(schedInput);		
        	mysched.push(schedInput);
			if(myids.includes(teamID)) {

			} else {
				myids.push(teamID);
				myteams.push(teamInput);
				//console.log(teamInput);
			}
		}				
	}
};
};  // adjust later need to be in other routine


var getUserSched = function(user) {
	var queryInput = [];
	UserTeam.find({username: user}, 'id', function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("display  user teams");
			//console.log(teams);
			for(var i = 0; i < teams.length; i++){
				queryInput.push(teams[i].id)
				console.log(teams[i].id);
			}
			Schedule.find({$or: [{"home.id": queryInput} , {"away.id": queryInput} ]}, function(err, sched){
				if(err){
					console.log("error on find")
				} else{
					console.log("display  user schedule");
					for(var i = 0; i < sched.length; i++){
						console.log(sched[i].home.name, sched[i].away.name );
					}
				}
			});
		}
	});

};

var addUserTeam = function(user, tid, tname) {

    UserTeam.findOneAndUpdate(
    	{$and: [{"id": tid}, {"username":user}]},
   		{$setOnInsert: {"name": tname, "id": tid,"username": user}},
   		{upsert: true} , function(err,team){
   			if(err){
				console.log("error")
			} else{
				console.log("added team");
				console.log(team); 
			}
	});
};

var deleteUserTeam = function(user, tid) {
	UserTeam.remove({$and: [{"id": tid}, {"username":user}]}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("delete user teams");
			//console.log(teams);
		}
	});
};

var getUserTeam = function(user) {
	UserTeam.find({username: user}, function(err,teams){
		if(err){
			console.log("error on find")
		} else{
			console.log("display  user teams");
			console.log(teams);			
		}
	});
};

//getsched("NBA",nbaurl);
//getsched("NHL",nhlurl);
//getsched("NFL",nflurl);
//getsched("NCAA MB",mburl);
//deleteTeams();
//displayTeams();
//deleteSched();
displaySched();
//addUserTeams(testuserteams);
//displayUserTeams();
//deleteUserTeams();
//getUserSched("Rob");
//addUserTeam("Rob","cb2f9f1f-ac67-424e-9e72-1475cb0ed398", "Steelers");
//addUserTeam("Rob","583ec825-fb46-11e1-82cb-f4ce4684ea4c", "xxxxxx");
//addUserTeam("Robert","cb2f9f1f-ac67-424e-9e72-1475cb0ed398", "Steelers");
//deleteUserTeam("Robert","cb2f9f1f-ac67-424e-9e72-1475cb0ed398");
//getUserTeam('Robert');


//https://api.sportradar.us/nba/trial/v4/en/games/4c1b49cd-e114-4936-8a81-10b238cc5d45/summary.json?api_key=trt7629wc3wm3xcju2afsybc
//https://api.sportradar.us/ncaamb/trial/v4/en/games/{game_id}/summary.json?api_key=txk4dvvn55bp98zds33rzqn5
//https://api.sportradar.us/nfl-ot2/games/d9f4c342-bf1a-4491-828a-004e8726cf10/statistics.json?api_key=taq6n7u2k3tfwgc87kgnge55
//https://api.sportradar.us/nhl/trial/v5/en/games/6cbe1593-9d60-4a4f-89d7-8b5d88263dc3/summary.json?api_key=j9hezzr9b9sexbbcmgyj7hqc