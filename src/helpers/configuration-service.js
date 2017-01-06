const fs = require('fs'),
    objectPath = require('object-path');

class ConfigurationService {

    static getFilename() {
        return './config.json';
    }

    static checkFileExists() {
        let exists = fs.existsSync(this.getFilename());
        if(!exists) {
            fs.writeFileSync(this.getFilename(), JSON.stringify({}, null, 4));
        }
    }

    static set(key, value) {
        let currentConfig = this.get();
        objectPath.set(currentConfig, key, value);
        fs.writeFileSync(this.getFilename(), JSON.stringify(currentConfig, null, 4));
    }

    static get(key) {
        this.checkFileExists();
        let configString = fs.readFileSync(this.getFilename());
        let config = JSON.parse(configString);
        return key ? objectPath.get(config, key) : config;
    }

    static remove(key) {
        var currentConfig = this.get();
        objectPath.del(currentConfig, key);
        fs.writeFileSync(this.getFilename(), JSON.stringify(currentConfig, null, 4));
    }
}

module.exports = ConfigurationService;