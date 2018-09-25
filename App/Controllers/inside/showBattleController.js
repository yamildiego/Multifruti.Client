app.controller('showBattleController', function($scope, $http, $routeParams, $location, Constants, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    AuthService.checkAuthInside(function() { $scope.initialize(); });

    $scope.initialize = function() {
        $scope.marker = '';
        $http.get(Constants.APIURL + 'logged/getDataBattle/' + $routeParams.idBattle)
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.user = response.data.user;
                    $scope.opponent = response.data.opponent;
                    $scope.marker = response.data.marker;
                    $scope.battleId = response.data.battleId;
                    $scope.lastRoundId = response.data.lastRoundId;
                    $scope.resultGame = response.data.resultGame;
                    $scope.experience = response.data.experience;
                    $scope.loading = false;
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data))
                    $location.path("/main");
                else if (response.data.status === 'not_finished')
                    $location.path("/main");
            });
    }

    $scope.back = function() { $location.path("/main"); }
    $scope.showLastRound = function() { $location.path("/showRound/" + $scope.lastRoundId); }
});