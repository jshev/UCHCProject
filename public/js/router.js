// set up variables
var athenahealthapi = require('./athenahealthapi')
var predictiveModel = require('./predictiveModel')
var events = require('events')

var key = 'u2gs3apvctdp8c5djeanyp5c'
var secret = 'sGcW9fwZXNy6hSR'
var version = 'preview1'
var practiceid = 195900

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// log error and the cause of the error
function log_error(error) {
  console.log(error)
  console.log(error.cause)
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Find Tomorrow's No-Shows on-click function
function noShowsTomorrow(threshold) {
  // CONNECT TO API... see athenahealthapi.js for details
  var api = new athenahealthapi.Connection(version, key, secret, practiceid)
  api.status.on('ready', function() {
    var signal = new events.EventEmitter
    var appts;

    // new Date is automatically today's date
    var today = new Date()
    var tomorrow = new Date()
    // TODO: change tomorrow's date... 6/21 had a lot of test patients
    tomorrow.setDate(today.getDate() + 1)
    //tomorrow.setDate(21)

    // format the date to that used by the API MM/DD/YYYY
    function formatDate(date) {
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
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
      appts = response.appointments

      // foreach booked appointment in booked appointments
      forEachBookedAppointment(api, appts, threshold, signal)
        .then((result) => {
          // TODO: uncomment to log appointments as a whole
          console.log('Booked appointments tomorrow:')
          console.log(appts)
          /* for (var i = 0; i < appts.length; i++) {
            console.log(appts[i].risk);
          } */
          console.log()

          signal.emit('appts', appts)
        })
        .catch((err) => {
          // something wrong happened and the Promise was rejected
          // handle the error
          console.log(`There was an error: ${err.message || err}`);
        });
      // end foreach appt in appts
    }).on('error', log_error) // end GET booked appointments
  }) // end on ready in connection

  api.status.on('error', function(error) {
    console.log(error)
  }) // end log errors in connection
} // end noShowsTomorrow method

// Find This Week's No-Shows on-click function
function noShowsThisWeek(threshold) {
  // CONNECT TO API... see athenahealthapi.js for details
  var api = new athenahealthapi.Connection(version, key, secret, practiceid)
  api.status.on('ready', function() {
    var signal = new events.EventEmitter
    var appts;

    // new Date is automatically today's date
    var today = new Date()
    var tomorrow = new Date()
    var nextWeek = new Date()
    tomorrow.setDate(today.getDate() + 1)
    nextWeek.setDate(today.getDate() + 8)
    console.log("Tomorrow is " + tomorrow);
    console.log("Next week is " + nextWeek);

    // format the date to that used by the API MM/DD/YYYY
    function formatDate(date) {
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
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
      appts = response.appointments

      // foreach booked appointment in booked appointments
      forEachBookedAppointment(api, appts, threshold, signal)
        .then((result) => {
          // TODO: uncomment to log appointments as a whole
          console.log('Booked appointments this week:')
          console.log(appts)
          console.log()

          signal.emit('appts', appts)
        })
        .catch((err) => {
          // something wrong happened and the Promise was rejected
          // handle the error
          console.log(`There was an error: ${err.message || err}`);
        });
      // end foreach appt in appts
    }).on('error', log_error) // end GET booked appointments
  }) // end on ready in connection

  api.status.on('error', function(error) {
    console.log(error)
  }) // end log errors in connection
} // end noShowsThisWeek method

const forEachBookedAppointment = async (api, appts, threshold, signal) => {
  await asyncForEach(appts, async (appt) => {
    await waitFor(2000);

    var apptDate = new Date(appt.date);
    if (weekday[apptDate.getDay()] == "Tuesday" || weekday[apptDate.getDay()] == "Thursday") {
      appt.ToT = 1;
      console.log(weekday[apptDate.getDay()]);
    } else {
      appt.ToT = 0;
      console.log(weekday[apptDate.getDay()]);
    }

    if (appt.starttime.split(":").join("") > 0759 && appt.starttime.split(":").join("") < 1701) {
      appt.middleDay = 1;
      //console.log("Mid Day!")
      //console.log(appt.starttime.split(":").join(""))
    } else {
      appt.middleDay = 0;
      //console.log("Not mid day...")
      //console.log(appt.starttime.split(":").join(""))
    }

    if (appt.departmentid == 1) {
      appt.departmentHighNoShow = 1
      //console.log(appt.departmentid)
      //console.log("High department!")
    } else {
      appt.departmentHighNoShow = 0
      //console.log(appt.departmentid)
      //console.log("Low department...")
    }

    if (getAge(appt.patient.dob) > 39 && getAge(appt.patient.dob) < 60) {
      appt.age = 1;
      console.log(getAge(appt.patient.dob));
    } else {
      appt.age = 0;
      console.log(getAge(appt.patient.dob));
    }

    if (appt.patient.address1 == null || appt.patient.address1 == "" || appt.patient.address1 == " ") {
      appt.noAddress = 1
      //console.log("No or incomplete address...")
    } else {
      // check if city is null, empty, or just a space
      if (appt.patient.city == null || appt.patient.city == "" || appt.patient.city == " ") {
        appt.noAddress = 1
        //console.log("No or incomplete address...")
      } else {
        // check if state is null, empty, or just a space
        if (appt.patient.state == null || appt.patient.state == "" || appt.patient.state == " ") {
          appt.noAddress = 1
          //console.log("No or incomplete address...")
        } else {
          // check if zip is null, empty, or just a space
          if (appt.patient.zip == null || appt.patient.zip == "" || appt.patient.zip == " ") {
            appt.noAddress = 1
            //console.log("No or incomplete address...")
          } else {
            appt.noAddress = 0
            //console.log("Address present!")
          }
        }
      }
    }

    api.GET('/patients/' + appt.patientid + '/appointments', {
      params: {
        showcancelled: 'Y',
        showpast: 'Y',
        limit: 10
      }
    }).on('done', function(response) {
      var total = response.totalcount
      var pastAppts = response.appointments
      //console.log('Appointment history:')
      //console.log(pastAppts);
      //console.log()

      forEachPastAppointment(pastAppts)
        .then((result) => {
          var track = result / total;
          if (track >= 0.5) {
            appt.patientTrackRecord = 1
          } else {
            appt.patientTrackRecord = 0
          }
          //console.log(appt.patientTrackRecord);

          var risk = predictiveModel.calculateRisk(appt.noAddress, appt.middleDay, appt.departmentHighNoShow, appt.patientTrackRecord, appt.ToT, appt.age)

          if (risk < threshold) {
            appt.risk = 'low'
          } else if (risk == threshold) {
            appt.risk = 'medium'
          } else {
            appt.risk = 'high'
          }
          signal.emit('pastAppts', pastAppts)
        })
        .catch((err) => {
          // something wrong happened and the Promise was rejected
          // handle the error
          console.log(`There was an error: ${err.message || err}`);
        });
    }).on('error', log_error) // end GET all appointments of patients
    await waitFor(2000);
  });
  return;
}

const forEachPastAppointment = async (pasts) => {
  var noShows = 0
  await asyncForEach(pasts, async (past) => {
    await waitFor(100);
    if (past.appointmentstatus == 'x') {
      if (past.appointmentcancelreasonid != null && past.appointmentcancelreasonid == 2) {
        noShows = noShows + 1;
      }
    }
  });
  return noShows;
}


noShowsThisWeek(5)
//noShowsTomorrow(5)
