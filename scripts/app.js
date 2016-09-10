var app = angular.module('myApp', ['chart.js']);

app.controller('myController', [
  '$scope',
  function ($scope) {
    $scope.calculate = function () {
      var total = $scope.people * $scope.lessons;
      if ($scope.noAttendance > 0) {
        $scope.percentage = ((total - (total - $scope.noAttendance)) / total) * 100;
      } else {
        $scope.percentage = 0;
      }

      $scope.labels = ['No Attendance', 'Attendance'];
      $scope.data = [$scope.percentage, 100 - $scope.percentage];
    }
  }
])
