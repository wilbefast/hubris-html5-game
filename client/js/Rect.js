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

/** TEMPLATE FOR CLASSES **/


/// INSTANCE ATTRIBUTES/METHODS
function Rect(x, y, w, h)
{
  /* RECEIVER */
  var o = this, typ = Rect;
  
  /* PRIVATE ATTRIBUTES 
    var a = x; 
  */
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  o.x = (x || 0);
  o.y = (y || 0);
  o.w = (w || 0);
  o.h = (h || 0);
  
  
  /* PRIVATE METHODS 
  var f = function(p1, ... ) { } 
  */
    
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}