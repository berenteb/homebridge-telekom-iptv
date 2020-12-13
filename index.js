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
    // this.debug = config.debug || false;
    // get the name
    const name = this.config.name || 'IPTV';

    // generate a UUID
    const uuid = this.api.hap.uuid.generate('homebridge:telekom-iptv' + name);

    // create the accessory
    this.iptvAccessory = new api.platformAccessory(name, uuid);

    // set the accessory category
    this.iptvAccessory.category = this.api.hap.Categories.TV_SET_TOP_BOX;

    // add the tv service
    const iptvService = this.iptvAccessory.addService(this.Service.Television);

    // add my own information service
    let informationService = new this.Service.AccessoryInformation();
    informationService
      .setCharacteristic(this.Characteristic.Name, 'Telekom IPTV')
      .setCharacteristic(this.Characteristic.Manufacturer, 'Telekom')
      .setCharacteristic(this.Characteristic.Model, "IPTV")
    //   .setCharacteristic(this.Characteristic.SerialNumber, "Unknown")
    //   .setCharacteristic(this.Characteristic.FirmwareRevision, "Unknown");

    // this.iptvAccessory.addService(informationService);
    
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
            request.createRequest("up");
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_DOWN: {
            request.createRequest("down");
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_LEFT: {
            request.createRequest("left");
            break;
          }
          case this.Characteristic.RemoteKey.ARROW_RIGHT: {
            request.createRequest("right");
            break;
          }
          case this.Characteristic.RemoteKey.SELECT: {
            request.createRequest("ok");
            break;
          }
          case this.Characteristic.RemoteKey.BACK: {
            request.createRequest("back");
            break;
          }
          case this.Characteristic.RemoteKey.EXIT: {
            request.createRequest("back");
            break;
          }
          case this.Characteristic.RemoteKey.PLAY_PAUSE: {
            request.createRequest("play");
            break;
          }
          case this.Characteristic.RemoteKey.INFORMATION: {
            request.createRequest("info");
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
        if(direction === 0){
            request.createRequest("volume_up");
        }else{
            request.createRequest("volume_down");
        }
        callback(null);
      });
    this.api.publishExternalAccessories(PLUGIN_NAME, [this.iptvAccessory]);
  }
}