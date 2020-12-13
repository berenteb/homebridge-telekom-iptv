const http = require("http");
const fs = require('fs');
const par = require("./parameters.json");

function createRequest(command) {
  var hash, binary;
  try {
    hash = par.hash[command];
    binary = fs.readFileSync(`./binaries/${command}`);
  } catch (error) {
    console.log("Unable to make request for IPTV: "+error);
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
      "Content-Length": "40"
    }
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  console.log("Writing "+command)
  req.write(binary);
  req.end();
}

module.exports.createRequest = createRequest;