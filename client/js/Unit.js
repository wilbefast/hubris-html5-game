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

Unit.STARVE_SPEED = 0.003;
Unit.EAT_SPEED = 0.9;
Unit.EAT_THRESHOLD = 0.2;

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
    
  /* PUBLIC METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  o.update = function(delta_t)
  {
    // check if crossing boundary or arried at destination
    if(bound(o.pos) || o.pos.dist2(o.dest) < 1)
    {
      o.dest.setV2(pos);
      o.dir.setXY(0, 0);
    }
    // otherwise move towards destination
    else
      o.pos.addXY(o.dir.x * delta_t, o.dir.y * delta_t);
     
    // consume energy
    o.energy.withdraw(delta_t * typ.STARVE_SPEED);
    
    // refill energy
    if(((o.dir.x == 0 && o.dir.y == 0) || o.energy.getBalance() < typ.EAT_THRESHOLD) 
      && o.tile)
    {
      // stop moving
      o.dest.setV2(pos);
      o.dir.setXY(0, 0);
      
      
      var could_eat = delta_t * typ.EAT_SPEED,
          can_eat = o.tile.energy.withdraw(could_eat);
      o.energy.deposit(can_eat);
      
      if(can_eat < could_eat && o.dir.x == 0 && o.dir.y == 0)
      {
        o.dir.randomDir();
        o.dest.setV2(o.dir).scaleV2(Tile.SIZE).addV2(o.pos);
      }
    }
    
  }
  
  o.draw = function()
  {
    context.fillStyle = 'rgb(255,255,255)';
    context.fillCircle(o.pos.x, o.pos.y, o.radius);
    
    context.strokeStyle = 'rgb(0,0,0)';
    context.strokeCircle(o.pos.x, o.pos.y, o.radius);
    
    context.strokeRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius, 10);
    context.fillStyle = 'rgb(0,200,200)';
    context.fillRect(o.pos.x - o.hradius, o.pos.y + o.radius, o.radius * o.energy.getBalance(), 10);
    
    if(o.dir.x != 0 || o.dir.y != 0)
      context.strokeLine(o.pos.x, o.pos.y, o.dest.x, o.dest.y);
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
      bound(o.dest);
      o.dir.setFromTo(o.pos, o.dest).normalise();
    }
    else
    {
      o.dest.setV2(o.pos);
      o.dir.setXY(0, 0);
    }
  }
  
  o.setSceneNode = function(scenenode)
  {
    o.tile = scenenode;
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}