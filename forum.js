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
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.use(express.static('references'));

app.set('view_engine', 'ejs');

app.get("/", function(req, res){
  res.redirect("/topics");
});

app.get("/topics", function(req, res){
  db.all("SELECT * FROM topics", function(err, rows){
    if (err) {
      throw err
    } else{
      res.render("home.html.ejs", {topics:rows});
    }
  })
});

app.get('/topics/new', function(req, res){
  console.log(req.cookies)
  res.render("new_topic.html.ejs");
});

app.post("/topics", function(req, res){
  db.run("INSERT INTO topics (title, username, content, tags) VALUES (?,?,?,?)", req.body.title, req.cookies.username, req.body.content, req.body.tags, function(err){
    if (err) {
      throw err;
    } else{
      res.redirect('/topics');
    }
  })
});

app.get('/topics/:id', function(req, res){
  db.get("SELECT * FROM topics WHERE id=?", req.params.id, function(err, topic){
    if (err) {
      throw err
    } else{
      res.render("show_topic.html.ejs", {topic:topic});
    }
  })
})


app.listen(3000, function(){
  console.log("Listening on 3000");
})