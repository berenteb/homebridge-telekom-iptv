# Telekom IPTV Remote for Homebridge
**This is strongly unofficial, I would call it a Research.**
The Cisco Set-top-box can be controlled via the official Telekom app. This solution brings it to HomeKit via Homebridge.
## What is needed for this to work
 - A parameters.json file filled in:
```
{
    "ip": "",
    "port": "",
    "cid": "",
    "seq": "",
    "hash": {
        "ok": "",
        "up": "",
        "down": "",
        "left": "",
        "right": "",
        "play": "",
        "back": "",
        "info": "",
        "volume_up": "",
        "volume_down": "",
        "power":""
    }
}
```
 - Binary files with no extension, one for every button (see names above). E.g. ok, info, power.
 - The IP of the device.
 - Homebridge config.json:
```
"platforms":[
    {
      "platform":"IPTV",
      "name":"IPTV"
    }
  ]
```

## Currently supported features
 - Arrow navigation and select button (currently only in menus)
 - Play/pause
 - Back button
 - Media/Channel information
 - Volume control
## Current problems
 - Two fast button pressing results in a fatal error
 - When no menu is opened, pressing the select or arrow buttons results in connection lost
 - Unfortunately, this is not a universal solution. It only works with my unit. You'll need to find ip, port, request hash, cid (might be a Client ID), seq parameters and binary files from each request. This is due to the lack of official API.
## Responsibility
I'm sharing this because I find it interesting to have this in HomeKit. I'm not taking any responsibility for your device and network. Feel free to use if you're interested, but this is not official, production ready, stable etc. at all and is developed as a hobby project.