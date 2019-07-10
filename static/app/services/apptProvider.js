(function () {

    function apptProvider($http) {

        this._server_host = "";

        this.getDailyAppts = function (threshold, callback) {
            $http.get(this._server_host + "/main/day/" + threshold )
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

        this.getWeeklyAppts = function (threshold, callback) {
            $http.get(this._server_host + "/main/week/" + threshold )
                .success(function (data, status, headers, conf) {
                    callback(null, data);
                })
                .error(function (data, status, headers, conf) {
                    callback(data);
                });
        };

    }

    uchcApp.service("apptProvider", [ "$http", apptProvider]);

})();
