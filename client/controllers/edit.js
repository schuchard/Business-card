angular.module('cardApp')
  .controller('EditCtrl', function($scope, $location, Card){

    // Get current LinkedIn data on page load
    Card.getCurrentData().success(function(data){
      $scope.data = data;
    });


    // Build card object with new form data
    $scope.saveCard = function(input){
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
      Card.model.save(newCard, function(data){
        $location.path('#/');
      });
    };


    // Cancel card edit
    $scope.cancel = function(){
      $location.path('#/');
    };

  });

