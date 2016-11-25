angular
    .module("sharedAudioService", [])
    .factory("AudioService", function() {
        var currentlyPlaying = null;

        return {
            currentlyPlaying: currentlyPlaying,
            setCurrentlyPlaying: function(newAudio) {
                currentlyPlaying = newAudio;
            },
            getCurrentlyPlaying: function() {
                return currentlyPlaying;
            }
        };
    });

// "blogcast" application.  Main navigation and content of the page.  Controls the audio player application.
angular
    .module('blogcast', [
        'ui.bootstrap',
        'ui.router',
        'envConfig',
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "ngFileUpload",
        "hc.marked",
        "LocalStorageModule",
        "sharedAudioService",
        "PodcastService"
    ])
    .config(['$urlRouterProvider', '$locationProvider', 'markedProvider', 'localStorageServiceProvider', function ($urlRouterProvider, $locationProvider, markedProvider, localStorageServiceProvider) {
        'use strict';

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

        // Force markdown links to be opened in a new tab by default
        markedProvider.setOptions({gfm: true});
        markedProvider.setRenderer({
            link: function(href, title, text) {
                return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
            }
        });

        // Local storage options
        localStorageServiceProvider
            .setPrefix('blogcast')
    }]);


// "audioPlayer" application.  Controls the audio player docked at the bottom of the page.
angular
    .module('audioPlayer', [
        'ui.bootstrap',
        'ui.router',
        "ngSanitize",
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls"
    ])
    .controller("audioCtrl", ['$scope', "$sce", "$timeout", '$window', function($scope, $sce, $timeout, $window) {
        $scope.API = null;
        $scope.currentlyPlaying = null;

        $scope.setMedia = function(item, autoplay){
            $scope.$apply(function() {
                $scope.config.sources = [{src: $sce.trustAsResourceUrl(item.source), type: "audio/mpeg"}];
                $scope.currentlyPlaying = item;

                if ($scope.API  != null) {
                    $scope.API.stop();
                     if (autoplay) {
                        $timeout($scope.API.play.bind($scope.API), 100);
                    };
                };
            });
        };

        $scope.initializeMedia = function(item){
            $scope.$apply(function() {
                $scope.config.sources = [{src: $sce.trustAsResourceUrl(item.source), type: "audio/mpeg"}];
                $scope.currentlyPlaying = item;
            });
        };

        $scope.onPlayerReady = function(API) {
            $scope.API = API;
        };

        $scope.config = {
            type: "audio",
            sources: [],
            theme: {
                url: "bower_cache/videogular-themes-default/videogular.css"
            },
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false
        };


    }]);


angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("audioApp"), ['audioPlayer']);
});