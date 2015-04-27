var cardApp = angular.module('cardApp',
  ['ngRoute', 'ngResource', 'ngMaterial']);

cardApp.config(function($routeProvider, $httpProvider, $locationProvider){


  // Define routes
  $routeProvider
    .when('/', {
      controller: 'loginController'
    })
    .when('/login', {
      templateUrl: '/templates/login'
    })
    .when('/account', {
      templateUrl: '/templates/account',
    })
    .when('/view', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/viewCard',
      controller: 'editController'
    })
    .when('/failed', {
      templateUrl: 'templates/failed',
    })
    .otherwise({
      redirectTo:'/'
    });
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


cardApp.controller('viewController', [function(){

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