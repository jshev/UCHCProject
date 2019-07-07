(function() {

  function apptProvider($resource) {

    this._server_host = "";
    /*this.getAppts = function() {
      return $resource(this._server_host + "/main", null, {
        'update': {
          method: 'PUT'
        }
      })
    } */

  }

  uchcApp.service("apptProvider", ["$resource", apptProvider]);

})();
