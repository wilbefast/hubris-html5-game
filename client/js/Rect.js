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

/// INSTANCE ATTRIBUTES/METHODS
function Rect(x_, y_, w_, h_)
{
  this.x = (x_ || 0);
  this.y = (y_ || 0);
  this.w = (w_ || 0);
  this.h = (h_ || 0);

  return this;
}

Rect.prototype.startAt = function(x_, y_)
{
  var dx = this.x - x_, 
      dy = this.y - y_;
  this.x = x_;
  this.y = y_;
  this.w += dx;
  this.h += dy;
  return this;
}

Rect.prototype.endAt = function(x_, y_)
{
  this.w = x_ - this.x;
  this.h = y_ - this.y;
  return this;
}

Rect.prototype.moveTo = function(x_, y_)
{
  this.x = x_;
  this.y = y_;
}

Rect.prototype.endx = function()
{
  return this.x + this.w;
}

Rect.prototype.endy = function()
{
  return this.y + this.h;
}

Rect.prototype.collides = function(other)
{
  var v1x = other.endx() - this.x, 
      v2x = this.endx() - other.x;
  if(v1x < 0 && v2x >= 0 || v1x > 0 && v2x <= 0)
    return false;
  
  var v1y = other.endy() - this.y, 
      v2y = this.endy() - other.y;
  if(v1y < 0 && v2y >= 0 || v1y > 0 && v2y <= 0)
    return false;   
  return true;
}

Rect.prototype.positive = function()
{
  if(this.w < 0)
  {
    this.w *= -1;
    this.x -= this.w;
  }
  if(this.h < 0)
  {
    this.h *= -1;
    this.y -= this.h;
  }
  return this;
}

Rect.prototype.draw = function(fill)
{
  if(fill)
    context.fillRect(this.x, this.y, this.w, this.h);
  else
    context.strokeRect(this.x, this.y, this.w, this.h);
  return this;
}

Rect.prototype.collapse = function()
{
  this.x = this.y = this.w = this.h = 0;
  return this;
}