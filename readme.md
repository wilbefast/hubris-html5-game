"HUBRIS" an online multiplayer RTS game (GPLv3)
********************************************************************************

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

********************************************************************************

Hubris, at least the original version, was written in 36 hours using unfamilliar technology. Node.js (with WebSocket-Node) was used for the server, HTML5 for the client.


********************************************************************************
HOW TO CONNECT
********************************************************************************
You must install Node.js and WebSocket-Node before launching the server, which is simply done using:

node server.node.js

The server's IP address needs to be specified in client/index.html (SERVER_URL) for the time being. Later I'll add some way of specifying this from the client. The client should connect automatically to the server if the address is correct, and will be attributed a colour automatically. 

If the client stays white it means that the connection failed.


********************************************************************************
HOW TO PLAY
********************************************************************************
Each player can create (right-click) and control (left-click and drag) agents of their colour in their world. The world is divided into tiles, each with a regenerating energy value which agents can consume to recover their own energy. Units with no energy left are killed.

The two types of agents are Civillians and Soldiers. Civillians can be turned into Soldiers when their energy is full by right-clicking on them. Soldiers can shoot at enemies, reducing their energy.

With each player connected to the server a new portal of their colours will appear in each of the other players' world. Soldiers can be sent to invade another player's world by sending them through the corresponding portal. Last man standing wins ;)
