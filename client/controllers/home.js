angular.module('cardApp')
  .controller('HomeCtrl', function($log, $scope, $window, $rootScope, $auth, Card){

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data);
          $rootScope.currentUser = angular.fromJson($window.localStorage.currentUser);
        })
        .catch(function(response) {
          $log.log(response.data);
        });
    };

  });

