angular.module('cardApp')
  .controller('HomeCtrl', function($log, $scope, $window, $rootScope, $auth, Card){

    // $log.log(currentUser);
     if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
      // Card.getFeed().success(function(data) {
      //   $scope.photos = data;
      // });
    }

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $log.log('response: ', response);
          $window.localStorage.currentUser = JSON.stringify(response.data);
          $rootScope.currentUser = angular.fromJson($window.localStorage.currentUser);
          $log.log('currentUser: ', $rootScope.currentUser);
        })
        .catch(function(response) {
          $log.log(response.data);
        });
    };

    $scope.buildCard = function(){
      $log.log('click');
      Card.getCurrentData().success(function(data){
        $scope.data = data;
      });
    };

  });

