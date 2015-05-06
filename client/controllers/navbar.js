angular.module('cardApp')
.controller('NavbarCtrl', function($scope, $rootScope,$window, $auth,$location){

  $scope.isAuthenticated = function(){
    return $auth.isAuthenticated();
  };

  $scope.logout = function(){
    $auth.logout();
    delete $window.localStorage.currentUser;
  };

});