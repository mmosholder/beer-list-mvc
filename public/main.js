var beerApp = angular.module('beerApp', ['ngResource', 'ngRoute', 'ui.router']);

beerApp.config(function ($routeProvider){
  $routeProvider
    .when('/', {
        templateUrl: '/template/dataFeed',
    });
});

beerApp.controller('dataController', function ($scope, $http) {
    $scope.newLocation = function () {
        $http.get('/api/getTweets', {params: {location: $scope.newFeed.location}}).success(function (data) {
            $scope.feed = data.tweets;
        });
    };
});


