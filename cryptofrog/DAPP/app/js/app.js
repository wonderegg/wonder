(function(){
  "use strict";
  
  angular.module("dashboard", [
    "ngRoute",
    "dashboard.main",
    "dashboard.marketplace",
    "dashboard.help",
    "dashboard.admin"
    ])
    
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when("/", {
            templateUrl : "js/components/main/main.html",
            controller : "mainController" 
        })
        .when("/marketplace", {
            templateUrl : "js/components/market/marketplace.html",
            controller : "marketController"
        })
        .when("/help", {
            templateUrl : "js/components/help/help.html"
        })
        .when("/admin", {
            templateUrl : "js/components/admin/admin.html"
        })
        .otherwise({
            redirectTo: "/"
        });
        //$locationProvider.html5Mode(true);
    });


    $('.Header-navigation a').click(function(event){
        $('.Header-navigation .Header-navigation-item--active').removeClass('Header-navigation-item--active').attr("aria-current",'false');
        $('.Header-navigation .Header-navigation-active').removeClass('Header-navigation-active').attr("aria-current",'false');      
        $(event.currentTarget).addClass('Header-navigation-active').attr("aria-current",'true');    
    });

})();


