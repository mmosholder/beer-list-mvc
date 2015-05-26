var beerApp = angular.module('beerApp', ['ngResource', 'ngRoute']);

beerApp.config(function ($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/home',
      controller: 'beerListController'
    });
});

