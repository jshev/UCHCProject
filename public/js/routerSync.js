// set up variables
var athenahealthapi = require('./athenahealthapi')
var predictiveModel = require('./predictiveModel')
var events = require('events')

var key = 'u2gs3apvctdp8c5djeanyp5c'
var secret = 'sGcW9fwZXNy6hSR'
var version = 'preview1'
var practiceid = 195900

// log error and the cause of the error
function log_error(error) {
  console.log(error)
  console.log(error.cause)
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
    //tomorrow.setDate(today.getDate() + 1)
    tomorrow.setDate(21)

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
      for (var i = 0; i < appts.length; i++) {
        // set appt as the booked appointment at index i in booked appointments
        var appt = appts[i];
        // starttime is in military format HH:MM
        // split time by : and join array with no comma or space, so the times can be compared as numbers
        // if appointment starts between 9AM (09:00) and 5PM (17:00), it is a midday appointment
        if (appt.starttime.split(":").join("") > 0759 && appt.starttime.split(":").join("") < 1701) {
          appt.middleDay = 1;
          //console.log("Mid Day!")
          //console.log(appt.starttime.split(":").join(""))
        } else {
          appt.middleDay = 0;
          //console.log("Not mid day...")
          //console.log(appt.starttime.split(":").join(""))
        }

        // TODO: need IDs of departments with high no show rates
        if (appt.departmentid == 1) {
          appt.departmentHighNoShow = 1
          //console.log(appt.departmentid)
          //console.log("High department!")
        } else {
          appt.departmentHighNoShow = 0
          //console.log(appt.departmentid)
          //console.log("Low department...")
        }

        // check if address1 is null, empty, or just a space
        if (appt.patient.address1 == null || appt.patient.address1 == "" || appt.patient.address1 == " ") {
          appt.noAddress = 1
          //console.log("No or incomplete address...")
        } else {
          // if address1 is present...
          // check if city is null, empty, or just a space
          if (appt.patient.city == null || appt.patient.city == "" || appt.patient.city == " ") {
            appt.noAddress = 1
            //console.log("No or incomplete address...")
          } else {
            // if address1 and city are present...
            // check if state is null, empty, or just a space
            if (appt.patient.state == null || appt.patient.state == "" || appt.patient.state == " ") {
              appt.noAddress = 1
              //console.log("No or incomplete address...")
            } else {
              // if address1, city, and state are present...
              // check if zip is null, empty, or just a space
              if (appt.patient.zip == null || appt.patient.zip == "" || appt.patient.zip == " ") {
                appt.noAddress = 1
                //console.log("No or incomplete address...")
              } else {
                // if address1, city, state, and zip are present...
                appt.noAddress = 0
                //console.log("Address present!")
              }
            }
          }
        }

        // GET patient's past appointments
        api.GET('/patients/' + appt.patientid + '/appointments', {
          params: {
            // include cancelled and past appointments, since that is the point of this request
            showcancelled: 'Y',
            showpast: 'Y'
          }
        }).on('done', function(response) {
          // response include totalcount of patient's booked appointments
          var total = response.totalcount
          // initialize noShows to 0
          var noShows = 0
          // set pastAppts to appointments from response
          var pastAppts = response.appointments
          //console.log('Appointment history:')
          //console.log(pastAppts);
          //console.log()

          // foreach past appointment in past appointments...
          for (var j = 0; j < pastAppts.length; j++) {
            // set pastAppt as the past appointment at index j in past appointments
            var pastAppt = pastAppts[j]
            if (pastAppt.appointmentstatus == 'x') {
              // appointmentstatus x=cancelled.
              // appointmentstatus f=future, but it can include appointments where were never checked in, even if the appointment date is in the past. It is up to a practice to cancel appointments as a no show when appropriate to do so...
              if (pastAppt.appointmentcancelreasonid != null && pastAppt.appointmentcancelreasonid == 2) {
                // appointmentcancelreasonid ought to be set for cancelled appointments
                // appointmentcancelreasonid 2="no-show"
                // increment number of no-shows
                noShows = noShows + 1;
              }
            }
          }

          // calculate the patient's track record by dividing their number of no-shows by their total number of booked appointments
          var track = noShows / total;
          // if the patient's track record is greater than or equal to 50%...
          if (track >= 0.5) {
            appt.patientTrackRecord = 1
          } else {
            appt.patientTrackRecord = 0
          }
          //console.log(appt.patientTrackRecord);

          // use calculateRisk function in predictiveModel script to calculate teh risk of appointment being a no-show
          // using unique variables set thus far
          var risk = predictiveModel.calculateRisk(appt.noAddress, appt.middleDay, appt.departmentHighNoShow, appt.patientTrackRecord)

          // compare risk to threshold
          // if it's below, it's low risk; if it's equal, it's medium risk; if it's above, it's high risk
          if (risk < threshold) {
            appt.risk = 'low'
          } else if (risk == threshold) {
            appt.risk = 'medium'
          } else {
            appt.risk = 'high'
          }

          // TODO: uncomment to log appointments individually
          //console.log('Booked appointments tomorrow:')
          //console.log(appt)
          //console.log("Risk: " + risk)
          //console.log("Threshold: " + threshold)
          //console.log()
          signal.emit('pastAppts', pastAppts)
        }).on('error', log_error) // end GET all appointments of patients

      } // end foreach appt in appts

      // TODO: uncomment to log appointments as a whole
      console.log('Booked appointments tomorrow:')
      console.log(appts)
      for (var i = 0; i < appts.length; i++) {
        console.log(appts[i].risk);
      }

      console.log()
      signal.emit('appts', appts)
    }).on('error', log_error) // end GET booked appointments
  }) // end on ready in connection
  api.status.on('error', function(error) {
    console.log(error)
  }) // end log errors in connection
} // end noShowsTomorrow method

noShowsTomorrow(4)
