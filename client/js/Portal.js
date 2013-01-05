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

/** PORTAL LINKING TWO PLAYERS **/

Portal.OPEN_SPEED = 0.6;
Portal.RADIUS = 32;

/// INSTANCE ATTRIBUTES/METHODS
function Portal(pos, owner)
{
  /* RECEIVER */
  var o = this, typ = Portal;
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  var closed = false;
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.setRadius = function(radius)
  {
    o.radius = radius;
    o.radius1third = o.radius/3;
    o.radius2thirds = o.radius1third*2;
    o.radius2 = o.radius * o.radius;
  }
  o.pos = new V2().setV2(pos);
  o.setRadius(1);

  boundObject(o);
  
  o.owner = owner;
    
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    // become smaller until it disappears
    if(closed)
    {
      o.setRadius(o.radius - typ.OPEN_SPEED * delta_t);
      if(o.radius < 0)
        return true;
    }
    
    // become larger until it opens
    else if(o.radius < typ.RADIUS)
      o.setRadius(o.radius + typ.OPEN_SPEED * delta_t);
    else if(o.radius > typ.RADIUS)
      o.setRadius(typ.RADIUS);
    
    // don't destroy the portal for now
    return false;
  }
  
  o.draw = function()
  {
    context.fillStyle = o.owner.colour;
    context.fillCircle(o.pos.x, o.pos.y, o.radius);
    context.strokeStyle = 'white';
    context.strokeCircle(o.pos.x, o.pos.y, o.radius1third);
    context.strokeCircle(o.pos.x, o.pos.y, o.radius2thirds);
  }
  
  o.close = function()
  {
    closed = true;
  }
  
  o.collision = function() { /* do nothing */ }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}