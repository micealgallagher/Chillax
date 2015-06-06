angular.module('ChillaxApp', [])
    .controller('ChillaxController', ['$scope', 'settings', 'Sounds', function($scope, settings, Sounds) {
        $scope.settings = settings;
        $scope.sounds = Sounds;
        // init function
        $scope.init = function() {
            $scope.nextNotification = 'Miceal Gallagher';
            $scope.reminderInterval = 90;
            //any time we update settings in this contoller we want to save them.
            $scope.$watchCollection('settings', function(newVal, oldVal){
                settings.save(); // save the sttings any time it changes.
            });
            if (Notification.permission !== "granted")
                Notification.requestPermission();
            new Notification('Hi!');
        };

        $scope.playSound = function() {
            $scope.nextNotification = 'Is enabled: ' + true;
            Sounds.play(settings.sound);
        };

    }]).factory('settings',  ['$rootScope', function($rootScope) {
        var settings;
        settings = {};
        // deafault empty settings be used when the app first starts.
        settings['enabled'] = '';
        settings['reminderInterval'] = '';
        settings['breakInterval'] = '';
        settings['sound'] = '';

        //load settings
        console.log('about to load');

        chrome.storage.sync.get(settings, function(obj) {
            console.log('Settings loaded: ' + obj['reminderInterval']);
            angular.extend(settings, obj);
            $rootScope.$apply(); // hate to apply but once on load isn't bad.
        });
        //save whenever anything changes.
        settings.save = function() {
            console.log('Attempting to auto save the settings');
            // create a new object without the save function
            var s = angular.extend({}, settings, {save: undefined});
            //save to storage
            chrome.storage.sync.set(s, function() {
                console.log('Settings have been stored successfully');
            });

        };
        // return the settings object as the service
        return settings;
    }]).factory('Sounds', [ function(){
        var sounds = {};
        var srcMap = {
            'Ding Dong' : 'audio/dingdong.wav',
            'Cha Ching' : 'audio/cash-register.mp3',
            'Church Bells' : 'audio/church-bells.wav',
            'Crystal Chime' : 'audio/crystal-glass.wav',
            'IM Message' : 'audio/notification-chime.wav',
            'Whip' : 'audio/whip-crack-01.wav'
        };

        sounds.play = function(key){
            if(!key || !srcMap[key]){
                return alert('Must choose a valid sound');
            }
            var a = new Audio();
            a.src = srcMap[key];
            a.play();
        };

        sounds.list = Object.keys(srcMap);
        return sounds;
    }]);