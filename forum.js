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
var cookieParser = require('cookie-parser');
var _ = require("underscore");

app.use(cookieParser())
app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.use(express.static('references'));

app.set('view_engine', 'ejs');

app.get("/", function(req, res){
  res.redirect("/topics");
});

app.get("/topics", function(req, res){
  db.all("SELECT * FROM topics ORDER BY topics.votes DESC", function(err, rows){
    if (err) {
      throw err
    } else{
      db.all("SELECT topic_id FROM comments;", function(req, ids){
        if (err) {
          throw err;
        } else{
          var idsArr =[];
          ids.forEach(function(id){
            idsArr.push(id.topic_id);
          });
          var commentObj = _.groupBy(idsArr, function(num){
            return num;
          });
          var commentCount= [0];
          Object.keys(commentObj).forEach(function(key){
            commentCount.push(commentObj[key].length)
          });

          var randomNum = Math.ceil(Math.random()*999999);
          res.render("home.html.ejs", {topics:rows, randomNum:randomNum, commentCount:commentCount});

        }
      })
    }
  })
});

app.get("/topics/:id/voteup", function(req, res){
  db.run("UPDATE topics SET votes=votes+1 WHERE id=?", req.params.id, function(err){
    if (err) {
      throw err;
    } else{
      res.redirect("/topics");
    }
  })
});

app.get("/topics/:id/votedown", function(req, res){
  db.run("UPDATE topics SET votes=votes-1 WHERE id=?", req.params.id, function(err){
    if (err) {
      throw err;
    } else{
      res.redirect("/topics");
    }
  })
});


app.get('/topics/new', function(req, res){
  console.log(req.cookies);
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
      
      db.all("SELECT * FROM comments WHERE topic_id=?", topic.id, function(err, comments){
        if (err) {
          throw err
        } else{

          res.render("topic_show.html.ejs", {topic:topic, comments:comments});
        }
      })
    }
  })
});

app.post("/topics/:id/newcomment", function(req, res){
  db.run("INSERT INTO comments (username, topic_id, content) VALUES (?,?,?)", req.cookies.username, req.params.id, req.body.comment, function(err){
    if (err) {
      throw err;
    } else{
      res.redirect("/topics/"+req.params.id);
    }
  })
});

app.get('/search', function(req, res){
  var tags = req.query.tags.split(" ");
  console.log(tags)
  db.all("SELECT * FROM topics WHERE tags like ? OR tags LIKE ?", "%"+tags[0]+"%", "%"+tags[1]+"%", function(err, topics){
    if (err) {
      throw err
    } else{
      res.render("search.html.ejs", {topics:topics});
    }
  })
})

app.delete('/topic/:id', function(req, res){//delete topic
  db.get("SELECT username FROM topics WHERE id=?", req.params.id, function(err, user){
    if (err) {
      throw err;
    } else{
      if(user.username === req.body.username || req.body.username === "Admin"){
        db.run("DELETE FROM topics WHERE id=?", req.params.id, function(err){
          if (err) {
            throw err;
          } else{
            res.redirect('/topics')
          }
        })
      } else{
        res.redirect('/topics/'+req.params.id);
      }
      
    }
  })
});
app.delete('/comment/:commentId/:topicId', function(req, res){
  db.get("SELECT username FROM comments WHERE comment_id=?", req.params.commentId, function(err, user){
    if (err) {
      throw err;
    } else{
      if(user.username === req.body.comment || req.body.comment === "Admin"){
        db.run("DELETE FROM comments WHERE comment_id=?", req.params.commentId, function(err){
          if (err) {
            throw err;
          } else{
            res.redirect('/topics/'+req.params.topicId)
          }
        })
      } else{
        res.redirect('/topics/'+req.params.topicId);
      }
      
    }
  })
});


app.listen(3000, function(){
  console.log("Listening on 3000");
})