angular.module('ChillaxApp', [])
    .controller("ChillaxController", ['$scope', 'settings', function($scope, settings) {
        $scope.settings = settings;
        // init function
        $scope.init = function() {
            $scope.nextNotification = "Miceal Gallagher";
            $scope.reminderInterval = 90;
            //any time we update settings in this contoller we want to save them.
            $scope.$watchCollection('settings', function(newVal, oldVal){
                settings.save(); // save the sttings any time it changes.
            });
        };

        $scope.playSound = function() {
            $scope.nextNotification = "Is enabled: " + true;
            console.log("Play misty for me");
        };

    }]).factory('settings',  ['$rootScope', function($rootScope) {
        var settings;
        settings = {};
        // deafault empty settings be used when the app first starts.
        settings["enabled"] = "";
        settings["reminderInterval"] = "";
        settings["breakInterval"] = "";
        settings["sound"] = "";

        //load settings
        console.log("about to load");

        chrome.storage.sync.get(settings, function(obj) {
            console.log("Settings loaded: " + obj["reminderInterval"]);
            angular.extend(settings, obj);
            $rootScope.$apply(); // hate to apply but once on load isn't bad.
        });
        //save whenever anything changes.
        settings.save = function() {
            console.log("Attempting to auto save the settings");
            // create a new object without the save function
            var s = angular.extend({}, settings, {save: undefined});
            //save to storage
            chrome.storage.sync.set(s, function() {
                console.log("Settings have been stored successfully");
            });

        };
        // return the settings object as the service
        return settings;
    }]);