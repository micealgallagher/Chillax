angular.module('ChillaxApp', [])
    .controller('ChillaxController', ['$scope', 'setting', 'sound', 'notification', 
    function($scope, setting, sound, notification) {
        
        $scope.setting = setting;
        $scope.sound = sound;
        $scope.notification = notification;
        
        // Init function
        $scope.init = function() {
            //need to load settings first
            settings.onLoad(function(){
                //any time we update settings in this contoller we want to save them.
                $scope.$watchCollection('settings', function(newVal, oldVal){
                    settings.save(); // save function available from service.
                    //$scope.ns.reset();
                });
                //start the timer if they already had it active last time.
                if(settings.enabled){
                    $scope.ns.startTimer();
            // Need to load setting first
            setting.onLoadComplete(function() {
                
                // Any time we update setting in this contoller we want to save them.
                $scope.$watchCollection('setting', function(newVal, oldVal) {
                    setting.save();
                });
                
                // Start the timer if they already had it active last time.
                if ( setting.enabled ) {
                    $scope.notification.startTimer();
                }
                $scope.$apply();
            });

        };

        $scope.playSound = function() {
            sound.play(setting.sound);
        };

    }]).factory('setting',  ['$rootScope', function($rootScope) {
        
        var onLoadCompleteCallback;
        var loadedSettings;
        
        // Default setting.
        setting = {
            enabled : false,
            reminderInterval : 20,
            breakInterval : 4,
            sound : 'Ding Dong'
        };

        function loadComplete() {
            onLoadCompleteCallback();
        }

        setting.onLoadComplete = function(func) {
            onLoadCompleteCallback = func;
        }

        chrome.storage.sync.get(setting, function(obj) {
            console.log('Settings loaded: ' + obj);
            angular.extend(setting, obj);
            loadComplete();
        });

        // Save whenever anything changes.
        setting.save = function() {

            console.log('Attempting to auto save the setting');

            // Create a new object without the save or onLoad function.
            // We don't want to remove the functions from the setting object currently in use by the app.
            var s = angular.extend({}, setting, {save: undefined, onLoad: undefined});

            // Save to storage
            chrome.storage.sync.set(s, function() {
                console.log('Settings have been stored successfully');
            });
        };

        return setting;

    }]).factory('sound', [ function() {
        
        // This is the map from a user readable key to a url for that sound.
        var srcMap = {
            'Ding Dong' : 'audio/dingdong.wav',
            'Cha Ching' : 'audio/cash-register.mp3',
            'Church Bells' : 'audio/church-bells.wav',
            'Crystal Chime' : 'audio/crystal-glass.wav',
            'IM Message' : 'audio/notification-chime.wav',
            'Whip' : 'audio/whip-crack-01.wav'
        };
        
        // Create the sounds object to return
        var sound = {};
        // List of keys for sounds
        sound.list = Object.keys(srcMap);
        
        // Play is given a key from the list and plays audio.
        sound.play = function(key) {
            if ( !key || !srcMap[key] ) {
                return alert('Must choose a valid sound');
            }

            var audio = new Audio();
            audio.src = srcMap[key];
            audio.play();
        };

        return sound;
    }]).factory('notification', ['setting', 'sound', '$rootScope' ,function(setting, sound, $rootScope) {
        
        var notify = function(message) {
                console.log('Playing sound : ', setting.sound);
            if ( setting.sound ) {
                sound.play(setting.sound);
            } 
            var notification = new Notification(message, {
                icon : 'chillax-128.png'
            });
        };
        // Chain of timers
        var workTimer, chillTimer; // These are here to keep reference of the inteval objects 
        function startWorkTimer(){
            workTimer = $timeout(completeWorkTimer, settings.reminderInterval * 60 * 1000);
            updateLabel("Chillax in ", ns.date = moment().add(settings.reminderInterval, 'm'));//.format('hh:mma'));
        }; 

        function completeWorkTimer(){
            notify('Time to Chillax!', settings.sound);
            startChillTimer();
        }; 

        function startChillTimer(){
            chillTimer = $timeout(completeChillTimer, settings.breakInterval * 60 * 1000);
            updateLabel('Back to work in ', moment().add(settings.breakInterval, 'm'));//.format('hh:mma'));
        };

        function completeChillTimer(){
            notify('Back to work', 'Whip');
            startWorkTimer();
        };

        var labelListeners = [];
        function updateLabel(label, date){
            notification.label = (label || 'Miceal Gallagher');
            notification.date = date;
            notification.nextNotification = (label || 'Miceal Gallagher') + (date || '');
        };

        // notification service
        var notification = {}; 
        var isRunning = false;
        updateLabel();
        notification.startTimer = function(){
            console.log('starting timer');
            if ( isRunning ) {  return; }
            startWorkTimer();
            isRunning = true;
        };

        notification.clearTimer = function() {
            console.log('clearing timers');
            if ( !isRunning ) { return; }
            //clear timeout on untruthy value is ok
            $timeout.cancel(workTimer);
            $timeout.cancel(chillTimer);
            isRunning = false;
            updateLabel();
        }

        notification.reset = function() {
            if ( isRunning ) {
                notification.clearTimer();
                notification.stopTimer();
            }
        }

        notification.toggleTimer = function() {
            if ( isRunning ) {
                notification.clearTimer();
            } else{
                notification.startTimer();
            }
        }
        return notification;
    }]).directive('chillCountdown', ['$interval', 'NotificationSystem', function($interval, NotificationSystem) {

      function link(scope, element, attrs) {
        var date,
            timeoutId;
        var ns = NotificationSystem;

        function updateTime() {
            var ds = ns.label;
            if(ns.date){
                var diff = ns.date.diff(moment(), 'seconds');
                var sec = diff % 60;
                var min = Math.floor(diff / 60);
                ds += min + ':' + ("0" + sec).slice(-2);;
            }
            element.text(ds);
        }

        scope.$watch(ns.date, function(value) {
          date = value;
          updateTime();
        });

        element.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });
        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function() {
          updateTime(); // update DOM
        }, 1000);
      }

      return {
        scope: {},
        restrict: 'E',
        link: link
      };
}]);
