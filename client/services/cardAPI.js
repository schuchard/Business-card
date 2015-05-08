angular.module('cardApp')
    .factory('Card', function($http, $resource) {

      var model = $resource(
        '/api/v1/detail/:id',
        {id: '@id'}
      );

      return {

        model: model,

        getCurrentData: function(){
          return $http.get('http://localhost:3000/api/v1/build');
        },

        saveCard: function(data){
          return $http.post('http://localhost:3000/api/v1/detail', {cardData: data});
        },
      };

    });