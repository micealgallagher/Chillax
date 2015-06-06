angular.module('ChillaxApp', [])
    .controller('ChillaxController', ['$scope', 'settings', 'Sounds', 'NotificationSystem', 
    function($scope, settings, Sounds, NotificationSystem) {
        $scope.settings = settings;
        $scope.sounds = Sounds;
        $scope.ns = NotificationSystem;
        // init function
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
                }
                $scope.$apply();
            });

        };

        $scope.playSound = function() {
            Sounds.play(settings.sound);
        };
    }]).factory('settings',  ['$rootScope', function($rootScope) {
        var loadListners = [];
        var settings;
        // deafault settings.
        settings = {
            enabled : false,
            reminderInterval : 90,
            breakInterval : 10,
            sound : 'Ding Dong'
        };

        function loaded(){
            for(var i = 0; i < loadListners.length; ++i){
                loadListners[i]();
            }
        }

        settings.onLoad = function(func){
            loadListners.push(func);
        }

        //load settings
        console.log('about to load');

        chrome.storage.sync.get(settings, function(obj) {
            console.log('Settings loaded: ' + obj.reminderInterval);
            angular.extend(settings, obj);
            loaded();
        });
        //save whenever anything changes.
        settings.save = function() {
            console.log('Attempting to auto save the settings');
            // create a new object without the save or onLoad function.
            // we don't want to remove the functions from the settings object currently in use by the app.
            var s = angular.extend({}, settings, {save: undefined, onLoad: undefined});
            //save to storage
            chrome.storage.sync.set(s, function() {
                console.log('Settings have been stored successfully');
            });

        };
        // return the settings object as the service
        return settings;
    }]).factory('Sounds', [ function(){
        //This is the map from a user readable key to a url for that sound.
        var srcMap = {
            'Ding Dong' : 'audio/dingdong.wav',
            'Cha Ching' : 'audio/cash-register.mp3',
            'Church Bells' : 'audio/church-bells.wav',
            'Crystal Chime' : 'audio/crystal-glass.wav',
            'IM Message' : 'audio/notification-chime.wav',
            'Whip' : 'audio/whip-crack-01.wav'
        };
        // create the sounds object to return
        var sounds = {};
        // list of keys for sounds
        sounds.list = Object.keys(srcMap);
        //play is given a key from the list and plays audio.
        sounds.play = function(key){
            if(!key || !srcMap[key]){
                return alert('Must choose a valid sound');
            }
            var a = new Audio();
            a.src = srcMap[key];
            a.play();
        };
        //return the sounds service
        return sounds;
    }]).factory('NotificationSystem', ['settings', 'Sounds', '$rootScope', '$timeout' ,function(settings, Sounds, $rootScope, $timeout){
        
        var notify = function(message, sound){
            if(settings.sound){
                Sounds.play(sound);
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
        }
        function completeWorkTimer(){
            notify('Time to Chillax!', settings.sound);
            startChillTimer();
        }
        function startChillTimer(){
            chillTimer = $timeout(completeChillTimer, settings.breakInterval * 60 * 1000);
            updateLabel('Back to work in ', moment().add(settings.breakInterval, 'm'));//.format('hh:mma'));
        }
        function completeChillTimer(){
            notify('Back to work', 'Whip');
            startWorkTimer();
        }
        var labelListeners = [];
        function updateLabel(label, date){
            ns.label = (label || 'Miceal Gallagher');
            ns.date = date;
            ns.nextNotification = (label || 'Miceal Gallagher') + (date || '');
        }

        // notification service
        var ns = {}; 
        var isRunning = false;
        updateLabel();
        ns.startTimer = function(){
            console.log('starting timer');
            if(isRunning){  return; }
            startWorkTimer();
            isRunning = true;
        };
        ns.clearTimer = function(){
            console.log('clearing timers');
            if(!isRunning){ return; }
            //clear timeout on untruthy value is ok
            $timeout.cancel(workTimer);
            $timeout.cancel(chillTimer);
            isRunning = false;
            updateLabel();
        }
        ns.reset = function(){
            if(isRunning){
                ns.clearTimer();
                ns.startTimer();
            }
        }
        ns.toggleTimer = function(){
            if(isRunning){
                ns.clearTimer();
            } else{
                ns.startTimer();
            }
        }
        return ns;
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