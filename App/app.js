var app = angular.module('Game', ['ngRoute', 'timer']);

app.run(function($rootScope, FaceService) {
    FaceService.initialize(function() {
        FaceService.getLoginStatus();
    });
});