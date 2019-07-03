var router = require('./router');
var athenahealthapi = require('./athenahealthapi');
var events = require('events');

var UCHCapp = angular.module('UCHCapp', []);
UCHCapp.controller("mainController", ['$scope', function($scope) {
  $scope.threshold = 5;
  $scope.appointments = [];
  $scope.feedback = "";
  $scope.visibility = "hidden";

  $scope.getNoShowsTomorrow = function() {
    $scope.visibility = "hidden";
    $scope.appointments = [];
    $scope.feedback = “Processing…”;

    // CONNECT TO API... see athenahealthapi.js for details
    var api = new athenahealthapi.Connection(router.version, router.key, router.secret, router.practiceid)
    api.status.on('ready', function() {
      var signal = new events.EventEmitter;
      var appts;

      // new Date is automatically today's date
      var today = new Date();
      var tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      // format the date to that used by the API MM/DD/YYYY
      function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      }

      // GET booked appointments between startdate and enddate
      api.GET('/appointments/booked', {
        params: {
          // MUST set providerid or departmentid in order to get appointments
          departmentid: 1,
          startdate: formatDate(tomorrow),
          enddate: formatDate(tomorrow),
          showcancelled: false,
          showcopay: false,
          // need patient details to find the patient's address and calculate their track record
          showpatientdetail: true
        }
      }).on('done', function(response) {
        // set appts to appointments from response
        appts = response.appointments;

        // foreach booked appointment in booked appointments
        router.forEachBookedAppointment(api, appts, $scope.threshold, signal)
          .then((result) => {
            // TODO: uncomment to log appointments as a whole
            // console.log(appts)
            $scope.visibility = "shown";
            $scope.feedback = “”;
            $scope.appointments = appts;
            signal.emit('appts', appts)
            return false;
          })
          .catch((err) => {
            // something wrong happened and the Promise was rejected
            // handle the error
            console.log(`There was an error: ${err.message || err}`);
          });
        // end foreach appt in appts
      }).on('error', router.log_error) // end GET booked appointments
    }) // end on ready in connection

    api.status.on('error', function(error) {
      console.log(error)
    }) // end log errors in connection
  }

  $scope.getNoShowsThisWeek = function() {
    $scope.visibility = "hidden";
    $scope.appointments = [];
    $scope.feedback = “Processing…”;

    // CONNECT TO API... see athenahealthapi.js for details
    var api = new athenahealthapi.Connection(router.version, router.key, router.secret, router.practiceid)
    api.status.on('ready', function() {
      var signal = new events.EventEmitter;
      var appts;

      // new Date is automatically today's date
      var today = new Date();
      var tomorrow = new Date();
      var nextWeek = new Date();
      tomorrow.setDate(today.getDate() + 1);
      nextWeek.setDate(today.getDate() + 8);
      //console.log("Tomorrow is " + tomorrow);
      //console.log("Next week is " + nextWeek);

      // format the date to that used by the API MM/DD/YYYY
      function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      }

      // GET booked appointments between startdate and enddate
      api.GET('/appointments/booked', {
        params: {
          // MUST set providerid or departmentid in order to get appointments
          departmentid: 1,
          startdate: formatDate(tomorrow),
          enddate: formatDate(nextWeek),
          showcancelled: false,
          showcopay: false,
          // need patient details to find the patient's address and calculate their track record
          showpatientdetail: true
        }
      }).on('done', function(response) {
        // set appts to appointments from response
        appts = response.appointments;

        // foreach booked appointment in booked appointments
        router.forEachBookedAppointment(api, appts, $scope.threshold, signal)
          .then((result) => {
            // TODO: uncomment to log appointments as a whole
            // console.log(appts);
            $scope.visibility = "shown";
            $scope.feedback = “”;
            $scope.appointments = appts;
            signal.emit('appts', appts)
            return false;
          })
          .catch((err) => {
            // something wrong happened and the Promise was rejected
            // handle the error
            console.log(`There was an error: ${err.message || err}`);
          });
        // end foreach appt in appts
      }).on('error', router.log_error) // end GET booked appointments
    }) // end on ready in connection

    api.status.on('error', function(error) {
      console.log(error)
    }) // end log errors in connection
  }
}]);
