var beerApp = angular.module('beerApp', ['ngResource', 'ngRoute']);

beerApp.config(function ($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/home',
      controller: 'beerListController'
    });
});

beerApp.controller('addUserController', function ($scope) {
    $scope.addUser = function () {
    }
})

