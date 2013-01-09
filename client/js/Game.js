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

/*** GAME CLASS ***/

/// CLASS VARIABLES/CONSTANTS
Game.MAX_FPS = 60;

/// INSTANCE ATTRIBUTES/METHODS

function Game()
{
  /* RECEIVER */
  var o = this, typ = Game;

  /* PUBLIC ATTRIBUTES 
    o.b = y; 
  */
  
  o.grid = new Tilegrid(new V2(32, 32));
  
  o.portals = [];
  
  // create one unit for the local player
  new Unit(new V2(canvas.width * 0.5, canvas.height * 0.5), local_player);
  
  // create selection box
  o.selection_box = new Rect();
  o.selected = [];
    
  /* PRIVATE METHODS */
  
  var isMine = function(o)
  {
    return o.owner.id == local_player.id;
  }
  
  var treatEvent = function(event)
  {
    switch(event.type)
    {
      case "mousedown":
        switch(event.button)
        {
          case 0: // left
            
            // move selection box
            o.selection_box.moveTo(mouse.pos.x, mouse.pos.y);
            
            // select a warrior?
            /*var touched = getObjectAt(mouse.pos, Warrior.objects, isMine);
            
            // select a civillian?
            if(!touched)
              touched = getObjectAt(mouse.pos, Unit.objects, isMine);*/
            break;
            
            
            
          case 2: // right
            
            
            /* PROMOTE A CIVILLIAN */
            var touched = getObjectAt(mouse.pos, Unit.objects, isMine);
            if(touched)
            {
              // promote a civillian?
              if(touched.energy.getBalance() > Unit.ENERGY_TO_TRANSFORM)
              {
                touched.start_transit(-1);
                var w = new Warrior(touched.pos, local_player); // auto-stored
                w.energy.deposit((touched.energy.getBalance() - Unit.ENERGY_TO_TRANSFORM) * 0.5);
                
              }
            }
            
            /* SPLIT A WARRIOR */
            else if(touched = getObjectAt(mouse.pos, Warrior.objects, isMine))
            {
              // delete a warrior?
              if(touched)
              {
                touched.start_transit(-1);
                var u1 = new Unit(touched.pos, local_player),
                    u2 = new Unit(touched.pos, local_player),
                    bonus = (touched.energy.getBalance() - Warrior.ENERGY_TO_TRANSFORM);
                u1.energy.deposit(bonus);
                u2.energy.deposit(bonus);
              }
            }
            
            /* ISSUE AN ORDER */
            else
            {
              // tell all selected units to move
              for(var i = 0; i < o.selected.length; i++)
                o.selected[i].goto(mouse.pos);
            }
            
            break;
        }
        break;
        
      case "mouseup":
        switch(event.button)
        {
          case 0:
            /*if(o.selected)
            {
              o.selected.goto(mouse.pos);
              o.selected = null;
            }*/
            
            // deselect previous units
            for(var i = 0; i < o.selected.length; i++) if(o.selected[i])
              o.selected[i].selected = false;
            o.selected.shift(o.selected.length);
            
            // calculate selection area
            o.selection_box.positive();
            
            // drag-selection?
            if(o.selection_box.w != 0 || o.selection_box.h != 0)
            {
              for(var i = 0; i < Unit.objects.length; i++)
              {
                var u = Unit.objects[i];
                if(u && insideBox(u, o.selection_box))
                {
                  u.selected = true;
                  o.selected.push(u);
                }
              }
              
              for(var i = 0; i < Warrior.objects.length; i++)
              {
                var w = Warrior.objects[i];
                if(w && insideBox(w, o.selection_box))
                {
                  w.selected = true;
                  o.selected.push(w);
                }
              }
              
              o.selection_box.collapse();
            }
            // click-unclick?
            else
            {
              var touched = getObjectAt(mouse.pos, Warrior.objects, isMine)
              if(touched)
              {
                touched.selected = true;
                o.selected.push(touched);
              }
              else if(touched = getObjectAt(mouse.pos, Unit.objects, isMine))
              {
                touched.selected = true;
                o.selected.push(touched);
              }
            }
            
            break;
            
            
            
          case 1:
            break;
        }
        break;
        
      case "keydown":
        break;
        
      case "keyup":
        break;

    }
  }
  
  /* PUBLIC METHODS 
  (o.f = function(p1, ... ) { }
  */
  o.injectUpdate = function(delta_t)
  { 
    if(!canvas.focus)
      return;
    
    // update objects
    updateObjects(Unit.objects, delta_t, [ generateCollision ], o.grid);
    updateObjects(Warrior.objects, delta_t, 
                  [ generateCollision, Warrior.acquireTargets ], o.grid);
    updateObjects(o.portals, delta_t);
    
    // generate collisions between units and portals
    tweenObjects(Warrior.objects, o.portals, [ generateCollision ]);
    
    // acquire civillian targets too
    tweenObjects(Warrior.objects, Unit.objects, [ generateCollision, 
                                                  Warrior.acquireTargetsOneWay ]);
     
    // update grid
    o.grid.update(delta_t);
    
    // select units
    var event = poll_input_event();
    if(event)
    do
    {
      treatEvent(event);
    }
    while(event = poll_input_event());
    
    // modify selection box
    if(mouse.held[mouse.LEFT])
      o.selection_box.endAt(mouse.pos.x, mouse.pos.y);
  }
 
  o.injectDraw = function()
  {
    // don't refresh screen if focus has been lost
    if(!canvas.focus)
      return;

    // clear canvas
    context.fillStyle = "rgb(200, 200, 200)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw grid
    o.grid.draw();
    
    // fat lines
    context.lineWidth = 3;
    
    // draw portals
    drawObjects(o.portals);
    
    // draw a preview of the command
    /*context.strokeStyle = context.fillStyle = local_player.colour;
    if(o.selected)
    {
      context.strokeLine(o.selected.pos.x, o.selected.pos.y, mouse.pos.x, mouse.pos.y);
      context.fillCircle(mouse.pos.x, mouse.pos.y, 6);
    }*/
    
    // draw units
    drawObjects(Warrior.objects);
    drawObjects(Unit.objects);

    // draw selection box
    context.strokeStyle = local_player.colour;
    o.selection_box.draw(false);
  }
  
  o.idToPortal = function(id)
  {
    for(var i = 0; i < o.portals.length; i++)
      if(o.portals[i].owner.id == id)
        return o.portals[i];
    return null;
  }
  
  o.openPortal = function(player)
  {
    // create the portal
    var p = new Portal(random_position(), player);
    o.portals.push(p);
    
    // make the area around it barren
    o.grid.setBarren(p, true);
  }
  
  o.closePortal = function(player)
  {
    var p = o.idToPortal(player.id);
    p.close();
    o.grid.setBarren(p, false);
  }
  
  o.receiveThroughPortal = function(packet)
  {
    var p = o.idToPortal(packet.src),
        u = new window[packet.class](p.pos, p.owner);
    u.energy.setBalance(packet.energy);
    u.arrive();
  }
  
  o.sendThroughPortal = function(unit, portal)
  {
    var packet = 
    {
      type : 'unit', 
      class : unit.getType().name,
      energy : unit.energy.getBalance().toFixed(2), 
      src : local_player.id,
      dest : portal.owner.id
    };
    
    // TODO conserve units team, not where it came from
    
    
    websocket.send(JSON.stringify(packet));
  }

  /* INITIALISE AND RETURN INSTANCE */
  return o;
}

Game.INSTANCE = new Game();