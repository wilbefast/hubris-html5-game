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

"use strict";

Unit.STARVE_SPEED = 0.003;
Unit.EAT_SPEED = 0.01;
Unit.EAT_THRESHOLD = 0.5;

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
  
  //! POSITION -----------------------------------------------------------------
  o.pos = new V2().setV2(pos);
  o.radius = radius;
  o.hradius = radius / 2;
  o.radius2 = radius * radius;
  o.dest = new V2().setV2(pos);
  o.dir = new V2();
  o.tile = null;
  
  //! RESOURCES ----------------------------------------------------------------
  o.energy = new Bank(0.5, 0, 1);
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
  
  var bound = function(v)
  {
    var bounded = false;
    if(v.x < o.radius) 
    {
      v.x = o.radius;
      bounded = true;
    }
    
    if(v.y < o.radius) 
    {
      v.y = o.radius;
      bounded = true;
    }
    
    if(v.x > canvas.width - o.radius) 
    {
      v.x = canvas.width - o.radius;
      bounded = true;
    }
    
    if(v.y > canvas.height - o.radius) 
    {
      v.y = canvas.height - o.radius;
      bounded = true;
    }
    return bounded;
  }
    
  var start_idle = function()
  {
    o.dest.setV2(pos);
    o.dir.setXY(0, 0);
    o.state = idle;
  }
  
  var start_harvest = function()
  {
    o.dest.setV2(pos);
    o.dir.setXY(0, 0);
    
    o.state = harvest;
  }
  
  var start_wander = function()
  {
    o.dir.randomDir().normalise();
    o.dest.setV2(o.dir).scaleV2(Tile.SIZE).addV2(o.pos);
    o.state = wander;
  }
  
  var start_goto = function(dest)
  {
    if(o.pos.dist2(dest) > o.radius2)
    {
      o.dest.setV2(dest);
      bound(o.dest);
      o.dir.setFromTo(o.pos, o.dest).normalise();
      o.state = goto;
    }
    else
      start_idle();
  }
  
  var idle = function(delta_t)
  {
    // IDLE
    
    // hungry while waiting
    if(o.energy.getBalance() < typ.EAT_THRESHOLD)
      start_harvest();
  }
 
  var harvest = function(delta_t)
  {
    //HARVEST
    
    // if no longer hungry, stop eating
    if(o.energy.isFull())
      start_idle();
    
    // keep eating until full
    else
    {
      // try to eat something
      var could_eat = delta_t * typ.EAT_SPEED,
          can_eat = o.tile.energy.withdraw(could_eat);
      o.energy.deposit(can_eat);
      
      // search for more food if none is around
      if(o.energy.isFull())
        start_idle();
      else if(can_eat < could_eat)
        start_wander();
    }
  }
 
  var wander = function(delta_t)
  {
    // WANDER
    
    // search out something to eat
    if(o.pos.dist2(o.dest) > 1)
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
    
    // start eating again at destination
    else
      start_harvest();
  }
  
  var goto = function(delta_t)
  {
    // GOTO
    if(o.pos.dist2(o.dest) < 1)
      start_idle();
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
  }
  
  //! ARTIFICIAL INTELLIGENCE --------------------------------------------------
  o.state = wander;
    
    
  /* PUBLIC METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    // RESOURCES -- get hungry
    o.energy.withdraw(typ.STARVE_SPEED * delta_t);
    
    // PHYSICS -- check if crossing boundary or arried at destination
    if(bound(o.pos))
      start_idle();
    
    // ARTIFICIAL INTELLIGENCE -- do whatever the state requires
    o.state(delta_t);
    
    // die if energy is empty
    return o.energy.isEmpty();
  }
  
  o.draw = function()
  {
    // draw body and full part of energy bar
    context.fillStyle = local_player.colour;
    context.fillCircle(o.pos.x, o.pos.y, o.radius);
    context.fillRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius * o.energy.getBalance(), 10);
    
    // draw empty part of energy bar
    context.fillStyle = 'white';
    context.fillRect(o.pos.x - o.hradius + o.radius * o.energy.getBalance(), 
                       o.pos.y + o.radius, o.radius * (1 - o.energy.getBalance()), 10);
    
    // draw body outline
    context.strokeStyle = 'white';
    context.strokeCircle(o.pos.x, o.pos.y, o.radius);
    
    // draw energy bar outline
    context.fillStyle = 'black';
    context.strokeRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius, 10);
    
    // draw direction
    if(o.dir.x != 0 || o.dir.y != 0)
      context.strokeLine(o.pos.x, o.pos.y, o.dest.x, o.dest.y);
  }
  
  o.collidesPoint = function(p)
  {
    if(o.pos.dist2(p) < o.radius2)
      return true;
  }
  
  o.goto = function(dest)
  {
    start_goto(dest);
  }
  
  o.setSceneNode = function(scenenode)
  {
    o.tile = scenenode;
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}