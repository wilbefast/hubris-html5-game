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
  
  o.size = new V2(canvas.width / Tile.SIZE.x, canvas.height / Tile.SIZE.y);
  
  console.log(canvas);
  
  o.grid = new Array(o.size.y);
  for(var row = 0; row < o.size.y; row++)
  {
    o.grid[row] = new Array(o.size.x);
    for(var col = 0; col < o.size.x; col++)
      o.grid[row][col] = new Tile(row, col);
  }
  
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  o.draw = function()
  {
    for(var row = 0; row < o.size.y; row++)
    for(var col = 0; col < o.size.x; col++)
      o.grid[row][col].draw();
      
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}