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

/*** TIMER CLASS, for things which count down to zero ***/

/// INSTANCE ATTRIBUTES/METHODS
function Timer(starting_time, max_time, init_auto_reset)
{
  /* ATTRIBUTES 
    var a = x; 
  */
  
  // handles to provide C-style scoping
  var obj = this, typ = Timer;
  
  // other attributes
  var time = new Bank(starting_time, max_time, -1.0),
      auto_reset = (init_auto_reset == undefined ? false : init_auto_reset);
  
  /* PUBLIC METHODS 
  obj.f = function(p1, ... ) { } 
  */
  
  // query
  obj.getTime = function() { return time.getBalance(); } 
  obj.isSet = function() { return time.getBalance() >= 0.0; }
  
  // modification
  obj.reset = function(amount) { time.setFull(); }
  obj.unset = function() { time.setEmpty(); }
  
  // update
  obj.countdown = function(t_multiplier)
  { 
    // unset timers don't tend to ring
    if(!obj.isSet())
      return false;
    
    // count down the timer
    time.withdraw(t_multiplier)
    
    // otherwise, if time has run out
    if(!obj.isSet())
    {
      if(auto_reset)
        obj.reset();
      else
        obj.unset();
      
      // sound the alarm!
      return true;
    }
    else
      // timer continues to count down
      return false;
  }
  
  /* INITIALISE AND RETURN INSTANCE */
}