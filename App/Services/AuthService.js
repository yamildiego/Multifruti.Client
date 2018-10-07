app.service('AuthService', function($rootScope, Constants, $http, $window, FaceService, CommonFunctionsService) {
    return {
        checkAuthInside: function(callBackFunction) {
            $rootScope.loadMain = true;
            $http.get(Constants.APIURL + 'Identifier/getLoginStatus')
                .then(function onSuccess(response) {
                    if (response.data.status == 'OK') {
                        $rootScope.userFB = response.data.userFB;
                        $rootScope.dataUser = response.data.dataUser;
                        $rootScope.dataUser.coins = CommonFunctionsService.convertFormatNumberKK(response.data.dataUser.coins);
                        $rootScope.time = response.data.dataUser.timer;

                        if (callBackFunction)
                            callBackFunction();
                    }
                    $rootScope.loadMain = false;
                }, function onError(response) {
                    if (response.data.status == 'expired_session') {
                        FaceService.getLoginStatus(function(responseFB) {
                            $http.post(Constants.APIURL + 'Identifier/login', { userFBID: responseFB.authResponse.userID })
                                .then(function onSuccess(response) {
                                    $http.get(Constants.APIURL + 'Identifier/getLoginStatus')
                                        .then(function onSuccess(response) {
                                            if (data.status == 'OK') {
                                                $rootScope.userFBID = response.data.userFB.id;
                                                $rootScope.userFB = response.data.userFB;
                                                $rootScope.dataUser = response.data.dataUser;
                                                $rootScope.time = response.data.dataUser.timer;

                                                if (callBackFunction)
                                                    callBackFunction();
                                            }
                                            $rootScope.loadMain = false;
                                        }, function onError(response) {
                                            $window.location.href = Constants.FRONTURL + '#!/';
                                        });
                                });

                        }, function(responseFB) {
                            $window.location.href = Constants.FRONTURL + '#!/'
                        });
                    }
                });
            $rootScope.loadMain = false;
        }
    }
});