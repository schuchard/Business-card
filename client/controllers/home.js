angular.module('cardApp')
  .controller('HomeCtrl', function($log, $scope, $window, $rootScope, $auth){

    // Check if user is authenticated
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    // Call authenticate with provider argument,
    // set returned user to currentUser
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data);
          $log.log('LS:',$window.localStorage.currentUser);
          $rootScope.currentUser = angular.fromJson($window.localStorage.currentUser);
        })
        .catch(function(response) {
          $log.log(response.data);
        });
    };

  });

