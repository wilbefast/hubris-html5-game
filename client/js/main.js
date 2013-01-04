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

/* LAUNCH THE APPLICATION */

function update_loop()
{
  // deal with timing
  prev_tick = this_tick;
  this_tick = (new Date()).getTime();
  
  // update the Game
  Game.INSTANCE.injectUpdate((this_tick - prev_tick) / 1000 * Game.MAX_FPS);
  
  // redraw the Game
  Game.INSTANCE.injectDraw();
  
  // repeat this function after a short delay
  setTimeout(update_loop, 1000 / MAX_FPS);
}

function load_then_run()
{
  // make sure there isn't something left to load into memory
  if(left_to_load > 0)
  {
    // display a graphic to show how close the game is to being loaded
    loading_screen();
    // keep checking whether the game is loaded yet
    setTimeout("load_then_run()", 500);
  }
  // launch the application propre when ready
  else
  {
    this_tick = (new Date()).getTime();
    update_loop();
  }
}
load_then_run();
