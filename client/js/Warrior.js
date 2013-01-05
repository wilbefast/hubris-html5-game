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

Warrior.STARVE_SPEED = 0.003;
Warrior.EAT_SPEED = 0.01;
Warrior.EAT_THRESHOLD_IDLE = 0.5;
Warrior.EAT_THRESHOLD_GOTO = 0.2;
Warrior.RANGE = 200;

Warrior.objects = [];

function Warrior(pos, owner)
{
  /* RECEIVER */
  var o = new Unit(pos, owner, Warrior), typ = Warrior;
  
  // ATTRIBUTES
  // ---------------------------------------------------------------------------
  o.nearest_enemy = null;
  o.nearest_dist2 = 0;
  
  // METHODS
  // ---------------------------------------------------------------------------
  o.checkIfNearest = function(new_enemy)
  {
    // only interested in enemies
    if(new_enemy.owner.id == id)
      return;
    
    var new_distance2 = o.pos.dist2(new_enemy.pos);
    if(o.nearest_enemy == null || o.nearest_dist2 > new_distance2)
    {
      o.nearest_dist2 = new_distance2;
      o.nearest_enemy = new_friend;
    }
  }
  
  // OVERIDES
  // ---------------------------------------------------------------------------
  o.idle = function(delta_t)
  {
    // IDLE
    
    // hungry while waiting
    if(o.energy.getBalance() < typ.EAT_THRESHOLD_IDLE)
      o.start_harvest();
    
    // aquire target
    else if(o.nearest_enemy)
      
  }
  
  o.draw_body = function()
  {
    context.fillStyle = owner.colour;
    
    context.beginPath();
    context.moveTo(o.pos.x - o.radius, o.pos.y + o.radius - 3);
    context.lineTo(o.pos.x, o.pos.y - o.radius);
    context.lineTo(o.pos.x + o.radius, o.pos.y + o.radius - 3);
    context.closePath();
    context.fill(); 
    context.stroke();
    
    if(o.nearest_enemy)
      context.strokeLine(o.pos.x, o.pos.y, o.nearest_enemy.x, o.nearest_enemy.y);
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}