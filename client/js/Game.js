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

  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.grid = new Tilegrid(new V2(32, 32));
  
  o.units = [];
  o.portals = [];
  o.selected = null;
    
  /* PRIVATE METHODS */
  
  var treatEvent = function(event)
  {
    switch(event.type)
    {
      case "mousedown":
        switch(event.button)
        {
          case 0: // left
            o.selected = getObjectAt(mouse.pos, o.units);
            break;
          case 2: // right
            o.units.push(new Unit(mouse.pos, 16));
            break;
        }
        break;
        
      case "mouseup":
        switch(event.button)
        {
          case 0:
            if(o.selected)
            {
              o.selected.goto(mouse.pos);
              o.selected = null;
            }
            break;
          case 1:
            break;
        }
        break;
        
      case "keydown":
        break;
        
      case "keyup":
        break;

    }
  }
  
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  o.injectUpdate = function(delta_t)
  { 
    if(!canvas.focus)
      return;
    
    // update objects
    updateObjects(o.units, delta_t, [ generateCollision ], o.grid);
    updateObjects(o.portals, delta_t);
     
    // update grid
    o.grid.update(delta_t);
    
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
    
    // draw grid
    o.grid.draw();
    
    // draw objects
    drawObjects(o.units);
    drawObjects(o.portals);
    
    // draw a preview of the command
    context.strokeStyle = 'black';
    if(o.selected)
      context.strokeLine(o.selected.pos.x, o.selected.pos.y, mouse.pos.x, mouse.pos.y);
  }
  
  o.openPortal = function(colour)
  {
    o.portals.push(new Portal(random_position(), colour));
  }
  
  o.closePortal = function(colour)
  {
    for(var i = 0; i < o.portals.length; i++)
    {
      if(o.portals[i].colour == colour)
      {
        o.portals[i].close();
        return;
      }
    } 
  }

  /* INITIALISE AND RETURN INSTANCE */
  return o;
}

Game.INSTANCE = new Game();