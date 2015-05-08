angular.module('cardApp')
  .controller('DetailCtrl', function($log, $scope, $window, $rootScope, $auth, Card){


  if ($auth.isAuthenticated() && $rootScope.currentUser.data.formattedName) {
    Card.model.query({},
      function(results){
        $scope.myCards = results[0].cards;
      },
      function(err){
        $log.log(err);
      });
  }
  });