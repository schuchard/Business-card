angular.module('cardApp')
  .controller('loginController', function($scope, $window, $location, $rootScope, $auth) {

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data.user);
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        })
        .catch(function(response) {
          console.log(response.data);
        });
    };

  });