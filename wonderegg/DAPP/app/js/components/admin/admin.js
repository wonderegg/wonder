(function() {
"use strict";

angular.module("dashboard.admin", [])
    .component("admin", {
        templateUrl: "js/components/admin/admin.html"
    });
    console.log("admin called", angular.module("dashboard.admin"));
}());