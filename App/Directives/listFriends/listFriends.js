app.directive('listFriends', function(FaceService, $timeout, $http, $location, Constants, CommonFunctionsService) {
    return {
        restrict: 'E',
        scope: {
            me: '@',
            color: '@',
            btns: '=',
        },
        link: function(scope, element, attrs) {

            function initialize() {
                scope.loadingFB = true;
                scope.btnLoginFB = true;
                scope.CommonFunctionsService = CommonFunctionsService;

                FaceService.getLoginStatus(function(responseFB) {
                    if (responseFB.authResponse && responseFB.authResponse.userID) {
                        scope.btnLoginFB = false;
                        FB.api('/' + responseFB.authResponse.userID + '/friends', 'GET', {},
                            function(responseFB) {
                                $http.post(Constants.APIURL + 'logged/getFriends', { data: responseFB.data, withMe: (!scope.me) ? 'ME' : '' })
                                    .then(function onSuccess(response) {
                                        if (response.data.status == 'OK') {
                                            scope.users = response.data.friends;
                                            scope.loadingFB = false;
                                        }
                                    });
                            });
                    }
                }, function(responseFB) {
                    $timeout(function() { scope.loadingFB = false; });
                });
            }

            scope.loginFB = function() {
                scope.loadingFB = true;
                FaceService.login(function(responseFB) {
                    $timeout(function() { initialize(); });
                }, function(responseFB) {
                    $timeout(function() { scope.loadingFB = false; });
                });
            }

            scope.facebookFriends = function() {
                console.error("Invito amigos en directiva");
            }

            scope.playWithFriend = function(friendIdFb) {
                $location.path('/newGame/' + friendIdFb);
            }

            initialize();
        },
        templateUrl: "./App/Directives/listFriends/listFriends.html"
    }
});