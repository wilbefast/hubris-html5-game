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

Unit.STARVE_SPEED = 0.001;
Unit.EAT_SPEED = 0.003;
Unit.EAT_THRESHOLD_IDLE = 0.8;
Unit.EAT_THRESHOLD_GOTO = 0.2;
Unit.SPAWN_ENERGY = 0.1;

Unit.objects = [];

var UNIT_RADIUS = 16,
    TRANSIT_SPEED = 0.8;

/// INSTANCE ATTRIBUTES/METHODS
function Unit(pos, owner, subtype)
{
  /* RECEIVER */
  var o = this, typ = (subtype == undefined) ? Unit : subtype;
  typ.objects.push(o);
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  
  /* PUBLIC ATTRIBUTES
    o.b = y;
  */
  
  o.setRadius = function(r)
  {
    o.radius = r;
    o.radius2 = r * r;
    o.hradius = r * 0.5;
  }
  
  //! POSITION -----------------------------------------------------------------
  o.pos = new V2().setV2(pos);
  o.setRadius(UNIT_RADIUS);
  o.dest = new V2().setV2(pos);
  o.dir = new V2();
  o.tile = null;
  
  //! RESOURCES ----------------------------------------------------------------
  o.energy = new Bank(typ.SPAWN_ENERGY, 0, 1);
  
  //! OTHER ----------------------------------------------------------------
  o.owner = owner;
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  o.start_idle = function()
  {
    o.dest.setV2(o.pos);
    o.dir.setXY(0, 0);
    o.state = o.idle;
  }
  
  o.start_harvest = function()
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
      o.start_idle();
  }
  
  o.start_transit = function(direction)
  {
    o.dest.setV2(o.pos);
    o.dir.setXY(0, 0);
    o.state = teleport;
    o.transit = direction;
  }
  
  o.idle = function(delta_t)
  {
    // IDLE
    
    // hungry while waiting
    if(o.energy.getBalance() < typ.EAT_THRESHOLD_IDLE)
      o.start_harvest();
  }
 
  var harvest = function(delta_t)
  {
    //HARVEST
    
    // if no longer hungry, stop eating
    if(o.energy.isFull())
      o.start_idle();
    
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
          o.start_idle();
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
      o.start_harvest();
    
    // stop to eat if there's food to be had
    else if(o.tile && o.tile.energy.getBalance() > typ.EAT_THRESHOLD_IDLE)
      o.start_harvest();
    
    // search out something to eat
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
  }
  
  var goto = function(delta_t)
  {
    // GOTO
    
    // stop at destination
    if(o.pos.dist2(o.dest) < 1)
      o.start_idle();
    
    // stop if too hungry
    else if(o.energy.getBalance() < typ.EAT_THRESHOLD_GOTO)
      o.start_harvest();
    
    // recalculate direction if going the wrong way
    else if(!o.movingToDest())
      start_goto(o.dest);

    // continue to destination
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t); 

  }
  
  var teleport = function(delta_t)
  {
    // inbound
    if(o.transit > 0)
    {
      if(o.radius + TRANSIT_SPEED > UNIT_RADIUS)
      {
        o.setRadius(UNIT_RADIUS);
        o.transit = 0;
        
        // move to random position if foreign
        if(o.owner.id != local_player.id)
          start_goto(random_position());
        else
          o.start_idle();
      }
      else
        o.setRadius(o.radius + TRANSIT_SPEED)
    }
    
    // outbound
    else if(o.transit < 0)
      o.setRadius(o.radius - TRANSIT_SPEED)
  }
  
  //! ARTIFICIAL INTELLIGENCE --------------------------------------------------
  o.setRadius(0); 
  o.state = teleport;
  o.transit = 1;
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
      o.start_idle();
    
    // ARTIFICIAL INTELLIGENCE -- do whatever the state requires
    o.state(delta_t);
    
    // die if energy is empty
    if(o.energy.isEmpty())
      o.start_transit(-1);
    
    return (o.radius < 0);
  }
  
  o.movingToDest = function()
  {
    return (o.dir.dot(new V2().setFromTo(o.pos, o.dest)) > 0);
  }
  
  o.draw_body = function()
  {
    context.fillStyle = owner.colour;
    context.fillCircle(o.pos.x, o.pos.y, o.radius);
    context.strokeCircle(o.pos.x, o.pos.y, o.radius);
  }
  
  o.draw = function()
  {
    context.fillStyle = owner.colour;
    
    // draw direction only if friendly
    if(o.owner.id == local_player.id && o.movingToDest())
    {
      context.strokeStyle = owner.colour;
      context.fillCircle(o.dest.x, o.dest.y, 6);
      context.strokeLine(o.pos.x, o.pos.y, o.dest.x, o.dest.y);
    }
    
    // draw full part of energy bar
    context.fillRect(o.pos.x - o.hradius, o.pos.y + o.radius, 
                     o.radius * o.energy.getBalance(), o.hradius);
    
    // draw empty part of energy bar
    context.fillStyle = 'black';
    context.fillRect(o.pos.x - o.hradius + o.radius * o.energy.getBalance(), 
                      o.pos.y + o.radius, 
                      o.radius * (1 - o.energy.getBalance()), o.hradius);
    
    // draw energy bar outline
    context.strokeStyle = 'black';
    context.strokeRect(o.pos.x - o.hradius, o.pos.y + o.radius, 
                       o.radius, 
                       o.hradius);
    
    // draw the body
    o.draw_body();

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
    if(other instanceof Unit)
    {
      var manifold = new V2().setFromTo(other.pos, o.pos);
      manifold.normalise();
      o.pos.addV2(manifold);
    }
    
    // collision with portals
    else if(other instanceof Portal)
    {
      if(o.dest.dist2(other.pos) < other.radius2 
        && o.transit == 0 
        && o.energy.getBalance() > typ.EAT_THRESHOLD_GOTO)
      {
        Game.INSTANCE.sendThroughPortal(o, other);
        o.pos.setV2(other.pos);
        o.start_transit(-1); // leave through portal
      }
    }
  }
  
  o.arrive = function()
  { 
    o.setRadius(0); 
    o.start_transit(1); // arrive through portal
  }
  
  o.getType = function()
  {
    return typ;
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}