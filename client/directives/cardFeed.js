// Edit Card Directive
angular.module('cardApp')
  .directive('cardFeed', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/cardTab',
    replace: true,
    scope: false
  };
});