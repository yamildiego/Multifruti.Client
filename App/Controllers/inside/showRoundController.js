app.controller('showRoundController', function($scope, $location, $http, $routeParams, $filter, Constants, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    $scope.$parent.cleanErrors();
    $scope.firstTime = ($routeParams.firstTime) ? true : false;
    AuthService.checkAuthInside(function() { $scope.initialize(); });

    $scope.initialize = function() {
        $scope.marker = '';
        $http.get(Constants.APIURL + 'Logged/getDataRound/' + $routeParams.idRound)
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.user = response.data.user;
                    $scope.opponent = response.data.opponent;
                    $scope.marker = response.data.marker;
                    $scope.numberRound = response.data.numberRound;
                    $scope.dataQuestions = response.data.dataQuestions;
                    $scope.backRoundId = response.data.backRoundId;
                    $scope.nextRoundId = response.data.nextRoundId;
                    $scope.battleId = response.data.battleId;
                    $scope.finished = response.data.finished;
                    $scope.loading = false;
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data))
                    $location.path("/main");
            });
    }

    $scope.sendAnswer = function(answer, questionId) {
        $http.post(Constants.APIURL + 'logged/sendAnswer', { answer: answer, roundId: $routeParams.idRound, questionId: questionId })
            .then(function onSuccess(response) {
                if (response.data.status == 'OK') {
                    var question = $filter('filter')($scope.dataQuestions, function(question) { return question.questionId == questionId; }, true)[0];
                    question.isSent = true;
                    $scope.$parent.setErrorForKey('send_answer');
                }
            });
    }

    $scope.getClassPoints = function(score) {
        switch (score) {
            case 1:
                { return 'one-points'; break; }
            case 2:
                { return 'two-points'; break; }
            case 3:
                { return 'three-points'; break; }
            case 4:
                { return 'four-points'; break; }
            case 5:
                { return 'five-points'; break; }
            default:
                { return 'no-points'; break; }
        }
    }

    $scope.back = function() { $location.path("/main"); }
    $scope.goToRound = function(idRound) { if (idRound) $location.path("/showRound/" + idRound); }
    $scope.playNextRound = function() { if ($scope.battleId) $location.path("/letterSelection/" + $scope.battleId); }
    $scope.showBattle = function() { $location.path("/showBattle/" + $scope.battleId); }
});