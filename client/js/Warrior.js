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

Warrior.STARVE_SPEED = 0.0005;
Warrior.EAT_SPEED = 0.02;
Warrior.EAT_THRESHOLD_IDLE = 0.5;
Warrior.EAT_THRESHOLD_GOTO = 0.2;
Warrior.EAT_THRESHOLD_FLEE = 0.1;
Warrior.SPAWN_ENERGY = 0.5;
Warrior.RANGE = 100;
Warrior.RANGE2 = Warrior.RANGE * Warrior.RANGE;
Warrior.MIN_ATTACK_DIST = Warrior.RANGE*2;
Warrior.MIN_ATTACK_DIST2 = Warrior.MIN_ATTACK_DIST * Warrior.MIN_ATTACK_DIST;

Warrior.ATTACK_DAMAGE = 0.01;

Warrior.objects = [];



function signedRand(value)
{
  var x = Math.random();
  return ((x < 0.5) ? value*2*x : value*2*(x-0.5));
}


function Warrior(pos, owner)
{
  /* RECEIVER */
  var o = new Unit(pos, owner, Warrior), typ = Warrior;
  
  // ATTRIBUTES
  // ---------------------------------------------------------------------------
  o.target = null;
  o.target_dist2 = Infinity;
  
  // METHODS
  // ---------------------------------------------------------------------------
  
  o.canTarget = function(enemy)
  {
    return(enemy != null && enemy.owner.id != o.owner.id 
            && enemy.transit == 0 && enemy.radius > 0);
  }
  
  o.acquireTarget = function(enemy)
  {
    // only interested in enemies
    if(!o.canTarget(enemy))
      return;
    
    var dist2 = o.pos.dist2(enemy.pos);
    if(o.target == null || o.target_dist2 > dist2)
    {
      o.target_dist2 = dist2;
      o.target = enemy;
    }
  }
  
  // STATES
  // ---------------------------------------------------------------------------
  
  o.stop_attack = function()
  {
    o.target = null;
    o.target_dist2 = Infinity;
    o.attacking = false;
    o.start_idle();
  }
  
  o.start_hunt = function()
  {
    // set out towards an enemy
    if(o.pos.dist2(o.target.pos) > o.radius2)
    {
      o.dir.setFromTo(o.pos, o.target.pos).normalise();
      o.state = o.hunt;
    }
    // break off attack
    else
      o.stop_attack();
  }
  
  o.start_attack = function()
  {
    o.attacking = true;
    o.state = o.attack;
  }
  
  o.hunt = function(delta_t)
  {
    // HUNT
    
    // stop if target is invalid
    if(!o.canTarget(o.target))
      o.stop_attack();
    
    // stop in range
    else if(o.pos.dist2(o.target.pos) <= typ.RANGE2)
      o.start_attack();
    
    // stop if too hungry or injured
    else if(o.energy.getBalance() < typ.EAT_THRESHOLD_FLEE)
      o.start_harvest();
    
    // recalculate direction if going the wrong way
    else if(!o.movingTo(o.target.pos))
      o.start_hunt(o.dest);

    // continue to destination
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
  }
  
  o.attack = function(delta_t)
  {
    // ATTACK
    
    // stop if target is invalid
    if(!o.canTarget(o.target) || o.pos.dist2(o.dest) > typ.RANGE2)
      o.stop_attack();
    
    // stop if too hungry or injured
    else if(o.energy.getBalance() < typ.EAT_THRESHOLD_FLEE)
      o.start_harvest();
    
    // attack the enemy
    else
    {
      o.target.energy.withdraw(typ.ATTACK_DAMAGE * delta_t);
      o.underAttack = true;
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
    
    // acquire target
    else if(o.target && (o.owner.id != local_player.id || o.target_dist2 < typ.MIN_ATTACK_DIST2))
      o.start_hunt();
  }
  
  o.draw_body = function()
  {
    context.fillStyle = owner.colour;
    context.strokeStyle = 'white';
    
    // SHOOT TARGET
    if(o.attacking)
    {
      var xvar = signedRand(4), yvar = signedRand(4);
      
      context.lineWidth = o.hradius;
      context.strokeLine(o.pos.x + xvar, o.pos.y + yvar, 
                         o.target.pos.x + xvar, o.target.pos.y + yvar);
      
      context.strokeStyle = owner.colour;
      context.lineWidth = 3;
      context.strokeLine(o.pos.x + xvar, o.pos.y + yvar, 
                         o.target.pos.x + xvar, o.target.pos.y + yvar);
      
      context.fillRect(o.target.pos.x - o.hradius + xvar, 
                       o.target.pos.y - o.hradius + yvar, 
                       o.radius, o.radius);
      
      context.strokeStyle = 'white';
      context.strokeRect(o.target.pos.x - o.hradius + xvar, 
                    o.target.pos.y - o.hradius + yvar, 
                    o.radius, o.radius);
    }
    
    context.strokeStyle = 'black';
    
    // DRAW BODY
    
    context.beginPath();
    context.moveTo(o.pos.x - o.radius, o.pos.y + o.radius - 3);
    context.lineTo(o.pos.x, o.pos.y - o.radius);
    context.lineTo(o.pos.x + o.radius, o.pos.y + o.radius - 3);
    context.closePath();
    context.fill(); 
    context.stroke();
    
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}

Warrior.acquireTargets = function(a, b)
{
  a.acquireTarget(b);
  b.acquireTarget(a);
}

Warrior.acquireTargetsOneWay = function(src, dest)
{
  src.acquireTarget(dest);
}