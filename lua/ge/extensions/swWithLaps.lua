-- Copyright (C) 2026  Radu-Alexandru
-- This file is part of Simple Stopwatch with Laps
-- Simple Stopwatch with Laps is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.   

-- About this file:
-- GE (engine) extension — receives keybinds, relays to the active vehicle.
local extension = {}

local function toggle(value)
  local playerVehicle = be:getPlayerVehicle(0)
  if playerVehicle then
    -- Using string.format keeps code cleaner than inline string concatenation
    playerVehicle:queueLuaCommand(string.format("extensions.auto_swWithLaps.toggle(%s)", tostring(value)))
  end
end

local function storeLap(value)
  local playerVehicle = be:getPlayerVehicle(0)
  if playerVehicle then
    playerVehicle:queueLuaCommand(string.format("extensions.auto_swWithLaps.storeLap(%s)", tostring(value)))
  end
end

-- Pulls the applied .pc config filename out of the player vehicle data table
-- and strips it down to just the config identifier (e.g. "base_M").
-- Defensive because the exact table shape has moved between BeamNG versions.
local function getConfigName()
  local success, vehicleData = pcall(function() 
    return core_vehicle_manager.getPlayerVehicleData(0) 
  end)
  
  if not success or not vehicleData then 
    return nil 
  end

  local partConfigFilePath = (vehicleData.config and vehicleData.config.partConfigFilename) or
                             (vehicleData.vconfig and vehicleData.vconfig.partConfigFilename)

  if not partConfigFilePath then 
    return nil 
  end

  -- Extracts the filename without the directory path and the .pc extension
  return partConfigFilePath:match("([^/\\]+)%.pc$")
end

-- Pushes the current player vehicle's model + config to the UI.
local function sendVehicleInfo()
  local playerVehicle = be:getPlayerVehicle(0)
  local model = playerVehicle and playerVehicle:getJBeamFilename() or nil
  local config = playerVehicle and getConfigName() or nil
  
  guihooks.trigger('swVehicleInfoChanged', { model = model, config = config })
end

local function onVehicleSwitched(oldVehicleId, newVehicleId)
  sendVehicleInfo()
end

local function onExtensionLoaded()
  sendVehicleInfo()
end

-- Public API exports for BeamNG's extension framework
extension.toggle            = toggle
extension.storeLap          = storeLap
extension.sendVehicleInfo   = sendVehicleInfo
extension.onVehicleSwitched = onVehicleSwitched
extension.onExtensionLoaded = onExtensionLoaded

return extension