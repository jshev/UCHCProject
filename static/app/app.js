var uchcApp = angular.module("uchcApp", ["ngRoute", "ngResource"]);
// /main and /main/:timeframe/:threshold use the same controller but different partials
// details that here
// also redirect / to /main
uchcApp.config(function($routeProvider) {
  $routeProvider
    .when("/", {
      redirectTo: "/main"
    })
    .when("/main", {
      controller: "mainController",
      templateUrl: "app/partials/main.html"
    })
    .when("/main/:timeframe/:threshold", {
      controller: "mainController",
      templateUrl: "app/partials/viewAppts.html"
    })
});
