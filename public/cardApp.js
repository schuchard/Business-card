var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngResource', 'ngMaterial']);

cardApp.config(function($routeProvider, $httpProvider, $locationProvider){
  // Define routes
  $routeProvider
    .when('/', {
      controller: 'loginController'
    })
    .when('/view', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/viewCard',
      controller: 'editController'
    });
});


cardApp.controller('viewController', [function(){

}]);

cardApp.controller('loginController', ['$log','$http','$scope', function($log, $http, $scope){

  $scope.login = function(){

    $http.get('https://www.linkedin.com/uas/oauth2/authorization')
      .success(function(data){
        $log.log('success data: ', data);
      })
      .error(function(error){
        $log.log('error: ', error);
      });
  };
}]);

// Data from server:
cardApp.factory('Card', ['$Resource', function($Resource){
  // Define and return a resource connection
  var model = $resource(
    '/api/view/:id',
    {id: '@id'}
  );

  return {
    model: model,
    items: model.query()
  };
}]);

cardApp.factory('AuthService', ['$resource', function($resource){

  );
}]);