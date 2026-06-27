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

      // Formatting function (milliseconds to MM:SS.cs)
      function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let cs = Math.floor((ms % 1000) / 10);
        let secs = totalSeconds % 60;
        let mins = Math.floor(totalSeconds / 60);

        let pad = (n) => n.toString().padStart(2, '0');
        return `${pad(mins)}:${pad(secs)}.${pad(cs)}`;
      }

      // Real-time clock generator
      function updateClock() {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        
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
        }
      };

      scope.lap = function () {
        if (scope.vm.running) {
          let currentTotalMs = accum + (performance.now() - startTime);
          
          // Get the raw millisecond total of the previous lap (or 0 if first lap)
          let prevMs = scope.vm.laps.length > 0 ? scope.vm.laps[scope.vm.laps.length - 1]._rawTotal : 0;
          
          scope.vm.laps.push({
            index: scope.vm.laps.length + 1,
            split: formatTime(currentTotalMs - prevMs),
            total: formatTime(currentTotalMs),
            _rawTotal: currentTotalMs // Stored internally to calculate the next split accurately
          });
          
          scope.vm.lapCount = scope.vm.laps.length;
          
          // Force an immediate visual reset of the elapsed timer
          scope.vm.elapsed = '00:00.00'; 
        }
      };

      scope.reset = function () {
        // Pauses the timer
        scope.vm.running = false;
        
        // Find the exact total time of the last saved lap
        let lastLapMs = scope.vm.laps.length > 0 ? scope.vm.laps[scope.vm.laps.length - 1]._rawTotal : 0;
        
        // Rewind the hidden session total back to the end of the last lap
        accum = lastLapMs; 
        
        // Snap the UI back to zero
        scope.vm.elapsed = '00:00.00';
        tick(); 
      };

      scope.trash = function () {
        // This is your old reset function - it nukes everything
        scope.vm.running = false;
        accum = 0;
        scope.vm.elapsed = '00:00.00';
        scope.vm.laps = [];
        scope.vm.lapCount = 0;
        tick(); 
      };

      // --- Initialization ---

      updateClock(); 
      timerInterval = setInterval(tick, 50);

      scope.$on('$destroy', function () { 
        clearInterval(timerInterval); 
      });
    }
  };
}]);