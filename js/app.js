angular.module('ChillaxApp', [])
	.controller("ChillaxController", function () {
	
	var chillax = this;
        
    chillax.init = function() {
        chillax.nextNotification="Chillax loaded!";
        chillax.retrieveSettings();
    };

    chillax.retrieveSettings = function() {
        var settings = {};
        settings["enabled"] = "";
        settings["reminderInterval"] = "";
        settings["breakInterval"] = "";
        settings["sound"] = "";
        
        chillax.enabled = true;
        
        chrome.storage.sync.get(settings, function(obj) {
            
            console.log("Settings loaded: " + obj["enabled"]);
            
            this.chillax.reminderInterval = obj["reminderInterval"];
            chillax.breakInterval = settings["breakInterval"];
            chillax.sound = settings["sound"];
        });
        
    };
    
	chillax.playSound = function () {
		chillax.nextNotification="Is enabled: " + chillax.enabled;
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