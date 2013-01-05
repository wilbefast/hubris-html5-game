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
Unit.EAT_THRESHOLD_IDLE = 0.5;
Unit.EAT_THRESHOLD_GOTO = 0.2;

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
  
  //! ARTIFICIAL INTELLIGENCE --------------------------------------------------
  o.wander_timer = new Timer(60);
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  var start_idle = function()
  {
    o.dest.setV2(o.pos);
    o.dir.setXY(0, 0);
    o.state = idle;
  }
  
  var start_harvest = function()
  {
    o.dir.setXY(0, 0);
    o.state = harvest;
  }
  
  var start_wander = function()
  {
    o.dir.randomDir().normalise();
    o.state = wander;
    o.wander_timer.reset();
  }
  
  var start_goto = function(dest)
  {
    // set out towards a distant location
    if(o.pos.dist2(dest) > o.radius2)
    {
      o.dest.setV2(dest);
      o.dir.setFromTo(o.pos, o.dest).normalise();
      o.state = goto;
    }
    // cancel if we've already arrived
    else
      start_idle();
  }
  
  var idle = function(delta_t)
  {
    // IDLE
    
    // hungry while waiting
    if(o.energy.getBalance() < typ.EAT_THRESHOLD_IDLE)
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
      
      // stop if energy if full
      if(o.energy.isFull())
      {
        // continue towards destination 
        if(o.pos.dist2(o.dest) > o.radius2)
          start_goto(o.dest);
        else
          start_idle();
      }
      // search for more food if none is around
      else if(can_eat < could_eat)
        start_wander();
    }
  }
 
  var wander = function(delta_t)
  {
    // WANDER
    
    // stop to eat when timer runs out
    if(o.wander_timer.countdown(delta_t))
      start_harvest();
    
    // stop to eat if there's food to be had
    else if(o.tile && o.tile.energy.getBalance() > typ.EAT_THRESHOLD_IDLE)
      start_harvest();
    
    // search out something to eat
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
  }
  
  var goto = function(delta_t)
  {
    // GOTO
    
    // stop at destination
    if(o.pos.dist2(o.dest) < 1)
      start_idle();
    
    // stop if too hungry
    else if(o.energy.getBalance() < typ.EAT_THRESHOLD_GOTO)
      start_harvest();
    
    // recalculate direction if going the wrong way
    else if(!o.movingToDest())
      start_goto(o.dest);

    // continue to destination
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t); 

  }
  
  //! ARTIFICIAL INTELLIGENCE --------------------------------------------------
  o.state = wander;
  o.wander_timer = new Timer(60, 60);
  
  
  //! --------------------------------------------------------------------------
    
    
  /* PUBLIC METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    // RESOURCES -- get hungry
    o.energy.withdraw(typ.STARVE_SPEED * delta_t);
    
    // PHYSICS -- check if crossing boundary or arried at destination
    if(boundObject(o))
      start_idle();
    
    // ARTIFICIAL INTELLIGENCE -- do whatever the state requires
    o.state(delta_t);
    
    // die if energy is empty
    return o.energy.isEmpty();
  }
  
  o.movingToDest = function()
  {
    return (o.dir.dot(new V2().setFromTo(o.pos, o.dest)) > 0);
  }
  
  o.draw = function()
  {
    // draw direction
    if(o.movingToDest())
    {
      context.strokeStyle = local_player.colour;
      context.strokeLine(o.pos.x, o.pos.y, o.dest.x, o.dest.y);
    }
    
    // draw body and full part of energy bar
    context.fillStyle = local_player.colour;
    context.fillCircle(o.pos.x, o.pos.y, o.radius);
    context.fillRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius * o.energy.getBalance(), 10);
    
    // draw empty part of energy bar
    context.fillStyle = 'white';
    context.fillRect(o.pos.x - o.hradius + o.radius * o.energy.getBalance(), 
                       o.pos.y + o.radius, o.radius * (1 - o.energy.getBalance()), 10);
    
    // draw body and energy bar outline
    context.strokeStyle = 'black';
    context.strokeCircle(o.pos.x, o.pos.y, o.radius);
    context.strokeRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius, 10);
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
  
  o.collision = function(other)
  {
    // collision with other units
    
    var manifold = new V2().setFromTo(other.pos, o.pos);
    manifold.normalise();
    o.pos.addV2(manifold);
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}