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
        "power":"",
        "channel_up":"",
        "channel_down":""
    }
}
```
 - Binary files with no extension, one for every button (see names above). E.g. ok, info, power.
 - The IP of the device.
 - Homebridge config.json:
```
"platforms":[
    {
      "platform":"IPTV", //This is the platform name registered by the plugin
      "name":"IPTV", //This can be set to mathc your needs (optional, default: IPTV)
      "serial":"12345678", //Serial of the device (optional)
      "firmware":"1.0", //Firmware version of the device (optional)
      "debug":false //set this to true to enable logging (optional)
    }
  ]
```

## Currently supported features
 - Arrow navigation and select button
 - Play/pause
 - Back button
 - Media/Channel information
 - Volume control
## Current problems
 - ~~Two fast button pressing results in a fatal error~~
 - ~~When no menu is opened, pressing the select or arrow buttons results in connection lost~~
 - Switching on/off in the Home app is not working. The reason is I couldn't find a solution to determine the status of the box. Therefore it is only a dummy switch in the Home app.
 - Unfortunately, this is not a universal solution. It only works with my unit. You'll need to find ip, port, request hash, cid (might be a Client ID), seq parameters and binary files from each request. This is due to the lack of official API.
## Responsibility
I'm sharing this because I find it interesting to have this in HomeKit. I'm not taking any responsibility for your device and network. Feel free to use if you're interested, but this is not official, production ready, stable etc. at all and is developed as a hobby project.

# ISC License (ISC)
Copyright 2020 Bálint Berente

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
