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

/// INSTANCE ATTRIBUTES/METHODS
function Portal(pos)
{
  /* RECEIVER */
  var o = this, typ = Portal;
  
  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.pos = new V2().setV2(pos);
    
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  
  /* INITIALISE AND RETURN INSTANCE */
  return o;
}