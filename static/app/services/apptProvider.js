(function () {

    function apptProvider($http) {

        this._server_host = "";

        this.getAppts = function(timeframe, threshold, callback) {
          $http.get(this._server_host + "/main/" + timeframe + "/" + threshold )
              .success(function (data, status, headers, conf) {
                  callback(null, data);
              })
              .error(function (data, status, headers, conf) {
                  callback(data);
              });
        }

    }

    uchcApp.service("apptProvider", [ "$http", apptProvider]);

})();
