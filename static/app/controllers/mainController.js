(function() {

  // declare controller
  function mainController($scope, $routeParams, apptProvider) {
    // set threshold to 5 so user isn't REQUIRED to enter/change value
    $scope.threshold = 5;
    // initially set finished_loading to false and page_load_error to null
    $scope.finished_loading = false;
    $scope.page_load_error = null;

    // /main and /main/:timeframe/:threshold use the same controller...
    // check whether or not endpointment has a timeframe parameter
    if ($routeParams.timeframe != null) {
      // call GET on back-end and front-end
      apptProvider.getAppts($routeParams.timeframe, $routeParams.threshold, function(err, appts) {
        // once findNoShows returns result or err...
        // set finished_loading to true
        $scope.finished_loading = true;
        if (err) {
          // if there was a error, set error message
          $scope.page_load_error = "Unable to view appointments: " + JSON.stringify(err);
        } else {
          // otherwise set appointments to result
          $scope.appointments = appts;
        }
      });
    }

  }

  // create the controller and give it $scope
  uchcApp.controller("mainController", ['$scope', '$routeParams', 'apptProvider', mainController]);

})();
