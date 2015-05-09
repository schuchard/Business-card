angular.module('cardApp')
  .controller('FeedCtrl', function($log, $scope, $rootScope, $auth, Card){


  if ($auth.isAuthenticated() && $rootScope.currentUser.data.formattedName) {
    Card.model.query(function(results){
        $scope.myCards = results;
    });
  }
});