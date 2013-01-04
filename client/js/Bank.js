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

/*** BOUNDED CLASS a numeric value with a maximum capacity to deposit/withdraw ***/

/// INSTANCE ATTRIBUTES/METHODS
function Bounded(starting_balance, max_balance, min_balance)
{
  /* ATTRIBUTES 
    var a = x; 
  */
  
  // handles to provide C-style scoping
  var obj = this, typ = Bounded;
  
  // other attributes
  var balance = (starting_balance == undefined ? 0.0 : starting_balance),
      max = (max_balance == undefined ? 1.0 : max_balance),
      min = (min_balance == undefined ? 0.0 : min_balance);
  
  /* SUBROUTINES 
  var f = function(p1, ... ) { } 
  */
  
  /* PUBLIC METHODS 
  obj.f = function(p1, ... ) { } 
  */
  
  // query
  obj.getBalance = function() { return balance; }
  obj.isEmpty = function() { return (balance == min); }
  obj.isFull = function() { return (balance == max); }
  
  // modification
  obj.withdraw = function(amount)
  {
    if(balance >= amount)
      balance -= amount;
    else
    {
      amount = balance;
      balance = 0;
    }
    // return the amount that was withdrawn
    return amount;
  }
  
  obj.deposit = function(amount)
  {
    if(balance + amount <= max)
      balance += amount;
    else
    {
      amount = max - balance;
      balance = max;
    }
    // return the amount that was deposited
    return amount;
  }
  
  obj.setBalance = function(amount)
  {
    balance = amount;
  }
  
  obj.setFull = function()
  {
    return obj.deposit(max);
  }
  
  obj.setEmpty = function()
  {
    return obj.withdraw(max);
  }
  
  /* INITIALISE AND RETURN INSTANCE */
  return obj;
}