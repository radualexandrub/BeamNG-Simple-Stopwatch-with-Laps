// Copyright (C) 2026  Radu-Alexandru
// This file is part of Simple Stopwatch with Laps.
// Simple Stopwatch with Laps is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.   

'use strict';

angular.module('beamng.apps').directive('simpleStopwatchWithLaps', [function () {
  return {
    templateUrl: '/ui/modules/apps/simpleStopwatchWithLaps/app.html',
    replace: true,
    link: function (scope) {

      scope.vm = {
        running:  false,
        elapsed:  '00:00.00',
        lapCount: 0,
        laps:     [],
        clock:    '',
      };

      // Internal JS state
      let startTime = 0;
      let accum = 0;
      let timerInterval = null;

      const LAPS_STORAGE_KEY = 'simpleStopwatchWithLaps_laps';
      const ACCUM_STORAGE_KEY = 'simpleStopwatchWithLaps_accum';

      // Formatting function (milliseconds to MM:SS.cs)
      function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let cs = Math.floor((ms % 1000) / 10);
        let secs = totalSeconds % 60;
        let mins = Math.floor(totalSeconds / 60);

        let pad = (n) => n.toString().padStart(2, '0');
        return `${pad(mins)}:${pad(secs)}.${pad(cs)}`;
      }

      // Real-time system clock generator
      function updateClock() {
        const now = new Date();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "March", "April", "May", "June",
                        "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let h = now.getHours().toString().padStart(2, '0');
        let m = now.getMinutes().toString().padStart(2, '0');
        
        scope.vm.clock = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}, ${h}:${m}`;
      }

      // The main tick function to update the UI
      function tick() {
        if (scope.vm.running) {
          let currentTotalMs = accum + (performance.now() - startTime);
          
          // Look at the last lap saved. If no laps exist, this is 0.
          let lastLapMs = scope.vm.laps.length > 0 ? scope.vm.laps[scope.vm.laps.length - 1]._rawTotal : 0;
          
          // Display the time since the last lap started
          scope.vm.elapsed = formatTime(currentTotalMs - lastLapMs);
        }
        updateClock();
        scope.$applyAsync();
      }

      // --- Controls ---
      scope.start = function () {
        if (!scope.vm.running) {
          startTime = performance.now();
          scope.vm.running = true;
        }
      };

      scope.stop = function () {
        if (scope.vm.running) {
          accum += (performance.now() - startTime);
          scope.vm.running = false;

          // Persist the accumulator to localStorage
          try {
            localStorage.setItem(ACCUM_STORAGE_KEY, JSON.stringify(accum));
          } catch (e) {}
        }
      };

      scope.lap = function () {
        // If stopped and reset, treat the lap button as a start
        if (!scope.vm.running && scope.vm.elapsed === '00:00.00') {
          scope.start();
          return;
        }

        if (scope.vm.running) {
          let currentTotalMs = accum + (performance.now() - startTime);
          let prevMs = scope.vm.laps.length > 0
            ? scope.vm.laps[scope.vm.laps.length - 1]._rawTotal : 0;
          scope.vm.laps.push({
            index: scope.vm.laps.length + 1,
            split: formatTime(currentTotalMs - prevMs),
            total: formatTime(currentTotalMs),
            _rawTotal: currentTotalMs // Stored internally to calculate the next split accurately
          });
          
          scope.vm.lapCount = scope.vm.laps.length;
          
          // Force an immediate visual reset of the elapsed timer
          scope.vm.elapsed = '00:00.00';

          // Persist laps to localStorage
          try {
            localStorage.setItem(LAPS_STORAGE_KEY, JSON.stringify(scope.vm.laps));
          } catch (e) {}
        }
      };

      scope.reset = function () {
        // Pauses the timer
        scope.vm.running = false;
        
        // Find the exact total time of the last saved lap
        let lastLapMs = scope.vm.laps.length > 0 ? scope.vm.laps[scope.vm.laps.length - 1]._rawTotal : 0;
        
        // Rewind the hidden session total back to the end of the last lap
        accum = lastLapMs; 

        // Persist the accumulator to localStorage
        try {
          localStorage.setItem(ACCUM_STORAGE_KEY, JSON.stringify(accum));
        } catch (e) {}
        
        // Snap the UI back to zero
        scope.vm.elapsed = '00:00.00';
        tick(); 
      };

      scope.trash = function () {
        scope.vm.running = false;
        accum = 0;
        scope.vm.elapsed = '00:00.00';
        scope.vm.laps = [];
        scope.vm.lapCount = 0;

        // Remove persisted laps and accumulator from localStorage
        try {
          localStorage.removeItem(LAPS_STORAGE_KEY);
          localStorage.removeItem(ACCUM_STORAGE_KEY);
        } catch (e) {}

        tick();
      };

      // --- Initialization ---
      // Retrieve any laps and accumulator previously stored in localStorage
      try {
        const storedLaps = JSON.parse(localStorage.getItem(LAPS_STORAGE_KEY) || '[]');
        scope.vm.laps = storedLaps;
        scope.vm.lapCount = storedLaps.length;

        let lastLapMs = storedLaps.length > 0 ? storedLaps[storedLaps.length - 1]._rawTotal : 0;

        const storedAccum = JSON.parse(localStorage.getItem(ACCUM_STORAGE_KEY));
        // accum can never be less than the last lap's total (same invariant reset() relies on), 
        // clamp up to lastLapMs if storage is stale,
        // e.g. laps were taken mid-run without an explicit stop/reset in between.
        accum = (typeof storedAccum === 'number' && !isNaN(storedAccum) && storedAccum >= lastLapMs)
          ? storedAccum
          : lastLapMs;

        // Show the correct paused offset instead of jumping back to zero
        scope.vm.elapsed = formatTime(accum - lastLapMs);
      } catch (e) {
        scope.vm.laps = [];
        scope.vm.lapCount = 0;
        accum = 0;
        scope.vm.elapsed = '00:00.00';
      }

      updateClock();
      timerInterval = setInterval(tick, 50);

      scope.$on('$destroy', function () {
        clearInterval(timerInterval);
      });
    },

    // Controller that bridges BeamNG input bindings to the UI
    // BeamNG's streamsUpdate fires asynchronously after link() has already run,
    // so by the time we receive any event, scope.start/stop/lap are all defined.
    //
    // Rising-edge detection (prevToggle / prevLap):
    // onChange sends VALUE=1 on keydown AND VALUE=0 on keyup, so the electric
    // stays 1 for every UI frame while the key is held. Without edge detection,
    // toggle() would fire ~20× per second and flip-flop the timer. We act only
    // on the 0→1 transition so each physical keypress = exactly one action.
    controller: ['$scope', function ($scope) {

      let prevToggle = 0;
      let prevLap    = 0;

      $scope.$on('streamsUpdate', function (event, data) {
        $scope.$evalAsync(function () {
          if (!data.electrics) return;

          const toggle = data.electrics.sw_toggle || 0;
          const lap    = data.electrics.sw_lap    || 0;

          // Rising edge: 0 → 1 only
          if (toggle === 1 && prevToggle === 0) {
            if ($scope.vm.running) {
              $scope.stop();
            } else {
              $scope.start();
            }
          }

          if (lap === 1 && prevLap === 0) {
            $scope.lap();
          }

          prevToggle = toggle;
          prevLap    = lap;
        });
      });
    }]
  };
}]);