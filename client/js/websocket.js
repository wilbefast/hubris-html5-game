/** @author William J.D. **/

/*
HTML5 base code
Copyright (C) 2013 William James Dyce

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

/*** Websocket functions ***/

function onOpen(event)
{
  console.log("CONNECTED");
  
  console.log("SENT: bink"); 
  websocket.send("bink");
}

function onClose(event)
{
  console.log("DISCONNECTED");
}

function onMessage(message)
{
  console.log("RECEIVED: " + message.data);
  websocket.close();
}

function onError(error)
{
  console.log("ERROR: " + error.data);
}

var websocket = new WebSocket(SERVER_URL);
websocket.onopen = onOpen;
websocket.onclose = onClose;
websocket.onmessage = onMessage;
websocket.onerror = onError;

