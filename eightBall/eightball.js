var net = require('net');
var chalk = require('chalk');

var port = 3000;

var answers = ["yes, definitely\r\n", "don't count on it\r\n", "the future is uncertain\r\n", "ask later\r\n", "the sun smiles\r\n", "I weep for you\r\n", "the answer is known\r\n", "It is so\r\n", "Please be clear. This is hard work\r\n", "Greater questions have been asked by lesser men\r\n", "Affirmative\r\n", "Probably\r\n", "sure\r\n", "Umm...\r\n...\r\nno\r\n" ];

var server = net.createServer(function(c){

  c.on('data', function(data){
    var input = data.toString().trim();

    if (/\?/.test(input)) {
      var response = Math.floor(Math.random()*answers.length);
      c.write(chalk.blue(answers[response]));

    } else {
      c.write(chalk.bold.red("Please ask a question.\r\n"));
      console.log(chalk.red("this works"));
    }
  })





  c.on('end', function(){
    console.log("client disconnected");
  })
});


server.listen(port, function(){
  console.log("listening on", port);
});

//ADDED COMMENT?

// one more time
