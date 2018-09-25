app.controller('letterSelectionController', function($scope, $window, $http, $location, $timeout, $routeParams, Constants, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    var aLetras = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    AuthService.checkAuthInside(function() { $scope.initialize(); });

    $scope.initialize = function() {
        $scope.pause = false;
        $scope.letterRandom = 'A';

        $http.get(Constants.APIURL + 'logged/letterSelection/' + $routeParams.idBattle)
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.$parent.cleanErrors();
                    $scope.letter = response.data.numberLetter;
                    $scope.roundId = response.data.roundId;
                    $scope.loading = false;
                } else if (response.data.status === 'playing')
                    $location.path('/play/' + response.data.roundId);
                else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data))
                    $location.path("/main");
                else if (response.data.status == 'expired_session')
                    $window.location.href = Constants.FRONTURL;
                else if (response.data.status == 'finished_game')
                    $location.path("/main");
                else if (response.data.status == 'without_lives')
                    $location.path("/shopLives");
            });
        $scope.randomLetter();
    }

    $scope.randomLetter = function() {
        if (!$scope.pause) {
            $timeout(function() { $scope.randomLetter(); }, 90);
            $scope.letterRandom = aLetras[Math.floor(Math.random() * aLetras.length)];
        }
    }

    $scope.play = function() {
        $scope.pause = true;
        $timeout(function() {
            $scope.letterRandom = aLetras[$scope.letter];
            $timeout(function() { $location.path('/play/' + $scope.roundId); }, 1000);
        }, 60);
    }
});