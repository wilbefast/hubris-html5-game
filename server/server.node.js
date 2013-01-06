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

// original code from: http://mjijackson.com/
function hsl2rgb(h, s, l)
{
  var r, g, b;
  if(s == 0)
    r = g = b = l; // achromatic
  else
  {
    function h2rgb(p, q, t)
    {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = h2rgb(p, q, h + 1/3);
    g = h2rgb(p, q, h);
    b = h2rgb(p, q, h - 1/3);
  }
  return ('rgb(' + Math.round(r * 255) + ',' 
                + Math.round(g * 255) + ',' 
                + Math.round(b * 255) + ')');
}

colours = [];
for(var i = 0; i < MAX_PLAYERS; i++)
  colours.push(hsl2rgb(i / MAX_PLAYERS, 1, 0.5));
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

// convert player-object to a packet (add title and remove connection)
function playerToPacket(player, title)
{
  return JSON.stringify({ type : title, id : player.id, colour : player.colour });
}

// send a message to all players except the sender
function broadcast(message, sender)
{
  for(var i in players) if(i != sender.id)
    players[i].connection.sendUTF(message);
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
  t_log('accepted http request.');
  
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
      t_log('received message: ' + message.utf8Data);
      
      // parse message to object
      try 
      {
        var json = JSON.parse(message.utf8Data);
      } 
      catch (e) 
      {
        t_log('message is not JSON: ' + e);
        return;
      }
      
      // deal with message
      switch(json.type)
      {
        case 'unit':
          players[json.dest].connection.sendUTF(message.utf8Data);
          break;
          
        default:
          t_log('unrecognised JSON type: ' + json.type);
          break;
      }
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
    
    // inform the other players of the disconnection
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
