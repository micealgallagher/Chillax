angular.module('ChillaxApp', [])
	.controller("ChillaxController", function () {
	
	var chillax = this;

	chillax.playSound = function () {
		chillax.nextNotification="Is enabled: " + chillax.enabled;
	};

	chillax.saveSettings = function () {
		chillax.nextNotification="Is enabled: " + chillax.enabled;
		if ( chillax.nextNotification ) {
			console.write("asdf");
		} else {
			expect(chillax.settings.isDisplayed()).toBeFalsy();
		}
		
	};

});