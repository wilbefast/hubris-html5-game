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
  /* ATTRIBUTES 
    var a = x; 
  */
  
  // receiver 
  var obj = this, typ = Game;
  
  // true attributes
  

  /* METHODS 
    (obj.f = function(p1, ... ) { }
  */

  obj.injectUpdate = function(delta_t)
  {
  }
 
  obj.injectDraw = function()
  {
    if(!canvas.focus)
      return;

    // clear canvas
    context.fillStyle = "rgb(200, 200, 200)";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  /* INITIALISE AND RETURN INSTANCE */
  return obj;
}

Game.INSTANCE = new Game();