angular.module('ChillaxApp', [])
	.controller("ChillaxController", function () {
	
	var chillax = this;
    var settings = {};
            settings["enabled"] = "";
        settings["reminderInterval"] = "";
        settings["breakInterval"] = "";
        settings["sound"] = "";
    var reminderInterval;
        
    chillax.init = function() {
        chillax.nextNotification="Chillax loaded!";
        chillax.retrieveSettings(chillax.setSettings);
    };

    chillax.setSettings = function() {
        console.log("Setting the setting: " + this.reminderInterval);
        chillax.reminderInterval = this.reminderInterval;
    };

    chillax.retrieveSettings = function(callback) {


                
        chrome.storage.sync.get(settings, function(obj) {
            
            console.log("Settings loaded: " + obj["reminderInterval"]);

            this.reminderInterval = obj["reminderInterval"];

            callback && callback();
        }.bind(this));

    };


    
	chillax.playSound = function () {
		chillax.nextNotification="Is enabled: " + true;
        console.log("Play misty for me");

	};

	chillax.saveSettings = function () {
		console.log("Attempting to auto save the settings");
        
        // Prepare setting values to save
        var settings = {};
        settings["enabled"] = chillax.enabled;
        settings["reminderInterval"] = chillax.reminderInterval;
        settings["breakInterval"] = chillax.breakInterval;
        settings["sound"] = chillax.sound;
        
        // Output settings
        console.log(settings);
        
        chrome.storage.sync.set(settings, function() {
            console.log("Settings have been stored successfully");
        });
        
	};
        
    

});