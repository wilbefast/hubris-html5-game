/** @author William J.D. **/

/*
Hubris HTML5 game
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

/// INSTANCE ATTRIBUTES/METHODS
function Unit(pos)
{
  /* RECEIVER */
  var o = this, typ = Unit;
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  
  /* PUBLIC ATTRIBUTES
    o.b = y;
  */
  o.pos = new V2().setV2(pos);
  o.selected = false;
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  /* PUBLIC METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    o.pos.x += (Math.random() - Math.random())*delta_t;
    o.pos.y += (Math.random() - Math.random())*delta_t;
  }
  
  o.draw = function()
  {
    context.fillStyle = 'rgb(0,0,0)';
    if(o.selected)
      context.fillRect(o.pos.x - 8, o.pos.y - 8, 16, 16);
    else
      context.strokeRect(o.pos.x - 8, o.pos.y - 8, 16, 16);
  }
  
  o.collidesPoint = function(pos)
  {
    if(o.pos.dist2(pos) < 500)
      o.selected = !o.selected;
    else
      console.log(o.pos.dist2(pos));
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}