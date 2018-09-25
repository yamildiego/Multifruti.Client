app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'Views/home.html',
            controller: 'homeController'
        })
        .when('/main', {
            templateUrl: 'Views/logged/mainLoggedViews/baseMain.html',
            controller: 'mainLoggedController'
        })
        .when('/newGame', {
            templateUrl: 'Views/logged/newGame.html',
            controller: 'newGameController'
        })
        .when('/newGame/:friendIdFb', {
            templateUrl: 'Views/logged/newGame.html',
            controller: 'newGameController'
        })
        .when('/letterSelection/:idBattle', {
            templateUrl: 'Views/logged/letterSelection.html',
            controller: 'letterSelectionController'
        })
        .when('/play/:idRound', {
            templateUrl: 'Views/logged/play.html',
            controller: 'playController'
        })
        .when('/showRound/:idRound', {
            templateUrl: 'Views/logged/showRound.html',
            controller: 'showRoundController'
        })
        .when('/showRound/:idRound/:firstTime', {
            templateUrl: 'Views/logged/showRound.html',
            controller: 'showRoundController'
        })
        .when('/showBattle/:idBattle', {
            templateUrl: 'Views/logged/showBattle.html',
            controller: 'showBattleController'
        })
        .when('/shopLives', {
            templateUrl: 'Views/logged/shopLives.html',
            controller: 'shopLivesController'
        })
        .otherwise({
            redirectTo: '/'
        });
});