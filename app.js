var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var session = require("express-session");
var path    = require("path");
var https = require('https');


var app = express(); //this is express

// fix 
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

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

app.use(express.static(path.join(__dirname+"/public")));

app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine','ejs');

app.get("/" , function(req,res){
  res.render("home");
});

app.get("/secret" , isLoggedIn, function(req,res){
  res.render("secret");
});

//can't get to /secret or /selectTeams unless loggedin

app.get("/calendar" , isLoggedIn, function(req,res){
  res.render("calendar");
});

app.get("/selectTeams" , isLoggedIn, function(req,res){
  res.render("selectTeams");
});

app.get("/register" , function(req,res){
  res.render("register");
});

app.get("/gameInfo" , function(req,res){
  console.log(req.query.sport, req.query.gameID);
  var nbaurl = 'https://api.sportradar.us/nba/trial/v4/en/games/' + req.query.gameID + '/summary.json?api_key=trt7629wc3wm3xcju2afsybc';
  var ncaaurl = 'https://api.sportradar.us/ncaamb/trial/v4/en/games/' + req.query.gameID + '/summary.json?api_key=txk4dvvn55bp98zds33rzqn5'; 
  var nflurl = 'https://api.sportradar.us/nfl-ot2/games/' + req.query.gameID + '/statistics.json?api_key=taq6n7u2k3tfwgc87kgnge55'; 
  var nhlurl = 'https://api.sportradar.us/nhl/trial/v5/en/games/' + req.query.gameID + '/summary.json?api_key=j9hezzr9b9sexbbcmgyj7hqc';  
  var infoFile;
    if(req.query.sport == 'NBA'){
      url = nbaurl;
      infoFile = 'gameInfo';
    } else if(req.query.sport == 'NCAA MB'){
      url = ncaaurl;
      infoFile = 'gameInfo';
    } else if(req.query.sport == 'NFL'){
      url = nflurl;
      infoFile = 'gameInfoNFL';
    } else {
      url = nhlurl;
      infoFile = 'gameInfoNHL';
    }
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
          var stats = JSON.parse(d);
          //console.log(stats.home.statistics.points, stats.away.statistics.points);
          res.render(infoFile, {stats:stats});
      });
  });
  
});

//server waiting for these routes
app.post("/register" , function(req,res){
  console.log('in register', "user",req.body.username, req.body.password );

  User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    console.log(user);
    passport.authenticate("local")(req,res,function(){
      res.redirect("/selectTeams");
    });
  });
});

app.get("/login" , function(req,res){
  res.render("login");
});

app.post("/login" , passport.authenticate("local", {
  successRedirect: "/calendar",
  failureRedirect: "/login"
}), function(req,res){ 
});

app.get("/logout" , function(req,res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//listens on port 3000
app.listen(3000,function(){
  	console.log('Server started on port 3000');
});


var sports = ["NBA","NFL","NHL","NCAA MB"];

app.get('/api/get_sports',function(req,res) {
    console.log('get_sports');
    //console.log('get_myteams');
    res.json(sports);

});

app.get('/api/get_teams_by_sport',function(req,res) {
    console.log('get_teams', req.query.sport);

    Team.find({sport: req.query.sport}, null, {sort: { name : 1 }}, function(err,teams){
      if(err){
        console.log("error on find")
      } else{
        console.log("display teams");
        //console.log(teams);
        res.json(teams);    
      }
    });
});
app.get('/api/get_myteams',function(req,res) {
    console.log('get_myteams', req.user.username);
    //console.log('get_myteams');
    
    UserTeam.find({username: req.user.username}, function(err,teams){
      if(err){
        console.log("error on find")
      } else{
        console.log("display user teams");
        //console.log(teams); 
        res.json(teams);    
      }
    });

});
app.get('/api/get_myschedule',function(req,res) {
    //console.log('get_myschedule',req.body.user.name);
    console.log('get_myschedule',req.query.name);
    
    var queryInput = [];
    UserTeam.find({username: req.user.username}, 'id', function(err,teams){
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
            res.json(sched);
          }
        });
      }
    });

});
app.post('/api/add_myteam',function(req,res) {
    console.log('add_myteam',req.user.username,req.body.id);
    
    UserTeam.findOneAndUpdate(
      {$and: [{"id": req.body.id}, {"username":req.user.username}]},
      {$setOnInsert: {"name": req.body.name, "id": req.body.id,"username": req.user.username}},
      {upsert: true} , function(err,team){
        if(err){
        console.log("error")
      } else{
        console.log("added team");
        //console.log(team); 
        res.json(team);
      }
  });

});
app.delete('/api/delete_myteam',function(req,res) {
    console.log('delete myteam',req.user.username,req.body.id);
    //console.log(req);
    
    UserTeam.remove({$and: [{"id": req.body.id}, {"username":req.user.username}]}, function(err,teams){
      if(err){
        console.log("error on find")
      } else{
        console.log("delete user teams");
        //console.log(teams);
        res.json(teams);
      }
    });

});

app.get('/fullcalendar.css',function(req,res) {
  //res.send('hello world');
    res.sendFile(path.join(__dirname+'/node_modules/fullcalendar/dist/fullcalendar.css'
      ));
});