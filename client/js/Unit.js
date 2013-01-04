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
function Unit(pos, radius)
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
  o.radius = radius;
  o.hradius = radius / 2;
  o.radius2 = radius * radius;
  o.selected = false;
  o.dest = new V2().setV2(pos);
  o.dir = new V2();
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  /* PUBLIC METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    // already arrived?
    if(o.pos.dist2(o.dest) < 1)
    {
      o.dest.setV2(pos);
      o.dir.setXY(0, 0);
    }
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
  }
  
  o.draw = function()
  {
    context.fillStyle = 'rgb(0,0,0)';
    if(o.selected)
      context.fillRect(o.pos.x - o.hradius, o.pos.y - o.hradius, o.radius, o.radius);
    else
      context.strokeRect(o.pos.x - o.hradius, o.pos.y - o.hradius, o.radius, o.radius);
  }
  
  o.collidesPoint = function(p)
  {
    if(o.pos.dist2(p) < o.radius2)
      return true;
  }
  
  o.setDestination = function(dest)
  {
    if(o.pos.dist2(dest) > o.radius2)
    {
      o.dest.setV2(dest);
      o.dir.setFromTo(o.pos, o.dest).normalise();
    }
    else
    {
      o.dest.setV2(o.pos);
      o.dir.setXY(0, 0);
    }
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}