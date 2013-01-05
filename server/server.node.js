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
//! GLOBAL VARIABLES
//! ----------------------------------------------------------------------------

var MAX_PLAYERS = 8;
var players = {}; // hashtable
var colours = [ 'red', 'green', 'teal', 'magenta', 'aqua', 'yellow', 'purple', 'orange' ];
colours.sort(function(a,b) { return Math.random() > 0.5; } );

//! ----------------------------------------------------------------------------
//! UTILITY FUNCTIONS
//! ----------------------------------------------------------------------------

// log with date
function t_log(msg)
{
  console.log((new Date()) + ' ' + msg);
}

// allocate unique identifiers
var next_id = 1;
function allocateID()
{
  return (next_id++);
}

// player to packet
function playerToPacket(player, title)
{
  return JSON.stringify({ type : title, id : player.id, colour : player.colour });
}


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
  
  response.write("<h>players in game<h>");
  for(var i = 0; i < players.length; i++)
    response.write("<p>" + players[i].col + "</p>");
  //response.write(html);
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
  //! --------------------------------------------------------------------------
  //! LIMIT CONNECTIONS
  if(players.length >= MAX_PLAYERS)
  {
    request.reject(503, "No available player slots.");
    t_log('rejected connection: no available player slots.');
    return;
  }
  
  //! --------------------------------------------------------------------------
  //! OPEN CONNECTION TO NEW CLIENT 
  var player = 
  {
    connection : request.accept(null, request.origin),
    id : allocateID(),
    colour : colours.shift()
  };
  
  // give the player a colour
  player.connection.sendUTF(playerToPacket(player, 'welcome'));
  t_log(player.colour + ' joined.');
  
  // add to the list of players
  players[player.id] = player;
  
  // tell the players about eachother
  var packet = playerToPacket(player, 'open_portal');
  for(var i in players) if(i != player.id)
  {
    var other = players[i];
    other.connection.sendUTF(packet);
    player.connection.sendUTF(playerToPacket(other, 'open_portal'));
  }
  
  //! --------------------------------------------------------------------------
  //! RECEIVE MESSAGE
  function receiveMessage(message)
  {
    if (message.type === 'utf8') 
    {
      // TODO treat webservice message
      t_log('received message: ' + message.utf8Data);
    }
  }
  player.connection.on('message', receiveMessage);
  
  //! --------------------------------------------------------------------------
  //! CLOSE CONNECTION
  function closeConnection(connection)
  {
    // remove the leaving player from the list
    t_log(player.colour + ' disconnected.');
    delete players[player.id];
    colours.push(player.colour);
    
    // tell inform the other players of the disconnection
    var packet = playerToPacket(player, 'close_portal');
    for (var i in players)
    {
      var other = players[i];
      other.connection.sendUTF(packet);
      t_log('told ' + other.colour + ' about ' + player.colour + ' disconnecting.');
    }
  }
  player.connection.on('close', closeConnection);
}
wsServer.on('request', receiveRequest);


//! ----------------------------------------------------------------------------
//! REPORT SUCCESSFUL START
//! ----------------------------------------------------------------------------
t_log('launched successfully.');
