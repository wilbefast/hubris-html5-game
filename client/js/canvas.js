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

/* CANVAS STATE VARIABLES */

// focus
canvas.focus = true;

// offset
var element_offset = function(element)
{
  var ox = 0, oy = 0;
  if (element.offsetParent) 
  {
    do 
    {
      ox += element.offsetLeft;
      oy += element.offsetTop;
    } 
    while (element = element.offsetParent);
    
    return { x: ox, y: oy };
  }
  else
    return undefined;
}
canvas.offset = element_offset(canvas);