angular.module('ChillaxApp', [])
	.controller("ChillaxController", function () {
	
	var chillax = this;

	chillax.playSound = function () {
		chillax.nextNotification="Is enabled: " + chillax.enabled;
        console.log("Play misty for me");

	};

	chillax.saveSettings = function () {
		console.log("Attempting to auto save the settings");
	};

});