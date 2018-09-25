app.controller('playController', function($scope, $http, $location, $filter, $timeout, $routeParams, Constants, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    AuthService.checkAuthInside(function() { $scope.initialize(); });
    $scope.secundsMax = 30;

    $scope.initialize = function() {
        $scope.questions = [];
        $scope.pause = false;
        $scope.finishedGame = false;
        $scope.focusInput = 0;
        $scope.loadings = [false, false, false, false, false];

        $http.get(Constants.APIURL + 'logged/play/' + $routeParams.idRound)
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.letter = response.data.letter;
                    $scope.questions = response.data.questions;
                    $scope.secundsActual = response.data.secundsActual;
                    $scope.roundId = response.data.roundId;
                    $scope.secundsActual = response.data.secundsActual;
                    $scope.loading = false;
                    $scope.start();
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data, true))
                    $location.path("/main");
                else if (response.data.status == 'time_out')
                    $location.path('/showRound/' + $routeParams.idRound);
            });
    }

    $scope.checkWord = function(index, question, enter) {
        if (question.answerText != undefined && question.answerText != '' && question.answer != 'OK') {
            $scope.loadings[index - 1] = true;
            if (enter)
                $scope.focusInput = $scope.getNextFocus(0, $scope.focusInput);

            $http.post(Constants.APIURL + 'logged/checkWord', {
                    roundId: $routeParams.idRound,
                    questionId: question.questionId,
                    answerText: question.answerText,
                })
                .then(function onSuccess(response) {
                    if (response.data.status === 'OK') {
                        $scope.$parent.cleanErrors();
                        $scope.questions.forEach(function(question) {
                            if (response.data.questionId == question.questionId) {
                                question.score = response.data.score;
                                question.answerText = response.data.answerText;
                                question.answer = response.data.status;
                            }
                        });

                        var questionsCorrectTotal = $filter('filter')($scope.questions, function(question) {
                            return question.answer == 'OK';
                        }, true).length;

                        if (questionsCorrectTotal == 5)
                            $scope.checkEnd();
                        $scope.loadings[index - 1] = false;
                    } else {
                        $scope.$parent.errorGeneral();
                        $location.path("/main");
                    }
                }, function onError(response) {
                    if ($scope.$parent.managerErrors(response.data)) {
                        $location.path("/main");
                    } else if (response.data.status != undefined && (response.data.status == 'incorrect_answer')) {
                        $scope.questions.forEach(function(q) {
                            if (question.questionId == q.questionId)
                                question.answer = 'INCORRECT';
                        });
                        $scope.loadings[index - 1] = false;
                    }
                });
        }
    }

    $scope.start = function() {
        if ($scope.secundsActual !== undefined) $scope.timer($scope.secundsActual);
    }

    $scope.timer = function(sActual) {
        if (!$scope.pause) {
            $scope.barTime = sActual;
            $scope.percentageTime = (sActual * 100 / $scope.secundsMax);

            if (sActual != 0)
                $timeout(function() { $scope.timer(sActual - 1, 1000); }, 1000);
            else {
                $scope.percentageTime = 0;
                $scope.checkEnd();
            }
        }
    }

    $scope.capitulate = function() {
        $scope.pause = true;
        $scope.capitulateAction($scope.barTime);
    }

    $scope.capitulateAction = function(valor) {
        if ($scope.barTime > 0) {
            $scope.barTime = valor;
            $scope.percentageTime = (valor * 100 / $scope.secundsMax);
            $timeout(function() { $scope.capitulateAction(valor - 1); }, 5);
        } else
            $timeout(function() { $scope.checkEnd(); }, 500);
    }

    $scope.checkEnd = function() {
        var questionsCorrectTotal = $filter('filter')($scope.questions, function(question) { return question.answer == 'OK'; }, true).length;

        if (questionsCorrectTotal == 5 || $scope.barTime == 0) {
            $scope.finishedGame = true;
            $scope.totalScore = 0;

            $scope.questions.forEach(function(question) {
                if (question.hasOwnProperty('score') && question.score != undefined) $scope.totalScore += question.score;
            });

            $http.get(Constants.APIURL + 'logged/endTurn/' + $routeParams.idRound)
                .then(function onSuccess(response) {
                    switch (response.data.status) {
                        case 'OK':
                            $timeout(function() { $location.path('/showRound/' + $routeParams.idRound + '/1'); }, 1500);
                            break;
                    }
                }, function onError(response) {
                    if ($scope.$parent.managerErrors(response.data))
                        $location.path('/main');
                    else if (response.data.status == 'time_out')
                        $location.path('/showRound/' + $routeParams.idRound);
                });
        }
    }

    $scope.hasFocus = function(index) { return ($scope.focusInput == index); }

    $scope.setFocus = function(index) { $scope.focusInput = index; }

    $scope.getNextFocus = function(count, focusInput) {
        if (count < 6) {
            focusInput++;
            if (focusInput > 4) focusInput = 0;
            return ($scope.questions[focusInput].score != undefined) ? $scope.getNextFocus(count++, focusInput) : focusInput;
        } else
            return false;
    }

    $scope.buyAnswer = function(question, index) {
        $scope.loadings[index] = true;
        $scope.focusInput = $scope.getNextFocus(0, index);

        $http.post(Constants.APIURL + 'logged/buyAnswer', { roundId: $routeParams.idRound, questionId: question.questionId })
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.$parent.cleanErrors();
                    $scope.questions.forEach(function(question) {
                        if (response.data.questionId == question.questionId) {
                            question.score = response.data.score;
                            question.answerText = response.data.answerText;
                            question.answer = response.data.status;
                        }
                    });
                    var questionsCorrectTotal = $filter('filter')($scope.questions, function(question) { return question.answer == 'OK'; }, true).length;
                    if (questionsCorrectTotal == 5) $scope.checkEnd();
                    $scope.loadings[index] = false;
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                $scope.loadings[index] = false;
                if ($scope.$parent.managerErrors(response.data))
                    $location.path("/main");
            });
    }
});