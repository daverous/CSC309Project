var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.controller('HomeCtrl', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {
      $scope.homes;

      $scope.getHomes = function() {
        $http.get('/get/homes')
            .success(function(data, status, headers, config) {
          console.log(data);
          $scope.homes = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.homes = {};
          $scope.error = data;
        });
      };

      $scope.setContent = function(filename) {
        $scope.content = '/public/' + filename;
      };

      $scope.orderByField = 'price';
      $scope.reverseSort = true;

      $scope.getHomes();
}]);


app.controller('TempController', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {


}]);
