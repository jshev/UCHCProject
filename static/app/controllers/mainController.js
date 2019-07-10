(function() {

  // 1. declare our controller.
  function mainController($scope, $routeParams, apptProvider) {
    //console.log("Controller connected!");
    $scope.threshold = 5;
    $scope.finished_loading = false;
    $scope.page_load_error = null;

    apptProvider.getAppts($routeParams.timeframe, $routeParams.threshold, function(err, appts) {
      //console.log("getAppts from provider called in controller");
      $scope.finished_loading = true;
      if (err) {
        $scope.page_load_error = "Unable to view appointments: " + JSON.stringify(err);
      } else {
        //console.log(appts);
        $scope.appointments = appts;
      }
    });

  }

  // 2. create the controller and give it $scope.
  uchcApp.controller("mainController", ['$scope', '$routeParams', 'apptProvider', mainController]);

})();
