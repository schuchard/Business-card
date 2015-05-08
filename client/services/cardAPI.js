angular.module('cardApp')
    .factory('Card', function($http, $resource) {

      var model = $resource(
        '/api/v1/detail/:id',
        {id: '@id'}
      );

      return {

        model: model,

        remove: model.delete,

        post: model.post,

        getCurrentData: function(){
          return $http.get('http://localhost:3000/api/v1/build');
        }
      };
    });