var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.controller('HomeCtrl', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {
      $scope.homes;

      $scope.getHomes = function() {
        $http.get('/get/homes')
            .success(function(data, status, headers, config) {
          console.log(data);
          $scope.homes = data;
          $scope.homesfil = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.homes = {};
          $scope.error = data;
        });
      };

      $scope.doQuery = function (keyword, num) {
        if (keyword) {
          if (num) {
            var url = "/get/homes/" + keyword + "++" + num;
            console.log(url);
            $http.get(url)
                .success(function(data, status, headers, config) {
              // console.log(data);
              $scope.homesfil = data;
              $scope.error = "";
            }).
            error(function(data, status, headers, config) {
              $scope.homesfil = {};
              $scope.error = data;
            });
          } else {
            $window.alert("Invalid Input: Please enter a valid number for max queries");
          }
        } else {
          $window.alert("Invalid Input: Please enter a valid keyword");
        }
      };

      $scope.resetHomes = function () {
        $scope.getHomes();
      };

      $scope.setSelected = function () {
        $scope.selectedHome = this.home;
        $scope.setContent('homeDesc.jade');
      };

      $scope.setContent = function(filename) {
        $scope.content = '/public/' + filename;
      };

      $scope.orderByField = 'price';
      $scope.reverseSort = true;

      $scope.getHomes();
}]);


app.controller('EditCtrl', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {

      $scope.user;
      $scope.homes;

      $scope.resetUser = function() {
        $http.get('/user/profile')
            .success(function(data, status, headers, config) {
          console.log(data);
          $scope.user = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.user = {};
          $scope.error = data;
        });
      };

      $scope.getHomes = function() {
        var url = '/get/edithomes';
        $http.get(url)
            .success(function(data, status, headers, config) {
          console.log(data);
          $scope.homesfil = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.homes = {};
          $scope.error = data;
        });
      };

      $scope.setSelected = function () {
        $scope.selectedHome = this.home;
        $scope.setContent('homeEdit.jade');
      };

      $scope.setContent = function(filename) {
        $scope.content = '/public/' + filename;
      };

      $scope.orderByField = 'price';
      $scope.reverseSort = true;

      $scope.resetUser();
      $scope.getHomes();
}]);

app.controller('TempController', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {


}]);

app.controller('AdminCtrl', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {
    $scope.users;
    $scope.homes;

    $scope.genGraph = function(){
      $.ajax({
        dataType: "json",
        url: "/userstats",
        success : function(result){
          createGraph(result);
        }});

      function createGraph (data) {
        $scope.models = data;
        $scope.chartObject = {};

        var rows = [];
        var i;

        for(i = 0; i < $scope.models.length; i++){
          rows[i] = {c:[
                      {v: $scope.models[i]._id},
                      {v: $scope.models[i].count}]};
        }

        $scope.chartObject.data = {"cols":[
                                  {id: "t", label:"Date", type: "string"},
                                  {id : "s", label: "Users", type : "number"}], "rows":rows};

        $scope.chartObject.type = "BarChart";
      }
    };

    $scope.getUsers = function (){
      var url = '/listUsers';
        $http.get(url)
            .success(function(data, status, headers, config) {
          console.log(data);
          $scope.usersfil = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.homes = {};
          $scope.error = data;
        });
    };

    $scope.setSelected = function () {
        $scope.selectedHome = this.home;
        $scope.setContent('homeDesc.jade');
      };

    $scope.setContent = function(filename) {
      $scope.content = '/public/' + filename;
    };

    $scope.getUsers();
}]);
