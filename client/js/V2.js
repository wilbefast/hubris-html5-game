/** @author William J.D. **/

/*
HTML5 base code
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

/*** 2D Vector CLASS ***/

/// INSTANCE ATTRIBUTES/METHODS
function V2(init_x, init_y)
{
  /* RECEIVER */
  var obj = this, typ = V2;
  
  /* PUBLIC ATTRIBUTES */
  obj.x = (init_x || 0.0);
  obj.y = (init_y || 0.0);
  
  
  /* METHODS 
  (obj.f = function(p1, ... ) { }
  */
  
  obj.norm = function()
  {
    return (obj.x == 0) ? Math.abs(obj.y) 
                    : ((obj.y == 0) ? Math.abs(obj.x) 
                                : Math.sqrt(obj.x*obj.x + obj.y*obj.y));
  }
  
  obj.norm2 = function()
  {
    return (obj.x*obj.x + obj.y*obj.y);
  }
  
  // setters
  
  obj.randomDir = function()
  {
    obj.x = Math.random() - Math.random();
    obj.y = Math.random() - Math.random();
    obj.normalise();
    return obj;
  }
  
  obj.setXY = function(x, y)
  {
    obj.x = x;
    obj.y = y;
    return obj;
  }
  
  obj.setV2 = function(v)
  {
    obj.x = v.x;
    obj.y = v.y;
    return obj;
  }
  
  obj.setFromTo = function(v, w)
  {
    if(v.x == w.x && v.y == w.y)
      obj.randomDir();
    else
    {
      obj.x = w.x - v.x;
      obj.y = w.y - v.y;
    }
    return obj;
  }
  
  obj.setNorm = function(new_norm)
  {
    if(new_norm <= 0.0)
      obj.x = obj.y = 0.0;
    else
    {
      obj.normalise();
      obj.x *= new_norm;
      obj.y *= new_norm;
    }
    return obj;
  }
  
  // modification
  obj.ninety_left = function()
  {
    obj.x = obj.y;
    obj.y = -obj.x;
    return obj;
  }
  
  obj.ninety_right = function()
  {
    obj.x = -obj.y;
    obj.y = obj.x;
    return obj;
  }
  
  obj.addXY = function(x, y)
  {
    obj.x += x;
    obj.y += y;
    return obj;
  }
  
  obj.addV2 = function(v)
  {
    obj.x += v.x;
    obj.y += v.y;
    return obj;
  }
  
  obj.subV2 = function(v)
  {
    obj.x -= v.x;
    obj.y -= v.y;
    return obj;
  } 
  
  obj.scale = function(amount)
  {
    obj.x *= amount;
    obj.y *= amount;
    return obj;
  }
  
  obj.scaleV2 = function(v)
  {
    obj.x *= v.x;
    obj.y *= v.y;
    return obj;
  }
  
  obj.inverse = function()
  {
    obj.x = 1/obj.x;
    obj.y = 1/obj.y;
    return obj;
  }
  
  obj.addNorm = function(amount)
  {
    obj.setNorm(norm + amount);
    return obj;
  }
  
  obj.normalise = function()
  {
    var norm = obj.norm();
    
    var norm_inv = 1.0 / norm;
    obj.x *= norm_inv;
    obj.y *= norm_inv;
    
    return norm;
  }
  
  obj.addAngle = function(theta)
  {
    var cos_theta = Math.cos(theta),
        sin_theta = Math.sin(theta);
    obj.x = obj.x*cos_theta - obj.y*sin_theta;
    obj.y = obj.x*sin_theta + obj.y*cos_theta;
    return obj;
  }
  
  // mathematics
  obj.dot = function(v)
  {
    return obj.x*v.x + obj.y*v.y;
  } 
  
  obj.det = function(v)
  {
    return obj.x*v.y - obj.y*v.x;
  }
  
  obj.dist2 = function(v)
  {
    var dx = v.x - obj.x, 
        dy = v.y - obj.y;
        
    return dx*dx + dy*dy;
  }
  
  obj.dist = function(v)
  {
    var dx = v.x - obj.x, 
        dy = v.y - obj.y;
        
    return Math.sqrt(dx*dx + dy*dy);
  }
  
  obj.coline = function(v)
  {
    // cosine of 0 is 1, so v1 and v2 are colinear if v1.v2 = 1*|v1|*|v2|
    return (obj.dot(v) == obj.norm()*v.norm());
  }

  /* RETURN INSTANCE */
  return obj;
}