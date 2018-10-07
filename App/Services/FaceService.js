app.factory('FaceService', function($rootScope, $window, $q, $http, Constants) {
    return {
        getLoginStatus: function(callBackOk, callBackError) {
            var _self = this;

            if (typeof(FB) != 'undefined' && FB != null) {
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        if (callBackOk)
                            callBackOk(response);
                    } else if (response.status === 'not_authorized') {
                      if (callBackOk)
                            callBackOk(response);
                    } else if (callBackError) {
                        callBackError(response);
                    }
                }, true);
            } else {
                _self.initialize().then(function() {
                    _self.getLoginStatus(callBackOk, callBackError);
                });
            }
        },
        getUserInfo: function() {
            FB.api('/me?fields=id,first_name,email,picture.width(160).height(160),cover', function(response) {
                if (!response.hasOwnProperty('error')) {
                    $rootScope.userFB = response;
                    $rootScope.loadMain = false;
                }
            }, { scope: 'public_profile, email, user_friends' });
        },
        logout: function() {
            var _self = this;

            var defered = $q.defer();
            var promise = defered.promise;

            _self.getLoginStatus(function(response) {
                FB.logout(function(response) {
                    $rootScope.userFB = undefined;
                    defered.resolve(response);
                });
            }, function(response) {
                defered.resolve();
            });

            return promise;
        },
        login: function(callBackOk, callBackError) {
            var _self = this;
            if(typeof FB == "undefined"){
                _self.getLoginStatus(function(){
                    _self.login(callBackOk, callBackError);
                });
            } else {
                FB.login(function(response) {
                    if (response.status === 'connected') {
                        FB.api('/me?fields=id,first_name,last_name,email,picture.width(160).height(160),cover', function(response) {
                            if (!response.hasOwnProperty('error')) {
                                $http.post(Constants.APIURL + 'identifier/updateInfo', response)
                                    .then(function onSuccess(response) {
                                        $rootScope.userFB = response.data.userFB;
                                        $rootScope.dataUser = response.data.dataUser;
                                        $rootScope.time = response.data.dataUser.timer;
                                        if (callBackOk)
                                            callBackOk(response);
                                    });
                            }
                        }, { scope: 'public_profile, email, user_friends' });
                    } else if (callBackError)
                        callBackError(response);
                }, { scope: 'public_profile, email, user_friends' });                
            }
        },
        initialize: function() {
            var defered = $q.defer();
            var promise = defered.promise;

            $window.fbAsyncInit = function() {
                FB.init({
                    appId: '219923048574583',
                    cookie: true, // enable cookies to allow the server to access 
                    // the session
                    xfbml: true, // parse social plugins on this page
                    version: 'v2.8' // use graph api version 2.8
                });

                defered.resolve();
            };

            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            return promise;
        }
    }
});