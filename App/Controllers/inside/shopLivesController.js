app.controller('shopLivesController', function($scope, $location, AuthService) {
    $scope.loading = true;
    $scope.$parent.bg = '';
    AuthService.checkAuthInside(function() { $scope.initialize(); });

    $scope.initialize = function() {
        $scope.products = [
            { id: 1, img: 'lives-infinit.png', lives: 'Vidas infinitas', price: 'USD 49,99' },
            { id: 2, img: 'lives-50.png', lives: '50 vidas', price: 'USD 9,99' },
            { id: 3, img: 'lives-30.png', lives: '30 vidas', price: 'USD 6,75' },
            { id: 4, img: 'lives-10.png', lives: '10 vidas', price: 'USD 2,49' },
            { id: 5, img: 'lives-5.png', lives: '5 vidas', price: 'USD 1,38' }
        ];
        $scope.loading = false;
        $scope.active = 'shop';
        $scope.viewLogged = 'Views/logged/shopLives.html';
    }

    $scope.back = function() { $location.path("/main"); }
});