/** @author William J.D. **/

/*
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

/// INSTANCE ATTRIBUTES/METHODS
function Tilegrid()
{
  /* RECEIVER */
  var o = this, typ = Tilegrid;
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.size = new V2(canvas.width * Tile.ISIZE.x, canvas.height * Tile.ISIZE.y);
  
  o.grid = new Array(o.size.y);
  for(var row = 0; row < o.size.y; row++)
  {
    o.grid[row] = new Array(o.size.x);
    for(var col = 0; col < o.size.x; col++)
      o.grid[row][col] = new Tile(row, col);
  }
  
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    for(var row = 0; row < o.size.y; row++)
    for(var col = 0; col < o.size.x; col++)
      o.grid[row][col].update(delta_t);
      
  }
  
  o.draw = function()
  {
    for(var row = 0; row < o.size.y; row++)
    for(var col = 0; col < o.size.x; col++)
      o.grid[row][col].draw();
  }
    
  o.isValid = function(row, col)
  {
    return (row >= 0 && row < o.size.y && col >= 0 && col < o.size.x);
  }
  
  o.getSceneNode = function(pos)
  {
    var row = Math.floor(pos.y * Tile.ISIZE.y),
        col = Math.floor(pos.x * Tile.ISIZE.x);
    return (o.isValid(row, col) ? o.grid[row][col] : null);
  }

  
  o.setBarren = function(mask, new_barren_value)
  {
    var tilepos = new V2();
    for(var row = 0; row < o.size.y; row++)
    for(var col = 0; col < o.size.x; col++)
    {
      tilepos.x = (col + 0.5) * Tile.SIZE.x;
      tilepos.y = (row + 0.5) * Tile.SIZE.y;
      if(tilepos.dist2(mask.pos) < Tile.DIAGONAL2 + mask.radius2)
        o.grid[row][col].barren = new_barren_value;
    }
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}