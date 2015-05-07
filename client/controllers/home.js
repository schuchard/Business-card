angular.module('cardApp')
  .controller('HomeCtrl', function($log, $scope, $window, $rootScope, $auth, Card){

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data);
          $rootScope.currentUser = angular.fromJson($window.localStorage.currentUser);
        })
        .catch(function(response) {
          $log.log(response.data);
        });
    };

    $scope.buildCard = function(){
      Card.getCurrentData().success(function(data){
        $scope.data = data;
      });
    };

    $scope.saveCard = function(input){
      // Build card object with new form data
      var newCard = {
        formattedName: input.formattedName,
        positions: {
          data: input.positions.values[0]
        },
        industry: input.industry,
        description: input.summary,
        skills: input.skills,
        location: input.location,
        pictureUrl: input.pictureUrl,
        profileUrl: input.publicProfileUrl
      };

      // Save card to users profile
      Card.saveCard(newCard).success(function(data){
        $log.log(data);
      }).error(function(err){
        $log.log('error: ',err);
      });
    };

  });

