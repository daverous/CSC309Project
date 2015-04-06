var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'googlechart']);

app.controller('HomeCtrl', ['$scope', '$http', '$location', '$window',
                                function($scope, $http, $location, $window) {
      $scope.homes;

      $scope.getHomes = function() {
        $http.get('/get/homes')
            .success(function(data, status, headers, config) {
          //console.log(data);
          $scope.homes = data;
          $scope.homesfil = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.homes = {};
          $scope.error = data;
        });
      };

      $scope.isRenting = function(hid){
        console.log(hid);
        $http({
          url: '/getHome', 
          method: "GET",
          params: {hid: hid}
          }).success(function(data){
            if (data){
              console.log(data);
              console.log("I am renting!");
              $("#ratingForm").removeClass("hidden");
              $("#rentBtn").addClass("hidden");
            }
          });
      }

      $scope.doQuery = function (keyword, num) {
        if (keyword) {
          if (num) {
            var url = "/get/homes/" + keyword + "++" + num;
            //console.log(url);
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
          //console.log(data);
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
          //console.log(data);
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

    $scope.user;
    $scope.homes;
    $scope.selected = ['showGraph'];

    $http.get("/userstats")
        .success(function(data, status, headers, config) {
      //console.log(data);
      $scope.models = data;
      $scope.error = "";
    }).
    error(function(data, status, headers, config) {
      $scope.models = {};
      $scope.error = data;
    });

    $scope.genGraph = function () {
      // $scope.models = data;
      // console.log($scope.models);
      $scope.chartObject = {};

      var rows = [];
      var i;

      for(i = 0; i < $scope.models.length; i++){
        var temp1 = $scope.models[i]._id.day + "-" + $scope.models[i]._id.month + "-" + $scope.models[i]._id.year;
        temp1 = String(temp1);
        var temp2 = $scope.models[i].count;
        temp2 = Number(temp2);
        rows[i] = {c:[
                    {v: temp1},
                    {v: temp2}]};
      }
      $scope.chartObject.data = {"cols":[
                                {id: "t", label:"Date", type: "string"},
                                {id : "s", label: "Users", type : "number"}],
                                "rows":rows};

      $scope.chartObject.type = "BarChart";

      $scope.chartObject.options = {
          'title': 'How many users have joined'
      }
  };

  $scope.getUsers = function(){
        var url = '/listUsers';
        $http.get(url)
          .success(function(data, status, headers, config) {
          //console.log(data);
          $scope.usersfil = data;
          $scope.error = "";
        }).
        error(function(data, status, headers, config) {
          $scope.users = {};
          $scope.error = data;
        });
      };

   
  $scope.getHomes = function() {
        var url = '/get/homes';
        $http.get(url)
            .success(function(data, status, headers, config) {
          //console.log(data);
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
      $scope.setContent('homeDesc.jade');
    };

  $scope.setStats = function(){
    $scope.setContent('showStats.jade');
  };
  
  $scope.setContent = function(filename) {
    $scope.content = '/public/' + filename;
  };

  $scope.select = function(id) {
    $scope.selected.pop();
    $scope.selected.push(id);
  };

  $scope.isSelected = function(id) {
    if($scope.selected.length == 0){
      return false;
    }
    return $scope.selected.indexOf(id) > -1
  };

  $scope.toggleDelUser = function(id){
    console.log(id);
    var mod = $('#modUser' + id);
    var del = $('#delUser' + id);
    if (mod.val() == 0) {
        mod.val(1);
    }
    if (del.val() == 0) {
        del.val(1);
    } else {
        del.val(0);
    }
  };

  $scope.toggleDelHouse = function(id) {
    var del = $('#delHouse' + id);
    if (del.val() == 0) {
        del.val(1);
    } else {
        del.val(0);
    }
  };


  $scope.modifyUser = function(id) {
      var mod = $('#modUser' + id);
      mod.val(1);
  };

  $scope.orderByField = 'firstName';
  $scope.reverseSort = true;

  $scope.setStats();
  $scope.getUsers();
  $scope.getHomes();

}]);
