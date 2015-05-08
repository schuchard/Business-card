angular.module('cardApp')
  .controller('ViewCtrl', function($log, $scope, $window, $rootScope, $routeParams, $auth, Card){

  if ($auth.isAuthenticated() && $rootScope.currentUser.data.formattedName) {
    Card.model.get({_id: $routeParams.id},
      function(results){
        $scope.data = results;
      },
      function(err){
        $log.log(err);
      });
  }

  });