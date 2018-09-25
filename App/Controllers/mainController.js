 app.controller('mainController', function(ModalService, $rootScope, $scope, $location, $http, $window, $timeout, Constants, FaceService) {
     $scope.bg = '#61A4FF';
     $scope.alertList = [];
     $scope.hidden = false;
     $scope.startFade = false;

     $scope.openModal = function(id) { ModalService.Open(id); }
     $scope.closeModal = function(id) { ModalService.Close(id); }
     $scope.initController = function() { $scope.bodyText = 'This text can be updated in modal 1'; }
     $scope.initController();

     $scope.cleanErrorsAllTime = function() {
         var totalOut = $scope.alertList.length;
         $scope.startFade = true;
         $timeout(function() {
             $scope.startFade = false;
             $scope.hidden = false;
             if (totalOut === $scope.alertList.length)
                 $scope.cleanErrors();
             $timeout(function() {
                 $scope.cleanErrorsAllTime();
             }, 5000);
         }, 1000);
     };

     $scope.cleanErrorsAllTime();

     $scope.back = function() {
         if ($scope.pathBack)
             $location.path($scope.pathBack);
         else
             $location.path('/');
     }

     $scope.cleanErrors = function() { $scope.alertList = []; }
     $scope.close = function(index) { $scope.alertList.filter(function(alert) { return (alert.index != index); }); }

     $scope.resetTimer = function() {
         $rootScope.dataUser.lives = $rootScope.dataUser.lives + 1;
         ($rootScope.dataUser && $rootScope.dataUser.lives < 3) ? $scope.$broadcast("timer-add-cd-seconds", 3600): $rootScope.time = 0;
     }

     $scope.errorGeneral = function() {
         $scope.alertList.push({ text: "ERROR GENERAL", type: "danger" });
         // $scope.alertList.push({ text: "Ocurrio un error, intente nuevamente. Contacte al administrador AQUI!.", type: "danger" });
     }

     $scope.managerErrors = function(data, pushError) {
         var isNecessaryToRedirect = true;
         if (data.status != undefined)
             isNecessaryToRedirect = $scope.setErrorForKey(data.status, pushError);
         else
             $scope.errorGeneral();
         return isNecessaryToRedirect;
     }

     $scope.setErrorForKey = function(key, pushError) {
         switch (key) {
             case 'without_lives':
                 {
                     return false;
                     break;
                 }
             case 'waiting_opponent':
                 {
                     $scope.alertList = [{ text: "Es turno del oponente.", type: "danger" }];
                     return true;
                     break;
                 }
             case 'time_out':
                 {
                     if (pushError)
                         $scope.alertList = [{ text: "Oops! Se ha agotado el tiempo.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'incorrect_answer':
                 {
                     return false;
                     break;
                 }
             case 'insufficient_coins':
                 {
                     $scope.alertList = [{ text: "OOps! No tienes monedas suficientes.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'password_required':
                 {
                     $scope.alertList = [{ text: "El campo contraseña es obligatorio.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'category_required':
                 {
                     $scope.alertList = [{ text: "El campo categoría es necesario.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'password_incorrect':
                 {
                     $scope.alertList = [{ text: "Los datos ingresados no son correctos.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'username_not_unique':
                 {
                     $scope.alertList = [{ text: "El usuario ya se encuentra en uso.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'finished_game':
                 {
                     return false;
                     break;
                 }
             case 'expired_session':
                 {
                     if (pushError)
                         $scope.alertList = [{ text: "La sesión ha caducado.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'not_authorized':
                 {
                     $scope.alertList = [{ text: "Oops! No tenemos permiso para acceder con Facebook.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'not_finished':
                 {
                     $scope.alertList = [{ text: "La partida aun no finaliza.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'not_connected_fb':
                 {
                     $scope.alertList = [{ text: "Oops! No pudimos conectar con facebook.", type: "danger" }];
                     return false;
                     break;
                 }
             case 'username_updated':
                 {
                     $scope.alertList = [{ text: "El usuario se actualizo con éxito.", type: "success" }];
                     return false;
                     break;
                 }
             case 'password_updated':
                 {
                     $scope.alertList = [{ text: "La contraseña se actualizo con éxito.", type: "success" }];
                     return false;
                     break;
                 }
             case 'send_category':
                 {
                     $scope.alertList = [{ text: "Gracias, analizaremos la categoría y le informaremos.", type: "success" }];
                     return false;
                     break;
                 }
             case 'send_answer':
                 {
                     $scope.alertList = [{ text: "Gracias, analizaremos la respuesta y le informaremos.", type: "success" }];
                     return false;
                     break;
                 }
             default:
                 {
                     $scope.errorGeneral();
                     return true;
                     break;
                 }
         }
     }
 });