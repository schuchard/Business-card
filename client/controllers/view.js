angular.module('cardApp')
  .controller('ViewCtrl', function($log, $scope, $window, $rootScope, $routeParams, $auth, Card){

    // Get card from database
    Card.model.get({_id: $routeParams.id},
      function(results){
        $scope.data = results;
      },
      function(err){
        $log.log(err);
      });


  });