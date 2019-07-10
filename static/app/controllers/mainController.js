(function() {

  // 1. declare our controller.
  function mainController($scope, $routeParams, apptProvider) {
    console.log("Controller connected!");
    $scope.threshold = 5;
    $scope.finished_loading = false;
    $scope.page_load_error = null;

    $scope.getDaily = function() {
      console.log("getDaily in controller callled");
      apptProvider.getDailyAppts($routeParams.threshold, function(err, appts) {
      //apptProvider.getDailyAppts($scope.threshold, function(err, appts) {
        console.log("getDailyAppts from provider called in controller");
        $scope.finished_loading = true;
        if (err) {
          $scope.page_load_error = "Unable to view appointments: " + JSON.stringify(err);
        } else {
          console.log(appts);
          $scope.appointments = appts;
        }
      });
    }

    //$scope.getWeekly = function() {
      console.log("getWeekly in controller callled");
      apptProvider.getWeeklyAppts($routeParams.threshold, function(err, appts) {
      //apptProvider.getWeeklyAppts($scope.threshold, function(err, appts) {
        console.log("getWeeklyAppts from provider called in controller");
        $scope.finished_loading = true;
        if (err) {
          $scope.page_load_error = "Unable to view appointments: " + JSON.stringify(err);
        } else {
          console.log(appts);
          $scope.appointments = appts;
        }
      });
    //}


  }

  // 2. create the controller and give it $scope.
  uchcApp.controller("mainController", ['$scope', '$routeParams', 'apptProvider', mainController]);

})();
