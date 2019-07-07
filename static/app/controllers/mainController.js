(function() {

  // 1. declare our controller.
  function mainController($scope, apptProvider) {

    $scope.threshold = 5;
    $scope.page_load_error = null;
    $scope.finished_loading = false;
    //$scope.finished_loading = true;

    /* function get_appts() {
      $scope.appointments = apptProvider.getAppts().query(function(resp) {
        $scope.finished_loading = true;
        $scope.appointments = resp;
      }, function(err) {
        $scope.page_load_error = err.message;
      });
    }

    get_appts(); */
  }



  // 2. create the controller and give it $scope.
  uchcApp.controller("mainController", ['$scope', 'apptProvider', mainController]);

})();
