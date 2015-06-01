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
            console.log(data);
            $scope.feed = data.tweets;
        });
        // $http.get('/api/getFbFeed', {params: {location: $scope.newFeed.location}}).success(function (data) {
        //     console.log(data);
        //     $scope.feed = data.results;
        // });
    };
});


