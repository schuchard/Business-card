var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngResource', 'satellizer']);

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
    .when('/about', {
      templateUrl: 'templates/about',
    })
    .otherwise({
      redirectTo:'/'
    });

    // Satellizer LinkedIn authorization
    $authProvider.loginUrl = 'https://digitalbusinesscard.herokuapp.com/auth/login';
    $authProvider.linkedin({
      clientId: '78bd02tirqtsi2',
      url: 'https://digitalbusinesscard.herokuapp.com/auth/linkedin',
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
      redirectUri:  'https://digitalbusinesscard.herokuapp.com',
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