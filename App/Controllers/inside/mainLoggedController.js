app.controller('mainLoggedController', function($scope, $route, $timeout, $rootScope, $http, $location, $filter, AuthService, FaceService, Constants, ModalService, CommonFunctionsService) {
    $scope.alertList = [];
    $scope.$parent.bg = '';
    $scope.$parent.bgMain = '';
    $scope.loading = true;
    $scope.CommonFunctionsService = CommonFunctionsService;
    AuthService.checkAuthInside(function() {
        $scope.loadStatistics();
        $scope.getHome();
    });

    $scope.buyCoins = function(packId) {
        $scope.loading = true;

        if (packId > 5 || packId < 0) {
            $scope.$parent.managerErrors(response.data);
        }

        $http.get(Constants.APIURL + 'FB/getRequestId/' + packId)
            .then(function onSuccess(response) {
                if (response.data.status == 'OK') {
                    FB.ui({
                            method: 'pay',
                            action: 'purchaseitem',
                            product: 'http://www.meycomplementos.com/og/coins/htmls/product_' + packId + '.html',
                            request_id: response.data.requestId
                        },
                        function(responseFB) {
                            console.error(responseFB);
                        }
                    );
                } else
                    $location.path("/");
            }, function onError(response) {
                $location.path("/");
            });
    }

    $scope.newGame = function() { $location.path('/newGame'); }
    $scope.showLastRound = function(lastRoundId) { $location.path('/showRound/' + lastRoundId); }
    $scope.showBattle = function(battleId) { $location.path('/showBattle/' + battleId); }
    $scope.hideBattleYourTurn = function(battleId) { $scope.battlesYourTurn = $filter('filter')($scope.battlesYourTurn, function(btt) { return btt.battleId != battleId; }, true); }
    $scope.hideBattleForApproval = function(battleId) { $scope.battlesForApproval = $filter('filter')($scope.battlesForApproval, function(btt) { return btt.battleId != battleId; }, true); }
    $scope.closeModal = function(id) { ModalService.Close(id); }
    $scope.reloadHome = function() { $route.reload(); }
    $scope.openModalLives = function() {
        if($rootScope.dataUser.lives != -10)
            ModalService.Open('modal-lives');  
     }

    $scope.startGame = function(battleId, idModal) {
        if (idModal)
            ModalService.Close(idModal);
        $location.path('/letterSelection/' + battleId);
    }

    $scope.goToShopLives = function(idModal) {
        if (idModal)
            ModalService.Close(idModal);
        $location.path('/shopLives/');
    }

    $scope.approveGame = function(battleId, nameOpponent) {
        $scope.loading = true;
        $scope.nameOpponent = nameOpponent;

        $http.get(Constants.APIURL + 'identifier/getLoginStatus')
            .then(function onSuccess(response) {
                if (response.data.status == 'OK') {
                    $scope.loading = false;
                    if (response.data.dataUser.lives == 0)
                        ModalService.Open('modal-lives');
                    else {
                        $scope.battleIdModal = battleId;
                        ModalService.Open('modal-approve');
                    }
                } else
                    $location.path("/");
            }, function onError(response) {
                $location.path("/");
            });
    }

    $scope.suggestCategory = function() {
        $scope.loading = false;
        $scope.active = 'settings';
        $scope.viewLogged = 'Views/logged/mainLoggedViews/settings/suggestCategory.html';
    }

    $scope.sendCategory = function(category) {
        $http.post(Constants.APIURL + 'logged/sendCategory', { category: category })
            .then(function onSuccess(response) {
                if (response.data.status == 'OK') {
                    $timeout(function() {
                        $scope.$parent.setErrorForKey('send_category');
                        $scope.getSettings();
                    });
                }
            }, function onError(response) {
                if ($scope.$parent.managerErrors(response.data, true))
                    $location.path("/");
                else if (response.data.status == 'expired_session')
                    $location.path("/");
            });
    }

    $scope.getHome = function() {
        $scope.loading = true;
        $scope.active = 'home';
        $scope.viewLogged = 'Views/logged/mainLoggedViews/main.html';

        $http.get(Constants.APIURL + 'logged/getBattles')
            .then(function onSuccess(response) {
                $scope.battlesMyTurn = response.data.battlesMyTurn;
                $scope.battlesForApproval = response.data.battlesForApproval;
                $scope.battlesYourTurn = response.data.battlesYourTurn;
                $scope.battlesFinished = response.data.battlesFinished;
                $scope.loading = false;
            }, function onError(response) {
                if (response.data.status == 'expired_session')
                    AuthService.checkAuthInside($scope.getHome);
            });
    }

    $scope.getStatistics = function() {
        $scope.loading = true;
        $scope.loadingStatistics = true;
        $scope.active = 'statistics';
        $scope.viewLogged = 'Views/logged/mainLoggedViews/statistics.html';
        AuthService.checkAuthInside($scope.getOwnStatistics);
    }

    $scope.getOwnStatistics = function() {
        $scope.activeStatistics = 'profile';
        $scope.viewStatistics = 'Views/logged/mainLoggedViews/statistics/profile.html';

        $scope.loading = false;
        $scope.loadingStatistics = true;
        $scope.loadStatistics();
    }

    $scope.loadStatistics = function() {
        $http.get(Constants.APIURL + 'logged/getStatistics')
            .then(function onSuccess(response) {
                if (response.data.status === 'OK') {
                    $scope.statistics = response.data.statistics;
                    $scope.statistics.percentageOfLevel = CommonFunctionsService.getPercentageOfLevel(response.data.statistics.experience);
                    $scope.statistics.lvl = CommonFunctionsService.getLvl(response.data.statistics.experience);
                    $scope.loadingStatistics = false;
                } else {
                    $scope.$parent.errorGeneral();
                    $location.path("/main");
                }
            }, function onError(response) {
                $scope.$parent.errorGeneral();
                $location.path("/main");
            });
    }

    $scope.loginGetRankingFriends = function() {
        $scope.loadingStatistics = true;

        FaceService.login(function(responseFB) {
            $timeout(function() { $scope.getRankingFriends(); });
        }, function(responseFB) {
            $timeout(function() {
                if (responseFB.status === 'not_authorized')
                    $scope.$parent.setErrorForKey('not_authorized')
                else
                    $scope.$parent.setErrorForKey('not_connected_fb')
                $scope.loadingStatistics = false;
            });
        });
    }

    $scope.loginSettings = function() {
        $scope.loading = true;

        FaceService.login(function(responseFB) {
            $timeout(function() { $scope.getSettings(); });
        }, function(responseFB) {
            $timeout(function() {
                if (responseFB.status === 'not_authorized')
                    $scope.$parent.setErrorForKey('not_authorized')
                else
                    $scope.$parent.setErrorForKey('not_connected_fb')
                $scope.loading = false;
            });
        });
    }

    $scope.getRankingFriends = function() {
        $scope.activeStatistics = 'friends';
        $scope.viewStatistics = 'Views/logged/mainLoggedViews/statistics/friends.html';
        $scope.loadingStatistics = false;
        $scope.loading = false;
    }

    $scope.getRankingGlobal = function() {
        $scope.activeStatistics = 'global';
        $scope.viewStatistics = 'Views/logged/mainLoggedViews/statistics/ranking.html';
        $scope.loadingStatistics = true;
        $scope.btnLoginStatistics = false;
        $scope.hasMoreUser = true;
        $scope.loadPageRankingGlobal(true);
    }

    $scope.loadPageRankingGlobal = function(isFirst) {
        if (isFirst)
            $scope.offset = 0;
        else
            $scope.offset = $scope.offset + 10;

        $http.get(Constants.APIURL + 'logged/getGlobal/' + $scope.offset)
            .then(function onSuccess(response) {
                if (response.data.status == 'OK') {
                    if (isFirst)
                        $scope.users = response.data.users;
                    else {
                        if (response.data.users.length == 0)
                            $timeout(function() { $scope.hasMoreUser = false; });
                        else
                            for (var i = 0; i < response.data.users.length; i++)
                                $scope.users.push(response.data.users[i]);
                    }

                    if (response.data.users.length < 10)
                        $timeout(function() { $scope.hasMoreUser = false; });
                    $scope.loadingStatistics = false;
                }
            }, function onError(response) {
                $scope.$parent.errorGeneral();
                $location.path("/main");
            });
    };

    $scope.getFriends = function() {
        $scope.active = 'friends';
        $scope.viewLogged = 'Views/logged/mainLoggedViews/friends.html';
        $scope.loading = false;
    }

    $scope.facebookFriends = function() {
        console.error("Invito amigos");
    }

    $scope.getSettings = function() {
        $scope.active = 'settings';
        $scope.settingsPreference = [
            { name: "Comprar version premium", show: true, class: "fas fa-shopping-cart", function: "" }
        ];

        $scope.settingsSocial = [
            { name: "Invitar amigos", show: true, class: "fas fa-users", function: $scope.facebookFriends },
            { name: "Seguir FanPage", show: false, class: "fas fa-thumbs-up", function: "" }
        ];
        $scope.viewLogged = 'Views/logged/mainLoggedViews/settings.html';
        $scope.loading = false;
    }

    $scope.getShop = function() {
        $scope.products = [
            { id: 1, img: 'img-coins-0.fw.png', coins: 50, price: 'USD 1,5', function: $scope.buyCoins },
            { id: 2, img: 'img-coins-1.fw.png', coins: 150, price: 'USD 2,5', function: $scope.buyCoins },
            { id: 3, img: 'img-coins-2.fw.png', coins: 300, price: 'USD 2,99', function: $scope.buyCoins },
            { id: 4, img: 'img-coins-3.fw.png', coins: 1200, price: 'USD 4,99', function: $scope.buyCoins },
            { id: 5, img: 'img-coins-4.fw.png', coins: 5000, price: 'USD 12,99', function: $scope.buyCoins }
        ];

        $scope.lives = [
            { id: 1, img: 'lives-infinit.png', lives: 'Vidas infinitas', price: 'USD 49,99' },
            { id: 2, img: 'lives-50.png', lives: '50 vidas', price: 'USD 9,99' },
            { id: 3, img: 'lives-30.png', lives: '30 vidas', price: 'USD 6,75' },
            { id: 4, img: 'lives-10.png', lives: '10 vidas', price: 'USD 2,49' },
            { id: 5, img: 'lives-5.png', lives: '5 vidas', price: 'USD 1,38' }
        ];

        $scope.loading = false;
        $scope.active = 'shop';
        $scope.viewLogged = 'Views/logged/mainLoggedViews/shop.html';
    }
});