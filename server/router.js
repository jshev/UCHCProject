// set up variables
var athenahealthapi = require('./athenahealthapi');
var events = require('events');
var predictiveModel = require('./predictiveModel');

// key and secret for UCHC ProShow Scheduling Assistant
var key = 'u2gs3apvctdp8c5djeanyp5c';
var secret = 'sGcW9fwZXNy6hSR';

// practiceid and version for sandbox athenahealth api
var version = 'preview1';
var practiceid = 195900;

// array of days of the week, as getDay() returns an integer instead of a string
// used in forEachBookedAppointment
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// used in forEachBookedAppointment and forEachPastAppointment
// makes the async function wait for the input amount of milliseconds
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

// used in forEachBookedAppointment and forEachPastAppointment
// a aysnchronous forEach function
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// used in forEachBookedAppointment to calculate the patient's age
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

// format the date to that used by the api (MM/DD/YYYY)
// used in findNoShows
function formatDate(date) {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

// function called on GET /main/:timeframe/:threshold
function findNoShows(timeframe, threshold, callback) {
  console.log("findNoShows called!");
  // CONNECT TO API... see athenahealthapi.js for details
  var api = new athenahealthapi.Connection(version, key, secret, practiceid);
  // when the connection is ready...
  api.status.on('ready', function() {
    var signal = new events.EventEmitter;
    var appts;

    // new Date is automatically today's date
    var today = new Date();
    var tomorrow = new Date();
    var end = new Date();
    // tomorrow is always the startdate
    tomorrow.setDate(today.getDate() + 1);
    // enddate depends on timeframe
    if (timeframe == "day") {
      end.setDate(today.getDate() + 1);
    } else {
      end.setDate(today.getDate() + 8);
    }

    // GET booked appointments between startdate and enddate
    api.GET('/appointments/booked', {
      params: {
        // MUST set providerid or departmentid in order to get appointments
        departmentid: 1,
        startdate: formatDate(tomorrow),
        enddate: formatDate(end),
        showcancelled: false,
        showcopay: false,
        // need patient details to find the patient's address and calculate their track record
        showpatientdetail: true
      }
    }).on('done', function(response) {
      // when GET booked appointments is done...
      // set appts to appointments from response
      appts = response.appointments;
      //console.log(response.totalcount);

      // foreach booked appointment in booked appointments
      forEachBookedAppointment(api, appts, threshold, signal)
        .then((result) => {
          // once forEachBookedAppointment has a result...
          /* Uncomment to log appointments in terminal */
          //console.log('Booked appointments for the' + timeframe + ':')
          //console.log(appts)
          // set callback err to null and return appts
          return callback(null, appts);
          // athenahealthapi requires this signal
          signal.emit('appts', appts);
        })
        .catch((err) => {
          // if something went wrong in forEachBookedAppointment...
          // set callback err to err and log err
          return callback(err);
          console.log(`There was an error: ${err.message || err}`);
        });
      // end forEachBookedAppointment
    }).on('error', function(error) {
      // if something went wrong in GET booked appointments...
      // set callback err to err and log err
      return callback(error);
      console.log(error);
    }) // end GET booked appointments
  }) // end on ready in connection
  api.status.on('error', function(error) {
    // if something went wrong in connection...
    // set callback err to err and log err
    return callback(error);
    console.log(error);
  }) // end log errors in connection
} // end findNoShows

// used in findNoShows
const forEachBookedAppointment = async (api, appts, threshold, signal) => {
  await asyncForEach(appts, async (appt) => {
    // wait for a second for the last appointment to finish processing
    await waitFor(1000);

    // get the appointment date as a date object...
    var apptDate = new Date(appt.date);
    // use weekday[getDay()] to find out what day of the week the appointment is on
    if (weekday[apptDate.getDay()] == "Tuesday" || weekday[apptDate.getDay()] == "Thursday") {
      // increases no-show risk...
      // add Tuesday.Or.Thursday element to appointment object, set to 1
      appt.ToT = 1;
    } else {
      // otheriwse add Tuesday.Or.Thursday element to appointment object, set to 0
      appt.ToT = 0;
    }

    // appointment starttime is in military time
    // compare times by splitting (HH:MM) time at :, and joining resulting ("HH", "MM") array without an space or comma
    if (appt.starttime.split(":").join("") > 0759 && appt.starttime.split(":").join("") < 1701) {
      // increases no-show risk...
      // add Middle.Day element to appointment object, set to 1
      appt.middleDay = 1;
    } else {
      // otherwise add Middle.Day element to appointmentobject, set to 0
      appt.middleDay = 0;
    }

    // assumes the department with departmentid 1 has a high no-show rate
    if (appt.departmentid == 1) {
      // increases no-show risk...
      // add Department.High.No.Shows element to appointment object, set to 1
      appt.departmentHighNoShow = 1;
    } else {
      // otherwise add Department.High.No.Shows element to appointment object, set to 0
      appt.departmentHighNoShow = 0;
    }

    if (getAge(appt.patient.dob) > 39 && getAge(appt.patient.dob) < 60) {
      // increases no-show risk...
      // add Age element to appointment object, set to 1
      appt.age = 1;
    } else {
      // otherwise add Age element to appointment object, set to 0
      appt.age = 0;
    }

    // check if line 1 of the patient's address is null, empty, or just a space
    if (appt.patient.address1 == null || appt.patient.address1 == "" || appt.patient.address1 == " ") {
      appt.noAddress = 1;
    } else {
      // check if city is null, empty, or just a space
      if (appt.patient.city == null || appt.patient.city == "" || appt.patient.city == " ") {
        appt.noAddress = 1;
      } else {
        // check if state is null, empty, or just a space
        if (appt.patient.state == null || appt.patient.state == "" || appt.patient.state == " ") {
          appt.noAddress = 1;
        } else {
          // check if zip is null, empty, or just a space
          if (appt.patient.zip == null || appt.patient.zip == "" || appt.patient.zip == " ") {
            // increases no-show risk...
            // if patient address is complete or non-existent
            // add No.Address.Present element to appointment object, set to 1
            appt.noAddress = 1;
          } else {
            // otherwise add No.Address.Present element to appointment object, set to 0
            appt.noAddress = 0;
          }
        }
      }
    }

    // GET past appointments of patient who booked appointment
    api.GET('/patients/' + appt.patientid + '/appointments', {
      params: {
        // must specify that cancelled and past appointments need to be included
        showcancelled: 'Y',
        showpast: 'Y',
        // set limit to 10 in order to reduce processing time
        limit: 10
      }
    }).on('done', function(response) {
      // when GET patient's past appointments is done...
      // totalcount does not take into account to limit...
      if (response.totalcount > 10) {
        var total = 10;
      } else {
        var total = response.totalcount;
      }
      // so set total to totalcount only if totalcount is more than 10
      var pastAppts = response.appointments;
      // set pastAppts to appointments from response

      // foreach appointment in patient's past appointments
      forEachPastAppointment(pastAppts)
        .then((result) => {
          // once forEachPastAppointment has a result...

          // calculate patient track record of no-shows by dividing noShows by total
          var track = result / total;
          // if patient has missed more than 50% of their past appointments...
          if (track >= 0.5) {
            // increases no-show risk...
            // add No.Show.Score element to appointment object, set to 1
            appt.patientTrackRecord = 1;
          } else {
            // otherwise add No.Show.Score element to appointment object, set to 0
            appt.patientTrackRecord = 0;
          }

          // use calculateRisk from predictiveModel to calculate the appointment's risk score...
          // using all the binary elements added to appointment object so far
          var risk = predictiveModel.calculateRisk(appt.noAddress, appt.middleDay,
            appt.departmentHighNoShow, appt.patientTrackRecord, appt.ToT, appt.age);

// compare risk score to threshold...
          if (risk < threshold) {
            // appointment has a low risk of being a no-show if risk is below threshold
            appt.risk = 'low';
          } else if (risk == threshold) {
            // appointment has a medium risk of being a no-show if risk equal to threshold
            appt.risk = 'medium';
          } else {
            // appointment has a high risk of being a no-show if risk is above threshold
            appt.risk = 'high';
          }
          signal.emit('pastAppts', pastAppts);
          // athenahealthapi requires this signal
        })
        .catch((err) => {
          // if something went wrong in forEachPastAppointment...
          // log err
          console.log(`There was an error: ${err.message || err}`);
        });
    }).on('error', function(error) {
      // if something went wrong in GET patient's past appointments...
      // log err
      console.log(error);
      console.log(error.cause);
    }) // end GET all appointments of patients
    // wait for 2 seconds for this appointment to finish processing
    await waitFor(2000);
  });
  return;
}

// used in forEachBookedAppointment
const forEachPastAppointment = async (pasts) => {
  // initially set noShows to 0
  var noShows = 0;
  await asyncForEach(pasts, async (past) => {
    await waitFor(100);
    // checks whether past appointment was cancelled...
    if (past.appointmentstatus == 'x') {
      // if so, checks whether the appointment was cancelled as a result of the patient being a no-show
      if (past.appointmentcancelreasonid != null && past.appointmentcancelreasonid == 2) {
        // if the appointment was cancelled bc the patient was a no-show, add 1 to noShows
        noShows = noShows + 1;
      }
    }
  });
  // returns how many of the patient's past appointments were no-shows
  return noShows;
}

// only need to export findNoShows to be used in server app.js
module.exports.findNoShows = findNoShows;

//console.log(findNoShows("week", 5));
//findNoShows("week", 5);
