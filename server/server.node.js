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
  //! RECEIVE MESSAGE
  var connection = request.accept(null, request.origin);
  
  //! RECEIVE MESSAGE
  function receiveMessage(message)
  {
    if (message.type === 'utf8') 
    {
      // TODO treat webservice message
      console.log("RECEIVED: " + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
  }
  connection.on('message', receiveMessage);
  
  //! CLOSE CONNECTION
  function closeConnection(connection)
  {
    // TODO close user connection
    console.log('server closed connection');
  }
  connection.on('close', closeConnection);
}
wsServer.on('request', receiveRequest);


//! ----------------------------------------------------------------------------
//! REPORT SUCCESSFUL START
//! ----------------------------------------------------------------------------

console.log('server launched successfully');
