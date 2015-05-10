angular.module('cardApp')
.controller('NavbarCtrl', function($scope, $rootScope, $window, $auth, $location, $log){

  // Check if user is authenticated
  $scope.isAuthenticated = function(){
    return $auth.isAuthenticated();
  };

  // Logout user
  $scope.logout = function(){
    $auth.logout();
    delete $window.localStorage.currentUser;
    delete $rootScope.currentUser;
  };

  // Authenticate user
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