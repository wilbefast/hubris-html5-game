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

/* INPUT STATE */

var input_events = [];
function poll_input_event()
{
  if(input_events.length != 0)
  {
    var result = input_events[0];
    input_events.shift();
    return result;
  }
  else
    return null;
}

var mouse =
{
  /* constants */
  LEFT 		: 0, 
  MIDDLE 	: 1, 
  RIGHT 	: 2,
  /* variables */
  pos 		: new V2(0, 0),
  held 		: [ false, false, false ],
  prev 		: [ false, false, false ]
}

var keyboard = 
{
  /* constants */
  // left keys
  LEFT 	: 37,
  A 		: 'A'.charCodeAt(0),		// qwerty + dvorak
  Q 		: 'Q'.charCodeAt(0),		// azerty
  // right keys
  RIGHT 	: 39,
  D 		: 'D'.charCodeAt(0),		// qwerty + azerty
  E 		: 'E'.charCodeAt(0),		// dvorak
  // up keys
  UP 		: 38,
  W 		: 'W'.charCodeAt(0),		// qwerty
  Z 		: 'Z'.charCodeAt(0),		// azerty
  COMMA 	: 1,				// dvorak
  // down keys
  DOWN 	: 40,
  S 		: 'S'.charCodeAt(0),		// qwerty + azerty
  O 		: 'O'.charCodeAt(0),		// dvorak
  // other keys
  ENTER 	: 13,
  SPACE 	: 32,
  
  /* variables */
  // key states
  left		: false,
  right		: false,
  up		: false,
  down		: false,
  space		: false,
  enter		: false,
  // abstract direction implied by arrow keys
  direction	: new V2(0, 0),
  // handler function
  set_state	: function(key, state)
  {
    // work out what the input is
    switch(key)
    {	  
      case this.LEFT: 	case this.A: 	case this.Q:	
        this.left = state; 	
      break;
      case this.RIGHT: 	case this.D: 	case this.E: 	
        this.right = state; 
      break;
      case this.UP: 	case this.W: 	case this.Z:	case this.COMMA:		
        this.up = state; 	
      break;
      case this.DOWN:	case this.S:	case this.O: 		
        this.down = state; 	
      break;
      case this.SPACE:		
        this.space = state; 
      break;
      case this.ENTER:
        this.enter = state;
      break;
    }
    
    // reset the direction based on input
    this.direction.x = (this.left && !this.right) ? -1 
        : ((!this.left && this.right) ? 1 : 0);
    this.direction.y = (this.up && !this.down) ? -1 
			  : ((!this.up && this.down) ? 1 : 0);
  }
}

/* INPUT HANDLING -- CANVAS */

canvas.onselectstart = function () { return false; }	// don't select text
canvas.onselect = function () { return false; }		// don't select text

canvas.onmousedown = function(event)
{
  // regain focus
  canvas.focus = true;
  
  // reset position
  mouse.pos.setXY(event.offsetX, event.offsetY);
  // reset button state
  mouse.prev[event.which] = mouse.held[event.which];
  mouse.held[event.which] = true;
  
  // save event
  input_events.push(event);
  
  // don't act on elements below
  event.stopPropagation();
  
  // don't select text
  return false;	
}

canvas.onmouseup = function(event)
{
  // reset position
  //--mouse.pos.setXY(event.pageX - canvas.offset.x, event.pageY - canvas.offset.y);
  mouse.pos.setXY(event.offsetX, event.offsetY);
  // reset button state
  mouse.prev[event.which] = mouse.held[event.which];
  mouse.held[event.which] = false;
  // save event
  input_events.push(event);
  // don't act on elements below
  event.stopPropagation();
  // don't select text
  return false;	
}

canvas.onmousemove = function(event)
{
  // reset position
  mouse.pos.setXY(event.pageX - canvas.offset.x, event.pageY - canvas.offset.y);
  // don't act on elements below
  event.stopPropagation();
}

var mousewheel = function(event)
{
  // inter-browser compatibility
  var event = window.event || event;
  var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
  
  // don't act on elements below
  event.stopPropagation();
}
// more inter-browser compatibility
canvas.addEventListener("DOMMouseScroll", mousewheel, false);
canvas.addEventListener("mousewheel", mousewheel, false);


/* INPUT HANDLING -- WINDOW */

window.onkeydown = function(event) 
{ 
  keyboard.set_state(event.keyCode, true);
  // save event
  input_events.push(event);
  // don't act on elements below
  event.stopPropagation();
}

window.onkeyup = function(event)
{ 
  keyboard.set_state(event.keyCode, false);
  // save event
  input_events.push(event);
  // don't act on elements below
  event.stopPropagation();
  // send to game
}

/* INPUT HANDLING -- DOCUMENT */

document.onmousedown = function(e) 
{ 
  canvas.focus = false;
}
