angular.module('cardApp')
  .controller('EditCtrl', function($log, $scope, $location, Card){

    // Get current LinkedIn data on page load
    Card.getCurrentData().success(function(data){
      $scope.data = data;
    });


    // Build card object with new form data
    $scope.saveCard = function(input){

      // Holds edited skills from user
      newSkills = [];

      // Loop through all input skills
      input.skills.values.forEach(skillsToArray);

      // Checks for input on each skill, adds to newSkills
      function skillsToArray(element){
        if (element.skill.name.length != 0){
          newSkills.push(element.skill.name);
        }
      }

      // Build new card object
      var newCard = {
        formattedName: input.formattedName,
        email: input.emailAddress,
        // positions: {
          // data: input.positions.values[0]
        // },
        industry: input.industry,
        description: input.summary,
        // skills: newSkills,
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

