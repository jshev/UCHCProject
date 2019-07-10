var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  async = require("async");

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

var router = require('./router');

var _port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../static"));

/* var appointments = [{
    date: '07/11/2019',
    appointmentid: '1163479',
    patient: {
      primarydepartmentid: '1',
      contactpreference_lab_email: 'true',
      racename: 'Alaska Native',
      email: 'didipierce@gmail.com',
      balances: [Array],
      occupationcode: 'other',
      contactpreference_announcement_sms: 'false',
      emailexists: 'true',
      race: [Array],
      departmentid: '1',
      firstappointment: '10/23/2012 08:00',
      guarantorstate: 'ME',
      language6392code: 'eng',
      portalaccessgiven: 'true',
      primaryproviderid: '71',
      driverslicense: 'false',
      patientphoto: 'true',
      homebound: 'false',
      contactpreference_appointment_email: 'false',
      contactpreference_billing_email: 'false',
      contactpreference_appointment_sms: 'false',
      patientphotourl: '/preview1/195900/patients/443/photo',
      contactpreference_billing_phone: 'true',
      mobilephone: '2396418663',
      contactpreference_announcement_email: 'true',
      hasmobile: 'true',
      registrationdate: '01/06/2011',
      ethnicitycode: '2182-4',
      caresummarydeliverypreference: 'PORTAL',
      contactpreference_announcement_phone: 'true',
      hierarchicalcode: 'R1.02',
      guarantorlastname: 'Davids',
      guarantorcountrycode: 'USA',
      firstname: 'Diana',
      contactrelationship: 'Other',
      contacthomephone: '8885551241',
      contactpreference_appointment_phone: 'true',
      contactpreference_lab_sms: 'false',
      patientid: '443',
      dob: '05/09/1948',
      zip: '63304',
      guarantordob: '09/06/2007',
      guarantoraddresssameaspatient: 'false',
      address1: '317 Meadowlake Dr',
      guarantorrelationshiptopatient: '18',
      portaltermsonfile: 'true',
      contactpreference_billing_sms: 'false',
      status: 'active',
      lastname: 'Pierce',
      guarantorfirstname: 'Lucius',
      guarantorphone: '5555491267',
      city: 'ST. CHARLES',
      ssn: '*****9244',
      lastappointment: '10/26/2012 08:15',
      guarantoremail: 'demo@athenahealth.com',
      guarantorcity: 'LEE',
      maritalstatus: 'P',
      guarantorzip: '04455',
      guarantoraddress1: '8762 Stoneridge Ct',
      countrycode: 'USA',
      sex: 'f',
      maritalstatusname: 'PARTNER',
      privacyinformationverified: 'true',
      consenttotext: 'false',
      onlinestatementonly: 'true',
      countrycode3166: 'US',
      contactpreference_lab_phone: 'true',
      guarantorcountrycode3166: 'US'
    },
    starttime: '04:59',
    departmentid: '1',
    appointmentstatus: 'f',
    scheduledby: 'API-11106',
    patientid: '443',
    duration: 15,
    templateappointmenttypeid: '5',
    hl7providerid: 71,
    lastmodifiedby: 'API-11106',
    appointmenttypeid: '5',
    lastmodified: '07/09/2019 10:04:12',
    appointmenttype: 'Lab Work',
    providerid: '71',
    chargeentrynotrequired: false,
    scheduleddatetime: '07/09/2019 10:04:12',
    coordinatorenterprise: false,
    templateappointmentid: '1163479',
    patientappointmenttypename: 'Lab Work',
    ToT: 1,
    middleDay: 0,
    departmentHighNoShow: 1,
    age: 0,
    noAddress: 1,
    patientTrackRecord: 0,
    risk: 'low'
  },
  {
    date: '07/11/2019',
    appointmentid: '1163478',
    patient: {
      primarydepartmentid: '1',
      contactpreference_lab_email: 'true',
      racename: 'Alaska Native',
      email: 'didipierce@gmail.com',
      balances: [Array],
      occupationcode: 'other',
      contactpreference_announcement_sms: 'false',
      emailexists: 'true',
      race: [Array],
      departmentid: '1',
      firstappointment: '10/23/2012 08:00',
      guarantorstate: 'ME',
      language6392code: 'eng',
      portalaccessgiven: 'true',
      primaryproviderid: '71',
      driverslicense: 'false',
      patientphoto: 'true',
      homebound: 'false',
      contactpreference_appointment_email: 'false',
      contactpreference_billing_email: 'false',
      contactpreference_appointment_sms: 'false',
      patientphotourl: '/preview1/195900/patients/443/photo',
      contactpreference_billing_phone: 'true',
      mobilephone: '2396418663',
      contactpreference_announcement_email: 'true',
      hasmobile: 'true',
      registrationdate: '01/06/2011',
      ethnicitycode: '2182-4',
      caresummarydeliverypreference: 'PORTAL',
      contactpreference_announcement_phone: 'true',
      hierarchicalcode: 'R1.02',
      guarantorlastname: 'Davids',
      guarantorcountrycode: 'USA',
      firstname: 'Diana',
      contactrelationship: 'Other',
      contacthomephone: '8885551241',
      contactpreference_appointment_phone: 'true',
      contactpreference_lab_sms: 'false',
      patientid: '443',
      dob: '05/09/1948',
      zip: '63304',
      guarantordob: '09/06/2007',
      guarantoraddresssameaspatient: 'false',
      address1: '317 Meadowlake Dr',
      guarantorrelationshiptopatient: '18',
      portaltermsonfile: 'true',
      contactpreference_billing_sms: 'false',
      status: 'active',
      lastname: 'Pierce',
      guarantorfirstname: 'Lucius',
      guarantorphone: '5555491267',
      city: 'ST. CHARLES',
      ssn: '*****9244',
      lastappointment: '10/26/2012 08:15',
      guarantoremail: 'demo@athenahealth.com',
      guarantorcity: 'LEE',
      maritalstatus: 'P',
      guarantorzip: '04455',
      guarantoraddress1: '8762 Stoneridge Ct',
      countrycode: 'USA',
      sex: 'f',
      maritalstatusname: 'PARTNER',
      privacyinformationverified: 'true',
      consenttotext: 'false',
      onlinestatementonly: 'true',
      countrycode3166: 'US',
      contactpreference_lab_phone: 'true',
      guarantorcountrycode3166: 'US'
    },
    starttime: '09:59',
    departmentid: '1',
    appointmentstatus: 'f',
    scheduledby: 'API-11106',
    patientid: '443',
    duration: 15,
    templateappointmenttypeid: '5',
    hl7providerid: 71,
    lastmodifiedby: 'API-11106',
    appointmenttypeid: '5',
    lastmodified: '07/09/2019 10:01:46',
    appointmenttype: 'Lab Work',
    providerid: '71',
    chargeentrynotrequired: false,
    scheduleddatetime: '07/09/2019 10:01:46',
    coordinatorenterprise: false,
    templateappointmentid: '1163478',
    patientappointmenttypename: 'Lab Work',
    ToT: 1,
    middleDay: 1,
    departmentHighNoShow: 1,
    age: 0,
    noAddress: 1,
    patientTrackRecord: 0,
    risk: 'medium'
  },
  {
    date: '07/11/2019',
    appointmentid: '1112985',
    patient: {
      firstname: 'Rossie',
      primarydepartmentid: '1',
      portaltermsonfile: 'false',
      status: 'active',
      lastname: 'Koepp',
      state: 'AR',
      donotcall: 'false',
      balances: [Array],
      city: 'BEIERVILLE',
      race: [],
      departmentid: '1',
      homephone: '2014445555',
      mobilephone: '2012223333',
      patientid: '36245',
      registrationdate: '06/11/2019',
      countrycode: 'USA',
      hasmobile: 'true',
      sex: 'F',
      address2: 'Apt 123',
      dob: '06/11/1969',
      privacyinformationverified: 'false',
      zip: '07601',
      consenttotext: 'false',
      countrycode3166: 'US',
      guarantoraddresssameaspatient: 'false',
      address1: '650 Renner Lock Apt. 458',
      guarantorrelationshiptopatient: '1',
      driverslicense: 'false',
      patientphoto: 'false'
    },
    starttime: '11:00',
    departmentid: '1',
    appointmentstatus: 'f',
    scheduledby: 'API-2666',
    patientid: '36245',
    duration: 15,
    templateappointmenttypeid: '42',
    hl7providerid: 86,
    lastmodifiedby: 'API-2666',
    appointmenttypeid: '42',
    lastmodified: '06/11/2019 06:26:43',
    appointmenttype: 'Established',
    providerid: '86',
    chargeentrynotrequired: false,
    scheduleddatetime: '06/11/2019 06:26:43',
    coordinatorenterprise: false,
    templateappointmentid: '1112985',
    appointmentnotes: [
      [Object]
    ],
    patientappointmenttypename: 'Established Visit',
    ToT: 1,
    middleDay: 1,
    departmentHighNoShow: 1,
    age: 1,
    noAddress: 0,
    patientTrackRecord: 0,
    risk: 'medium'
  },
  {
    date: '07/11/2019',
    appointmentid: '1112986',
    patient: {
      firstname: 'Derick',
      primarydepartmentid: '1',
      portaltermsonfile: 'false',
      status: 'active',
      lastname: 'Cassin',
      state: 'NJ',
      donotcall: 'false',
      balances: [Array],
      city: 'CONROYTON',
      race: [],
      departmentid: '1',
      homephone: '2014445555',
      mobilephone: '2012223333',
      patientid: '36249',
      registrationdate: '06/11/2019',
      countrycode: 'USA',
      hasmobile: 'true',
      sex: 'M',
      address2: 'Apt 123',
      dob: '06/11/1969',
      privacyinformationverified: 'false',
      zip: '07601',
      consenttotext: 'false',
      countrycode3166: 'US',
      guarantoraddresssameaspatient: 'false',
      address1: '9590 Merle Lane',
      guarantorrelationshiptopatient: '1',
      driverslicense: 'false',
      patientphoto: 'false'
    },
    starttime: '11:00',
    departmentid: '1',
    appointmentstatus: 'f',
    scheduledby: 'API-2666',
    patientid: '36249',
    duration: 15,
    templateappointmenttypeid: '42',
    hl7providerid: 86,
    lastmodifiedby: 'API-2666',
    appointmenttypeid: '42',
    lastmodified: '06/11/2019 06:47:52',
    appointmenttype: 'Established',
    providerid: '86',
    chargeentrynotrequired: false,
    scheduleddatetime: '06/11/2019 06:47:52',
    coordinatorenterprise: false,
    templateappointmentid: '1112986',
    appointmentnotes: [
      [Object]
    ],
    patientappointmenttypename: 'Established Visit',
    ToT: 1,
    middleDay: 1,
    departmentHighNoShow: 1,
    age: 1,
    noAddress: 0,
    patientTrackRecord: 0,
    risk: 'medium'
  },
  {
    date: '07/11/2019',
    appointmentid: '1163454',
    patient: {
      primarydepartmentid: '1',
      contactpreference_lab_email: 'true',
      racename: 'Alaska Native',
      email: 'didipierce@gmail.com',
      balances: [Array],
      occupationcode: 'other',
      contactpreference_announcement_sms: 'false',
      emailexists: 'true',
      race: [Array],
      departmentid: '1',
      firstappointment: '10/23/2012 08:00',
      guarantorstate: 'ME',
      language6392code: 'eng',
      portalaccessgiven: 'true',
      primaryproviderid: '71',
      driverslicense: 'false',
      patientphoto: 'true',
      homebound: 'false',
      contactpreference_appointment_email: 'false',
      contactpreference_billing_email: 'false',
      contactpreference_appointment_sms: 'false',
      patientphotourl: '/preview1/195900/patients/443/photo',
      contactpreference_billing_phone: 'true',
      mobilephone: '2396418663',
      contactpreference_announcement_email: 'true',
      hasmobile: 'true',
      registrationdate: '01/06/2011',
      ethnicitycode: '2182-4',
      caresummarydeliverypreference: 'PORTAL',
      contactpreference_announcement_phone: 'true',
      hierarchicalcode: 'R1.02',
      guarantorlastname: 'Davids',
      guarantorcountrycode: 'USA',
      firstname: 'Diana',
      contactrelationship: 'Other',
      contacthomephone: '8885551241',
      contactpreference_appointment_phone: 'true',
      contactpreference_lab_sms: 'false',
      patientid: '443',
      dob: '05/09/1948',
      zip: '63304',
      guarantordob: '09/06/2007',
      guarantoraddresssameaspatient: 'false',
      address1: '317 Meadowlake Dr',
      guarantorrelationshiptopatient: '18',
      portaltermsonfile: 'true',
      contactpreference_billing_sms: 'false',
      status: 'active',
      lastname: 'Pierce',
      guarantorfirstname: 'Lucius',
      guarantorphone: '5555491267',
      city: 'ST. CHARLES',
      ssn: '*****9244',
      lastappointment: '10/26/2012 08:15',
      guarantoremail: 'demo@athenahealth.com',
      guarantorcity: 'LEE',
      maritalstatus: 'P',
      guarantorzip: '04455',
      guarantoraddress1: '8762 Stoneridge Ct',
      countrycode: 'USA',
      sex: 'f',
      maritalstatusname: 'PARTNER',
      privacyinformationverified: 'true',
      consenttotext: 'false',
      onlinestatementonly: 'true',
      countrycode3166: 'US',
      contactpreference_lab_phone: 'true',
      guarantorcountrycode3166: 'US'
    },
    patientlocationid: '21',
    starttime: '13:02',
    departmentid: '1',
    encounterstate: 'OPEN',
    appointmentstatus: '2',
    scheduledby: 'API-11106',
    patientid: '443',
    duration: 15,
    encounterid: '35903',
    startcheckin: '07/09/2019 07:23:04',
    templateappointmenttypeid: '5',
    checkindatetime: '07/09/2019 07:23:18',
    hl7providerid: 71,
    lastmodifiedby: 'API-11106',
    renderingproviderid: 71,
    appointmenttypeid: '5',
    lastmodified: '07/09/2019 07:23:30',
    appointmenttype: 'Lab Work',
    encounterstatus: 'READYFORSTAFF',
    providerid: '71',
    stopcheckin: '07/09/2019 07:23:18',
    chargeentrynotrequired: false,
    scheduleddatetime: '07/09/2019 06:49:28',
    coordinatorenterprise: false,
    templateappointmentid: '1163454',
    appointmentnotes: [
      [Object]
    ],
    patientappointmenttypename: 'Lab Work',
    ToT: 1,
    middleDay: 1,
    departmentHighNoShow: 1,
    age: 0,
    noAddress: 1,
    patientTrackRecord: 0,
    risk: 'medium'
  },
  {
    date: '07/11/2019',
    appointmentid: '1163458',
    patient: {
      primarydepartmentid: '1',
      contactpreference_lab_email: 'true',
      racename: 'Alaska Native',
      email: 'didipierce@gmail.com',
      balances: [Array],
      occupationcode: 'other',
      contactpreference_announcement_sms: 'false',
      emailexists: 'true',
      race: [Array],
      departmentid: '1',
      firstappointment: '10/23/2012 08:00',
      guarantorstate: 'ME',
      language6392code: 'eng',
      portalaccessgiven: 'true',
      primaryproviderid: '71',
      driverslicense: 'false',
      patientphoto: 'true',
      homebound: 'false',
      contactpreference_appointment_email: 'false',
      contactpreference_billing_email: 'false',
      contactpreference_appointment_sms: 'false',
      patientphotourl: '/preview1/195900/patients/443/photo',
      contactpreference_billing_phone: 'true',
      mobilephone: '2396418663',
      contactpreference_announcement_email: 'true',
      hasmobile: 'true',
      registrationdate: '01/06/2011',
      ethnicitycode: '2182-4',
      caresummarydeliverypreference: 'PORTAL',
      contactpreference_announcement_phone: 'true',
      hierarchicalcode: 'R1.02',
      guarantorlastname: 'Davids',
      guarantorcountrycode: 'USA',
      firstname: 'Diana',
      contactrelationship: 'Other',
      contacthomephone: '8885551241',
      contactpreference_appointment_phone: 'true',
      contactpreference_lab_sms: 'false',
      patientid: '443',
      dob: '05/09/1948',
      zip: '63304',
      guarantordob: '09/06/2007',
      guarantoraddresssameaspatient: 'false',
      address1: '317 Meadowlake Dr',
      guarantorrelationshiptopatient: '18',
      portaltermsonfile: 'true',
      contactpreference_billing_sms: 'false',
      status: 'active',
      lastname: 'Pierce',
      guarantorfirstname: 'Lucius',
      guarantorphone: '5555491267',
      city: 'ST. CHARLES',
      ssn: '*****9244',
      lastappointment: '10/26/2012 08:15',
      guarantoremail: 'demo@athenahealth.com',
      guarantorcity: 'LEE',
      maritalstatus: 'P',
      guarantorzip: '04455',
      guarantoraddress1: '8762 Stoneridge Ct',
      countrycode: 'USA',
      sex: 'f',
      maritalstatusname: 'PARTNER',
      privacyinformationverified: 'true',
      consenttotext: 'false',
      onlinestatementonly: 'true',
      countrycode3166: 'US',
      contactpreference_lab_phone: 'true',
      guarantorcountrycode3166: 'US'
    },
    starttime: '18:30',
    departmentid: '1',
    appointmentstatus: 'f',
    scheduledby: 'API-11106',
    patientid: '443',
    duration: 15,
    templateappointmenttypeid: '5',
    hl7providerid: 71,
    lastmodifiedby: 'API-11106',
    appointmenttypeid: '5',
    lastmodified: '07/09/2019 08:35:30',
    appointmenttype: 'Lab Work',
    providerid: '71',
    chargeentrynotrequired: false,
    scheduleddatetime: '07/09/2019 08:35:30',
    coordinatorenterprise: false,
    templateappointmentid: '1163458',
    appointmentnotes: [
      [Object]
    ],
    patientappointmenttypename: 'Lab Work',
    ToT: 1,
    middleDay: 0,
    departmentHighNoShow: 1,
    age: 0,
    noAddress: 1,
    patientTrackRecord: 0,
    risk: 'low'
  }
]; */



app.get("/main", function(req, res) {
  return send_success_resp(res, []);
});

app.get("/main/:timeframe/:threshold", function(req, res) {
  var appointments = router.findNoShows(req.params.timeframe, req.params.threshold, function(err, appts) {
    if (err) {
      return send_error_resp(err);
    } else {
      return send_success_resp(res, appts);
    }
  });
});

console.error("Starting server on port " + _port);
app.listen(_port);









/**
 * res, http_status, code, message
 * res, http_status, err obj
 * res, err obj
 */
function send_error_resp() {
  var res, http_status, code, message;
  if (arguments.length == 4) {
    res = arguments[0];
    http_status = arguments[1];
    code = arguments[2];
    message = arguments[3];
  } else if (arguments.length == 3) {
    res = arguments[0];
    http_status = arguments[1];
    code = arguments[2].error;
    message = arguments[2].message;
  } else if (arguments.length == 2) {
    res = arguments[0];
    http_status = _http_code_from_error(arguments[1].error);
    code = arguments[1].error;
    message = arguments[1].message;
  } else {
    console.error("send_error_resp needs two to four arguments.");
    throw new Error();
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(http_status).send(JSON.stringify({
    error: code,
    message: message
  }));
  res.end();
}

function send_success_resp(res, obj) {
  if (arguments.length != 2) {
    console.error("send_success_resp needs two arguments.");
    throw new Error();
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(obj));
  res.end();
}

function _http_code_from_error(error_code) {
  switch (error_code) {
    // add other messages here when they're not server problems.
    default:
      return 503;
  }
}
