angular.module('cardApp')
  .controller('FeedCtrl', function($log, $scope, $rootScope, $auth, Card){

  // If user's authenticated, get user's cards
  if ($auth.isAuthenticated() && $rootScope.currentUser.data.formattedName) {
    Card.model.query(function(results){
        $scope.myCards = results;
    });
  }
});