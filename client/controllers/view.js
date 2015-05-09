angular.module('cardApp')
  .controller('ViewCtrl', function($log, $scope, $location, $routeParams, $auth, Card){


    // Get card from database
    Card.model.get({_id: $routeParams.id},
      function(results){
        $scope.data = results;
      },
      function(err){
        $log.log(err);
      });


    // Check if user is authenticated
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };


    // Delete card from database and users account
    $scope.delete = function(cardId){
      Card.remove({_id: cardId},
        function(results){
          $location.path('#/');
        });
    };

  });