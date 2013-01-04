//! ----------------------------------------------------------------------------
//! GLOBAL CONFIGURATION
//! ----------------------------------------------------------------------------

process.title = 'nodejs-gameserver';

//! ----------------------------------------------------------------------------
//! LOAD EXTERNAL MODULES
//! ----------------------------------------------------------------------------

var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');

//! ----------------------------------------------------------------------------
//! UTILITY FUNCTIONS
//! ----------------------------------------------------------------------------

function t_log(msg)
{
  console.log((new Date()) + ' ' + msg);
}

//! ----------------------------------------------------------------------------
//! GLOBAL VARIABLES
//! ----------------------------------------------------------------------------

var MAX_PLAYERS = 8;
var players = [];
var colours = [ 'red', 'green', 'blue', 'magenta', 'aqua', 'yellow', 'purple', 'orange' ];
colours.sort(function(a,b) { return Math.random() > 0.5; } );

//! ----------------------------------------------------------------------------
//! LOAD INDEX HTML
//! ----------------------------------------------------------------------------

var html;
function indexFromData(err, data)
{
  if (err) 
    throw err; 
  else
    html = data;
}
fs.readFile("./index.html", indexFromData);

//! ----------------------------------------------------------------------------
//! LAUNCH HTTP SERVER
//! ----------------------------------------------------------------------------

function httpService(request, response) 
{
  // hello world
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(html);
  response.end();
}

var httpServer = http.createServer(httpService);
httpServer.listen(1337);


//! ----------------------------------------------------------------------------
//! LAUNCH WEB SOCKET SERVER
//! ----------------------------------------------------------------------------

// create the server
wsServer = new WebSocketServer({ httpServer: httpServer });

// treat requests
function receiveRequest(request)
{
  //! LIMIT CONNECTIONS
  if(players.length >= MAX_PLAYERS)
  {
    request.reject(503, "No available player slots.");
    t_log('rejected connection: no available player slots.');
    return;
  }
  
  //! OPEN CONNECTION TO NEW CLIENT
  var connection = request.accept(null, request.origin);
  var playerIndex = players.push(connection) - 1;
  
  // give the player a colour
  var playerColour = colours.shift();
  var packet = { type:'colour', data:playerColour };
  connection.sendUTF(JSON.stringify(packet));
  t_log(playerColour + ' player joined.');
  
  //! RECEIVE MESSAGE
  function receiveMessage(message)
  {
    if (message.type === 'utf8') 
    {
      // TODO treat webservice message
      t_log('received message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
  }
  connection.on('message', receiveMessage);
  
  //! CLOSE CONNECTION
  function closeConnection(connection)
  {
    t_log(playerColour + ' player disconnected.');
    players.splice(playerIndex, 1);
    colours.push(playerColour);
  }
  connection.on('close', closeConnection);
}
wsServer.on('request', receiveRequest);


//! ----------------------------------------------------------------------------
//! REPORT SUCCESSFUL START
//! ----------------------------------------------------------------------------
t_log('launched successfully.');
