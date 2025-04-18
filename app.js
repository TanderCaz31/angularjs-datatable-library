let app = angular.module("AngularJSDatatable", ["ngRoute"]).config(($routeProvider) => {
    $routeProvider
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "RegisterController"
        })
        .when("/datatable", {
            templateUrl: "pages/datatable.html",
            controller: "DatatableController"
        })
        .when("/queryhistory", {
            templateUrl: "pages/queryhistory.html"
        })
        .otherwise({ redirectTo: "/register" })
});