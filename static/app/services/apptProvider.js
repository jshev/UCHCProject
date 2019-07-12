(function() {

  // declare provider
  function apptProvider($http) {

    this._server_host = "";
    // used in mainController
    // performs findNoShows on back-end...
    this.getAppts = function(timeframe, threshold, callback) {
      $http.get(this._server_host + "/main/" + timeframe + "/" + threshold)
        .success(function(data, status, headers, conf) {
          // returns results to be displayed on front-end...
          callback(null, data);
        })
        .error(function(data, status, headers, conf) {
          // or returns error
          callback(data);
        });
    }

  }

  // create the provider and give it access to HTTP
  uchcApp.service("apptProvider", ["$http", apptProvider]);

})();
