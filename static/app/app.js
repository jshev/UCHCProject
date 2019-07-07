var uchcApp = angular.module("uchcApp", ["ngRoute", "ngResource"]);

uchcApp.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      redirectTo: "/main"
    })
    .when("/main", {
      controller: "mainController",
      templateUrl: "app/partials/main.html"
    })
    .when("/main/day/:threshold", {
      controller: "mainController",
      templateUrl: "app/partials/viewAppts.html"
    })
    .when("/main/week/:threshold", {
      controller: "mainController",
      templateUrl: "app/partials/viewAppts.html"
    })
});