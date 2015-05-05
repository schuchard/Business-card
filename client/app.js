var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngMessages', 'ngResource', 'satellizer']);

cardApp.config(function($routeProvider, $authProvider){

  // Define routes
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home',
      controller: 'loginController'
    })
    .when('/login', {
      templateUrl: 'templates/login',
      controller: 'loginController'
    })
    .when('/account', {
      templateUrl: 'templates/account',
    })
    .when('/detail', {
      templateUrl: 'templates/detail',
      controller: 'viewController'
    })
    .when('/card/:id', {
      templateUrl: 'templates/viewCard',
      controller: 'editController'
    })
    .when('/failed', {
      templateUrl: 'templates/failed',
    })
    .otherwise('/');

    $authProvider.loginUrl = 'http://localhost:3000/auth/login';
    $authProvider.linkedin({clientId: '78bd02tirqtsi2'});
    $authProvider.linkedin({
      url: '/auth/linkedin',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      requiredUrlParams: ['state'],
      scope: [],
      scopeDelimiter: ' ',
      state: 'STATE',
       type: '2.0',
       popupOptions: { width: 527, height: 582 },
      authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization'
    });
});


cardApp.controller('loginController', function ($routeParams,$log,$scope,$http,User){

});

cardApp.controller('viewController', function ($routeParams,$log,$scope,$http,User){
  $scope.user = User.model.get({linkdeinID: $routeParams.id});
});


// Data from server:
cardApp.factory('Card', ['$resource', function($resource){
  // Define and return a resource connection
  var model = $resource(
    '/api/detail/:id',
    {id: '@id'}
  );

  return {
    model: model,
    items: model.query()
  };
}]);

// Data from server:
cardApp.factory('User', ['$resource', function($resource){
  // Define and return a resource connection
  var model = $resource(
    '/api/v1/user/:id',
    {id: '@id'}
  );

  return {
    model: model,
    items: model.query()
  };
}]);


cardApp.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    };
    return auth;
});

// Add an interceptor for AJAX errors
// ================================================

cardApp.factory('authInterceptor', function ($log, $rootScope, $q, $window, $location, AuthenticationService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        config.headers['X-Access-Token'] = $window.sessionStorage.token;
        config.headers['X-Key'] = $window.sessionStorage.user;
        config.headers['Content-Type'] = "application/json";
        $log.log('I have a token');
      }
      return config || $q.when(config);
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set Authentication.isAuthenticated to true if 200 recieved */
    response: function(response){
      if (response !== null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated){
          AuthenticationService.isAuthenticated = true;
          /* Look into watching with scope */
          // $rootScope.isAuth = true;

      }
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function (rejection) {
      if (rejection !== null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
        // handle the case where the user is not authenticated
        delete $window.sessionStorage.token;
        AuthenticationService.isAuthenticated = false;
        /* Look into watching with scope */
        // $rootScope.isAuth = false;

        $location.path('/');
      }
      return $q.reject(rejection);
    }
  };
});

cardApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});