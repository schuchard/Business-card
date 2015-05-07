// Edit Card Directive
angular.module('cardApp')
  .directive('editCard', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/editCard',
    replace: true,
    scope: true
  };
});