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

// check for a collision
function areColliding(a, b)
{
  return (a.pos.dist2(b.pos) < a.radius2 + b.radius2);
}

// generate a collision between two objects if applicable
function generateCollision(a, b)
{
  if(a != null && b != null && areColliding(a, b))
  {
    // generate collision
    a.collision(b);
    b.collision(a);
  }
}

// generate collisions between two arrays of dynamic objects
function generateObjectCollisions(obj_array1, obj_array2)
{
  for(var i = 0; i < obj_array1.length; i++)
  for(var j = 0; j < obj_array2.length; j++)
    generateCollision(obj_array1[i], b = obj_array2[j])
}

// draw dynamic objects
function drawObjects(obj_array)
{
  for(var i = 0; i < obj_array.length; i++)
  {
    var obj = obj_array[i];
    if(obj != null)
      obj.draw();
  }
}

// update dynamic objects (a variable number stored in an array)
function updateObjects(obj_array, delta_t, tween_functions, scenegraph)
{
  // array of indices of objects to be deleted
  var cleanUp = new Array();
  for(var i = 0; i < obj_array.length; i++)
  {
    var a = obj_array[i];
    // update objects, save update result
    var deleteThing = (a == null || a.update(delta_t));
    // delete object if the update returns true
    if(deleteThing)
    {
      obj_array[i] = null;
      // add to cleanup list ;)
      cleanUp.push(i);
      continue;
    }
    
    // perform each "tween" function on each pair of objects
    if(tween_functions) for(var f = 0; f < tween_functions.length; f++)
    {
      // for instance, generate collision events between objects if requested
      for(var j = i+1; j < obj_array.length; j++)
      {
        var b = obj_array[j];
        if (b != null)
          tween_functions[f](a, b);
      }
    }
    
    // allocate positions in the scenegraph
    if(scenegraph)
      a.setSceneNode(scenegraph.getSceneNode(a.pos));
  }
  // delete the indices in the cleanup list
  for(var i = 0; i < cleanUp.length; i++)
    obj_array.splice(cleanUp[i], 1);
}

// get an object at a position
function getObjectAt(pos, obj_array)
{
  for(var i = 0; i < obj_array.length; i++)
  {
    var object = obj_array[i];
    if(object.collidesPoint(pos))
      return object;   
  }
  return null;
}