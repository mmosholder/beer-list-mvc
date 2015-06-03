var beerApp = angular.module('beerApp', ['ngResource', 'ngRoute', 'ui.router', 'ngAnimate']);

beerApp.config(function ($routeProvider){
  $routeProvider
    .when('/', {
        templateUrl: '/template/dataFeed',
    });
});

beerApp.controller('dataController', function ($scope, $http) {
    $scope.newLocation = function () {
        $http.get('/api/getFeeds', {params: {location: $scope.newFeed.location}}).success(function (data) {
            console.log(data);
            $scope.feed = data;
        });
    };

    $scope.secondarySearchForm = false;
    $scope.initialSearch = true;
    $scope.initialLoadContent = true;

    $scope.secondarySearch = function () {
        $scope.initialSearch = !$scope.initialSearch;
        $scope.secondarySearchForm = !$scope.secondarySearchForm;
        $scope.initialLoadContent = !$scope.initialLoadContent;
    };

});


