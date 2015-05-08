var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngMessages', 'ngResource', 'satellizer']);

cardApp.config(function($routeProvider, $authProvider){

  // Define routes
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home',
      controller: 'HomeCtrl'
    })
    .when('/view/:id', {
      templateUrl: 'templates/viewCard',
      controller: 'ViewCtrl'
    })
    .when('/edit', {
      templateUrl: 'templates/editCard',
      controller: 'EditCtrl'
    })
    .otherwise({
      redirectTo:'/'
    });

    // Satellizer LinkedIn authorization
    $authProvider.loginUrl = 'http://localhost:3000/auth/login';
    $authProvider.linkedin({
      clientId: '78bd02tirqtsi2',
      url: '/auth/linkedin',
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
      redirectUri:  window.location.origin || window.location.protocol + '//' + window.location.host + '/',
      requiredUrlParams: ['state'],
      scope: [],
      scopeDelimiter: ' ',
      state: 'STATE',
       type: '2.0',
       popupOptions: { width: 527, height: 582 },
    });
  })
  .run(function($rootScope, $window, $auth, $log) {
    if ($auth.isAuthenticated()) {
      $rootScope.currentUser = angular.fromJson($window.localStorage.currentUser);
    }
  });