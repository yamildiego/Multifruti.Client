app.controller('newGameController', function($scope, $window, $http, $location, $routeParams, Constants, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    AuthService.checkAuthInside(function() { $scope.initialize(); });

    $scope.initialize = function() {
        $scope.listFriends = false;
        $scope.withoutOpponent = true;
        if ($routeParams.friendIdFb) {
            $scope.withoutOpponent = false;
            $http.get(Constants.APIURL + 'Logged/playWithFriend/' + $routeParams.friendIdFb)
                .then(function onSuccess(response) {
                    if (response.data.status === 'OK') {
                        $scope.$parent.cleanErrors();
                        $scope.dataBattle = response.data.dataBattle;
                        $scope.loading = false;
                    } else {
                        $scope.$parent.errorGeneral();
                        $location.path("/main");
                    }
                }, function onError(response) {
                    if ($scope.$parent.managerErrors(response.data))
                        $location.path("/main");
                    else if (response.data.status == 'expired_session')
                        $window.location.href = Constants.FRONTURL;
                    else if (response.data.status == 'without_lives')
                        $location.path("/shopLives");
                });
        } else
            $scope.loading = false;
    }

    $scope.gameRandom = function() {
        $http.get(Constants.APIURL + 'logged/newGame')
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.$parent.cleanErrors();
                    $location.path("/letterSelection/" + response.data.dataBattle.id);
                    $scope.loading = false;
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data))
                    $location.path("/main");
                else if (response.data.status == 'expired_session')
                    $window.location.href = Constants.FRONTURL;
                else if (response.data.status == 'without_lives')
                    $location.path("/shopLives");
            });
    }

    $scope.gameFriends = function() {
        $scope.listFriends = true;
    }

    $scope.back = function() {
        if ($scope.listFriends)
            $scope.listFriends = false;
        else
            $location.path('/main');
    }

    $scope.play = function() { $location.path("/letterSelection/" + $scope.dataBattle.id); }

});