-- Copyright (C) 2026 Radu-Alexandru
-- This file is part of Simple Stopwatch with Laps
-- Simple Stopwatch with Laps  is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.   

-- About this file (vehicle context):
-- Vehicle extension - runs inside the car's sandbox
-- Sets electrics.values, which BeamNG streams to the JS UI automatically
local vehicleExtension = {}

electrics.values['sw_toggle'] = 0
electrics.values['sw_lap']    = 0

local function toggle(VALUE)
  electrics.values['sw_toggle'] = VALUE
end

local function storeLap(VALUE)
  electrics.values['sw_lap'] = VALUE
end

vehicleExtension.toggle   = toggle
vehicleExtension.storeLap = storeLap

return vehicleExtension