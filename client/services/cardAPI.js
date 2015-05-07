angular.module('cardApp')
    .factory('Card', function($http, $resource) {

      // var model = $resource(
      //   '/api/detail/:id',
      //   {id: '@id'}
      // );

      return {

        // model: model,

        // items: model.query(),

        getCurrentData: function(){
          return $http.get('http://localhost:3000/api/v1/build');
        },

        saveCard: function(data){
          return $http.post('http://localhost:3000/api/v1/detail', {cardData: data});
        },

        getFeed: function() {
          return $http.get('http://instagram-server.herokuapp.com/api/feed');
        },
        getMediaById: function(id) {
          return $http.get('http://instagram-server.herokuapp.com/api/media/' + id);
        },
        likeMedia: function(id) {
          return $http.post('http://instagram-server.herokuapp.com/api/like', { mediaId: id });
        }
      };

    });