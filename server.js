var net = require('net');
var port = 3000;
var clients = 0;

var server = net.createServer(function(c){

	console.log('client connected');
	c.write('Hello Client ' + clients + '\r\n');


c.on('data', function(data) {
    console.log(data.toString().trim());
    if(data.toString().trim() === "are you a machine?"){
      setTimeout(function(){
        c.write("are you?");
        c.end()
    }, 2000)

    }else if(data.toString().trim() != "Hello Server"){
      var response = responses[Math.floor(Math.random()*responses.length)];
      c.write(response);
    }
  });



	c.on('end', function(){
		console.log('client disconnected');
	});

});

server.listen(port, function(){
	console.log('listening on ' + port);
});