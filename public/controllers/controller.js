var app = angular.module('myApp', ['toastr', '720kb.datepicker']);

app.controller('myCtrl', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
    console.log('tudek');
    $scope.addButtonVisible = false;
    $scope.hideAddButton = function () {
        $scope.addButtonVisible = false;
    }
    $scope.showAddButton = function () {
        $scope.addButtonVisible = true;
    }

    $scope.open = function () {
        $scope.visible = false;
        $scope.visible = $scope.visible = true;
    }

    $scope.close = function () {
        $scope.visible = true;
        $scope.visible = $scope.visible = false;
    }

    $scope.confirm = function (id) {
        var id = id
        $scope.visible2 = false;
        $scope.visible2 = $scope.visible2 = true;
        $scope.test = id
    }
    $scope.confirm2 = function () {
        $scope.visible2 = true;
        $scope.visible2 = $scope.visible2 = false;
    }
    var refresh = function () {
        $http.get('/calendar').then(function (response) {
            console.log("I got the data I requested");
            $scope.eventList = response.data;
        });
    };

    var costTotal = function(){
      $http.get('/totalCost').then(function (response) {
          $scope.juhu = response.data;
          console.log($scope.juhu)
      });
    }


    refresh();
    costTotal();

    $scope.submit = function () {
        $http.post('/calendar', $scope.event).then(function (response) {
            console.log(response);
            refresh();
            $scope.event.name = "";
            $scope.event.date = "";
            $scope.event.cost = "";
            toastr.success('Event added successfully');
        });
    }
    $scope.delete = function (id) {
        console.log(id);
        $http.delete('/calendar/' + id).then(function (response) {
            refresh();
            toastr.error('Event deleted successfully');
        });
    };
    $scope.edit = function (id) {
        console.log(id);
        $http.get('/calendar/' + id).then(function (response) {
            $scope.event = response.data;
        });
    };

    $scope.update = function () {

        $http.put('/calendar/' + $scope.event._id, $scope.event).then(function (response) {
            refresh();
            $scope.event.name = "";
            $scope.event.date = "";
            $scope.event.cost = "";
            toastr.success('Item updated successfully');
        })
    };


}]);
