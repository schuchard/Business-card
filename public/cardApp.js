var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngResource', 'ngMaterial']);

cardApp.config(function($routeProvider, $httpProvider, $locationProvider){
  // Define routes
  $routeProvider
    .when('/view', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/viewCard',
      controller: 'editController'
    });
});

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

cardApp.controller('viewController', [function(){

}]);