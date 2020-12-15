const http = require("http");
const fs = require('fs');
const path = require("path");
const par = require("./parameters.json");
var debug = false;

const commands = {
  OK: "ok",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  PLAY: "play",
  BACK: "back",
  INFO: "info",
  VOLUME_UP: "volume_up",
  VOLUME_DOWN: "volume_down",
  POWER: "power",
  CHANNEL_UP: "channel_up",
  CHANNEL_DOWN: "channel_down"
}
/**
 * 
 * @param {boolean} value Enable debug?
 */
function setDebug(value){
  debug = value;
}
/**
 * 
 * @param {String} command Command string. Use request.command enum to avoid errors.
 */
function createRequest(command) {
  var hash, binary;
  try {
    hash = par.hash[command];
    var binaryPath = path.join(__dirname, 'binaries', command);
    binary = fs.readFileSync(binaryPath);
  } catch (error) {
    console.log("Unable to make request for IPTV: " + error);
    return;
  }
  const options = {
    "method": "POST",
    "hostname": par.ip,
    "port": par.port,
    "path": `/companion?hash=${hash}&cid=${par.cid}&seq=${par.seq}`,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "EPG/166 CFNetwork/1206 Darwin/20.1.0",
      "Content-Length": binary.length
    },
    "timeout": 2000
  };

  const req = http.request(options, function (res) {
    const chunks = [];
    if(debug)console.log(res.statusCode);
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      if(debug)console.log(body.toString());
    });

    res.on("error", function () {
      console.log("IPTV Response Error");
    });
  });
  if(debug)console.log("Writing " + command)
  req.write(binary);
  req.end();
}

module.exports = {
  createRequest: createRequest,
  setDebug: setDebug,
  commands: commands
}