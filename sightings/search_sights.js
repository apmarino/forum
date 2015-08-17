var http = require('http'); 
var url = require('url'); 
var fs = require('fs');
var querystring = require('querystring');

var server = http.createServer().listen(3000);

server.on('request', function(request, response){ 
  var urlObj = url.parse(request.url); 
  var path = urlObj.pathname;// to check pathname for sightings  

  var queries = querystring.parse(urlObj.query);//Puts all queries into an object key1=value1&key2=value2...
  var queryKeys = Object.keys(queries);// makes checking and searching for the search very easy

  console.log("Query", queries);//alway double checking my query inputs
  console.log("query keys", queryKeys);//and their keys

//====================================================
// Search Function
//====================================================

  function search(term1, index){

    var searchInput = queries[queryKeys[index]];//this gets the search value input in URL after the search term

    var findSights =[];//empty array to push search results to

    sightingDB.forEach(function(sight){
      if (searchInput == sight[term1]) {
        findSights.push(sight);//if it's a match push to array
        foundIt = true;//this is important for writing after search is called
      };
    });

    return findSights;//to save the array to a variable in conditional
  }

  var sightingDB = JSON.parse(fs.readFileSync("sightings.json", "utf8"));//accessing JSON

  if (path==="/sightings" && urlObj.query){

    if (queryKeys.length === 1) {
      var foundIt = false;//set up foundIt so search can use it if search() finds a match

      var findSights = search(queryKeys[0], 0);

      if (foundIt) {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(findSights));
      response.end();
      } else if (!foundIt) {
      var locError = { error : "There were no sightings for that "+queryKeys[0]+"!"};
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(locError));
      response.end();
      };
    }
    else if (queryKeys.length === 2) {
      var foundIt = false//Not needed here but needs to be defined for search()

      var firstSearch = search(queryKeys[0], 0);//gets an array of all of the first search terms
      var secondSearch = search(queryKeys[1], 1);//gets an array of all of the second search terms

      var findSights = [];
      //-------------------------------------------------------------------------
      //Nested for loops to compare every term to every other term in each array.
      //-------------------------------------------------------------------------

      for (var i = 0; i<firstSearch.length; i++){
        for(var v = 0; v<secondSearch.length; v++){
          if (firstSearch[i].id === secondSearch[v].id) {
            findSights.push(firstSearch[i]);
          };
        }
      };

      if (findSights.length > 0) {//new boolean here since foundIt may return true even if findSights is empty
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(findSights));
      response.end();
      } else if (findSights.length === 0) {
      var locError = { error : "There were no sightings for that "+queryKeys[0]+" with that "+queryKeys[1]+"!"};
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify(locError));
      response.end();
      };


    };
  }
  else if (path==="/sightings") {//if there's no query, give them all the sightings
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(sightingDB));
    response.end();

  }
  else if( path ==="/favicon.ico"){//ignore chromes annoying double request
   console.log("request for favicon.ico");
  }
  else if (path ==="/help") {
    var help = {
      "/stringify?": {
        "location": "City%2C%20StateCode",
        "shape": "Capital first letter (e.g. Sphere)",
        "posted": "Month/Day/Year",
        "id": "Number"
      }
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(help));
    response.end();

  };


})


