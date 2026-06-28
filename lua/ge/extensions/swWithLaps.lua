-- Copyright (C) 2026  Radu-Alexandru
-- This file is part of Simple Stopwatch with Laps
-- Simple Stopwatch with Laps  is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.   

-- About this file:
-- GE (engine) extension — receives keybinds, relays to the active vehicle.
local M = {}

local function toggle(VALUE)
  local veh = be:getPlayerVehicle(0)
  if veh then
    veh:queueLuaCommand('extensions.auto_swWithLaps.toggle(' .. VALUE .. ')')
  end
end

local function storeLap(VALUE)
  local veh = be:getPlayerVehicle(0)
  if veh then
    veh:queueLuaCommand('extensions.auto_swWithLaps.storeLap(' .. VALUE .. ')')
  end
end

M.toggle   = toggle
M.storeLap = storeLap

return M