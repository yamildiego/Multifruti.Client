app.controller('homeController', function($rootScope, $scope, $window, $timeout, Constants, AuthService, FaceService) {
    $scope.$parent.bg = '#61A4FF';
    $scope.$parent.bgMain = 'transparent';

    $scope.login = function() {
        $rootScope.loadMain = true;
        FaceService.login(function(responseFB) {
            $timeout(function() { $window.location.href = Constants.FRONTURL + '#!/main'; });
        }, function(responseFB) {
            $timeout(function() {
                if (responseFB.status === 'not_authorized')
                    $scope.errorFB("Oops! No tienes permiso para acceder con Facebook.");
                else
                    $scope.errorFB("Oops! No pudimos conectar con facebook.");

                $rootScope.loadMain = false;
            });
        });
    }

    $scope.errorFB = function(text) {
        $scope.$parent.alertList = [{ text: text, type: "danger" }];
        $rootScope.loadMain = false;
    }

    $scope.login();
});