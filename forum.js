var express = require('express');
var app = express();
var ejs = require('ejs');
var fs = require('fs');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('data.db');
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
var methodOverride = require('method-override');
var request = require("request");

app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.use(express.static('references'));

app.set('view_engine', 'ejs');

app.get("/", function(req, res){
  res.redirect("/home");
});

app.get("/home", function(req, res){
  db.all("SELECT * FROM topics", function(err, rows){
    if (err) {
      throw err
    } else{
      res.render("home.html.ejs", {topics:rows});
    }
  })
})


app.listen(3000, function(){
  console.log("Listening on 3000");
})