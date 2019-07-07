var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  async = require("async");

var router = require('./../static/js/router');
 if (router != null) {
  console.log("Router connected!");
} else {
  console.log("Router not connected...");
}

var _port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/../static"));

var appointments = [];


app.get("/main", function(req, res) {
  return send_success_resp(res, appointments);
});

app.get("/main/day/:threshold", function(req, res) {
  var thresh = req.params.threshold;
  appointments = router.findNoShows("day", thresh);
  return send_success_resp(res, appointments);
});

app.get("/main/week/:threshold", function(req, res) {
  var thresh = req.params.threshold;
  appointments = router.findNoShows("week", thresh);
  return send_success_resp(res, appointments);
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
