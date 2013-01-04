/** @author William J.D. **/

/*
HTML5 base code
Copyright (C) 2012 William James Dyce

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



/*** GAME CLASS ***/

/// CLASS VARIABLES/CONSTANTS
Game.MAX_FPS = 60;

/// INSTANCE ATTRIBUTES/METHODS
function Game()
{
  /* RECEIVER */
  var o = this, typ = Game;
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  o.units = [];
  o.units.push(new Unit(new V2(150, 350)));
  o.units.push(new Unit(new V2(250, 250)));
  o.units.push(new Unit(new V2(350, 150)));
    
  /* PRIVATE METHODS */
  
  var treatEvent = function(event)
  {
    switch(event.type)
    {
      case "mouseup":
        break;
        
      case "mousedown":
        getObjectAt(mouse.pos, o.units);
        break;
        
      case "keyup":
        break;
        
      case "keydown":
        break;
    }
  }
  
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  o.injectUpdate = function(delta_t)
  {
    // update objects
    updateObjects(o.units, delta_t);
    
    // select units
    var event = poll_input_event();
    if(event)
    do
    {
      treatEvent(event);
    }
    while(event = poll_input_event());
    
  }
 
  o.injectDraw = function()
  {
    if(!canvas.focus)
      return;

    // clear canvas
    context.fillStyle = "rgb(200, 200, 200)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw units
    drawObjects(o.units);

  }

  /* INITIALISE AND RETURN INSTANCE */
  return o;
}

Game.INSTANCE = new Game();