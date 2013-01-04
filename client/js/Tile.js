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

Tile.SIZE = new V2(32, 32);
Tile.ISIZE = new V2().setV2(Tile.SIZE).inverse();
Tile.GROW_SPEED = 0.0003;

function resetColour(bank)
{
  var c = 255 - Math.round(255 * bank.getBalance());
  return 'rgb(' + c + ',' + c + ',200)';
}

/// INSTANCE ATTRIBUTES/METHODS
function Tile(row, col)
{
  /* RECEIVER */
  var o = this, typ = Tile;
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.gridpos = new V2(col, row);
  o.energy = new Bank(Math.random(), 0, 1);
  o.colour = resetColour(o.energy);
  
    
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    if(!o.energy.isFull())
    {
      o.energy.deposit(typ.GROW_SPEED * delta_t);
      o.colour = resetColour(o.energy);
    }
  }
  
  o.draw = function()
  {
    context.fillStyle = o.colour;
    context.fillRect(o.gridpos.x * typ.SIZE.x, o.gridpos.y * typ.SIZE.y, 
                       typ.SIZE.x, typ.SIZE.y);
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}