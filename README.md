# Simple Stopwatch with Laps - BeamNG.drive UI Mod

![Simple Stopwatch with Laps BeamNg Mod](./ui/modules/apps/simpleStopwatchWithLaps/app.png)

A simple manual lap stopwatch with real-world clock display.  

It features the normal stopwatch functions:
- START/PAUSE: to togghle the timer
- STORE LAP time: to capture your current lap split and total session time, and reset the main display to zero for your next lap
- STOP/SOFT RESET timer: to pause and reset to zero the main display without deleting all the stored laps
- TRASH/DELETE: Wipes all the laps and RESETs timer

It also shows at the top the your Local system clock.

<br/>

## Installation

For Regular use: Copy the the zip archive into your BeamNG user mods folder, e.g.: `C:\Users\<your_username>\AppData\Local\BeamNG\BeamNG.drive\current\mods`

For Development: Copy the mod folder or archive into your BeamNG user mods folder, e.g.:

```
C:\Users\<you>\AppData\Local\BeamNG\BeamNG.drive\current\mods
└── mods/
    └── unpacked/
        └── simpleStopwatchWithLaps/
            └── ui/
                └── apps/
                    └── simpleStopwatchWithLaps/
                        ├── app.html
                        ├── app.js
                        ├── app.css
                        ├── app.json
                        └── app.png
```

> **Note:** Do **not** place files directly inside the `BeamNG.drive/` user folder.
>
> For Development: Always use `mods/unpacked/<your-mod-name>/` so BeamNG can load and hot-reload the mod correctly.

<br/>

## Loading the Stopwatch in UI

- Pause the game (ESC)
- Go to "UI Apps"
- Click "Edit Apps"
- Click "Add App"
- Scroll to "General" section
- Double click "Simple Stopwatch with Laps"
- Drag and drop the stopwatch app wherever you want in your screen
- Press ESC or "Back to gameplay"

<br/>

## In-game development debugging

To see the changes in real time in the game while changing this UI App Mod code:

- Open the developer tools with CTRL + U, go to the "Network" tab and check "Disable cache"
- Then press F5

Also, you can press CTRL+L to Reload All LUA scripts (basically all the game) if there are changes to the mod properties.

<br/>

## License

All files in this repository are released under the [GNU General Public License v3 (GPL-3.0)](LICENSE).

Copyright (c) 2026 Radu-Alexandru