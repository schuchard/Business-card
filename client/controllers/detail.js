angular.module('cardApp')
  .controller('DetailCtrl', function($log, $scope, $window, $rootScope, $auth, Card){


    $log.log('ready to load feed');
    Card.model.query({},
      function(results){
        $scope.myCards = results[0].cards;
      },
      function(err){
        $log.log(err);
      });
    // $scope.myCards = data[0];

  if ($auth.isAuthenticated() && $rootScope.currentUser.data.formattedName) {
  }
  });