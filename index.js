const request = require("./request.js");

const PLUGIN_NAME = 'homebridge-telekom-iptv';
const PLATFORM_NAME = 'IPTV';

module.exports = (api) => {
  api.registerPlatform(PLATFORM_NAME, IPTV);
}

class IPTV {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;
    this.name = this.config.name || 'IPTV';
    this.debug = config.debug || false;
    this.serial = config.serial || "Unknown";
    this.firmware = config.firmware || "1.0";
    request.setDebug(this.debug);
    // get the name

    // generate a UUID
    const tv_uuid = this.api.hap.uuid.generate('homebridge:telekom-iptv' + this.name);

    // create the accessory
    this.iptvAccessory = new api.platformAccessory(this.name, tv_uuid);

    // set the accessory category
    this.iptvAccessory.category = this.api.hap.Categories.TELEVISION;

    // add the tv service
    const iptvService = this.iptvAccessory.addService(this.Service.Television);

    this.iptvAccessory.getService(this.Service.AccessoryInformation)
      .setCharacteristic(this.Characteristic.Name, 'Telekom IPTV')
      .setCharacteristic(this.Characteristic.Manufacturer, 'Cisco')
      .setCharacteristic(this.Characteristic.Model, "ISB2231MT")
      .setCharacteristic(this.Characteristic.SerialNumber, this.serial)
      .setCharacteristic(this.Characteristic.FirmwareRevision, this.firmware);
    
    // set sleep discovery characteristic
    iptvService.setCharacteristic(this.Characteristic.SleepDiscoveryMode, this.Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE);
    // handle on / off events using the Active characteristic
    iptvService.getCharacteristic(this.Characteristic.Active)
      // .on('set', (newValue, callback) => {
      //   this.log.info('Active: ' + newValue);
      //   iptvService.updateCharacteristic(this.Characteristic.Active, newValue);
      //   callback(null);
      // })
      .on('get', (callback) => {
        callback(null, 1);
      });

    // handle remote control input
    iptvService.getCharacteristic(this.Characteristic.RemoteKey)
      .on('set', (newValue, callback) => {
        switch (newValue) {
          case this.Characteristic.RemoteKey.REWIND: {
            // this.log.info('set Remote Key Pressed: REWIND');
            break;
          }
          case this.Characteristic.RemoteKey.FAST_FORWARD: {
            // this.log.info('set Remote Key Pressed: FAST_FORWARD');
            break;
          }
          case this.Characteristic.RemoteKey.NEXT_TRACK: {
            // this.log.info('set Remote Key Pressed: NEXT_TRACK');
            break;
          }
          case this.Characteristic.RemoteKey.PREVIOUS_TRACK: {
            // this.log.info('set Remote Key Pressed: PREVIOUS_TRACK');
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_UP: {
            request.createRequest(request.commands.UP);
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_DOWN: {
            request.createRequest(request.commands.DOWN);
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_LEFT: {
            request.createRequest(request.commands.LEFT);
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_RIGHT: {
            request.createRequest(request.commands.RIGHT);
            break;
          }
          case this.Characteristic.RemoteKey.SELECT: {
            request.createRequest(request.commands.OK);
            break;
          }
          case this.Characteristic.RemoteKey.BACK: {
            request.createRequest(request.commands.BACK);
            break;
          }
          case this.Characteristic.RemoteKey.EXIT: {
            request.createRequest(request.commands.BACK);
            break;
          }
          case this.Characteristic.RemoteKey.PLAY_PAUSE: {
            request.createRequest(request.commands.PLAY);
            break;
          }
          case this.Characteristic.RemoteKey.INFORMATION: {
            request.createRequest(request.commands.INFO);
            break;
          }
        }

        // don't forget to callback!
        callback(null);
      });

    const speakerService = this.iptvAccessory.addService(this.Service.TelevisionSpeaker);

    speakerService
      .setCharacteristic(this.Characteristic.Active, this.Characteristic.Active.ACTIVE)
      .setCharacteristic(this.Characteristic.VolumeControlType, this.Characteristic.VolumeControlType.RELATIVE_WITH_CURRENT);

    // handle volume control
    speakerService.getCharacteristic(this.Characteristic.VolumeSelector)
      .on('set', (direction, callback) => {
        request.createRequest(direction === 0 ? request.commands.VOLUME_UP : request.commands.VOLUME_DOWN);
        callback(null);
      });
    this.api.publishExternalAccessories(PLUGIN_NAME, [this.iptvAccessory]);
  }
}