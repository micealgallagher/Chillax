angular.module('ChillaxApp', [])
	.controller("ChillaxController", ['$scope', function ($scope) {
	
    var settings = {};
    settings["enabled"] = "";
    settings["reminderInterval"] = "";
    settings["breakInterval"] = "";
    settings["sound"] = "";



    var reminderInterval;
        
    $scope.init = function() {
        $scope.nextNotification="Miceal Gallagher";
        $scope.reminderInterval=90;

        $scope.retrieveSettings();
    };

    $scope.retrieveSettings = function() {

        $scope.obj ={};

        $scope.$watchCollection('obj', function(newValue, oldValue) {
            console.log("Watch value has changed: " + newValue );
        });

        chrome.storage.sync.get(settings, function(obj) {
            console.log("Settings loaded: " + obj["reminderInterval"]);
            $scope.$digest();

        });

    };

    $scope.setSettings = function() {
        console.log("Setting the setting: " + this.reminderInterval);
        $scope.reminderInterval = this.reminderInterval;
    };
    
	$scope.playSound = function () {
		$scope.nextNotification="Is enabled: " + true;
        console.log("Play misty for me");

	};

	$scope.saveSettings = function () {
		console.log("Attempting to auto save the settings");
        
        // Prepare setting values to save
        var settings = {};
        settings["enabled"] = $scope.enabled;
        settings["reminderInterval"] = $scope.reminderInterval;
        settings["breakInterval"] = $scope.breakInterval;
        settings["sound"] = $scope.sound;
        
        // Output settings
        console.log(settings);
        
        chrome.storage.sync.set(settings, function() {
            console.log("Settings have been stored successfully");
        });
        
	};
        
    

}]);