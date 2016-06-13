(function () {

    var module = angular.module("trMovies", ["ngComponentRouter"]);

    module.value("$routerRootComponent", "movieApp");

 module.component("accordion", {
        templateUrl: "tr-movies/accordion.html",
        transclude: true,
        controller: function () {
            var model = this;

            var panels = [];
            model.addPanel = function (panel) {
                panels.push(panel);
                panels[0].turnOn();
            };
            
            model.select = function(panel) {
              panels.forEach(function(p) { p.turnOff()});
              panel.turnOn();
            };
        }
    });

    module.component("accordionPanel", {
        templateUrl: "tr-movies/accordionPanel.html",
        transclude: true,
        require: {
            "parent": "^accordion"
        },
        bindings: {
            "heading": "@"
        },
        controllerAs: "m",
        controller: function () {
            var model = this;

            model.selected = false;
            model.$onInit = function () {
                model.parent.addPanel(model);
            };
            
            model.select = function() {
                model.parent.select(model);  
            };
            
            model.turnOn = function() {
              model.selected = true;  
            };
            
            model.turnOff = function() {
              model.selected = false;  
            };
        }
    });



  module.component("rating", {
        templateUrl: "tr-movies/rate.html",
        bindings: {
            "value": "<",
            "max": "<",
            "setRating": "&"
        },
        controllerAs: "m",
        controller: function () {
            var model = this;

            var buildEntries = function (value, max) {
                var result = [];
                for (var i = 1; i <= max; i++) {
                    result.push(i <= value ? "star" : "star-empty");
                }
                return result;
            };

            model.$onChanges = function () {
                model.entries = buildEntries(model.value, model.max);
            };

            model.$onInit = function () {
                model.entries = buildEntries(model.value, model.max);
            };
        }
    });


    module.component("movieList", {
       templateUrl: "/tr-movies/movieList.html",
    //    $canActivate: function($timeout) {
    //         return $timeout(function() {
    //             return true;
    //         }, 2000);
    //    },
       controllerAs: "m",
       controller: function($http) {
            var m = this;
            
            m.$onInit = function() {
              $http.get("movies.json").then(function(response) {
                m.movies = response.data; 
              });
            };
            
            m.changeRating = function(movie, value) {
                movie.rating = value;  
            };
            
            
       } 
    });
    
    module.component("aboutLocation", {template:"Location...."});
    module.component("aboutPhone", { template: "Phone numbers go here..."});
    
    
    module.component("aboutUs", {
       templateUrl: "/tr-movies/aboutUs.html",
       $routeConfig: [
           { path: "/location", component: "aboutLocation", name:"Location"},
           { path:"/phone", component: "aboutPhone", name:"Phone"}
       ]      
    });

    module.component("movieApp", {
        $routeConfig: [
            { path:"/list", component:"movieList", name:"List"},
            { path:"/about/...", component:"aboutUs", name:"About"},
            { path:"/**", redirectTo: ["List"]} 
        ],
        templateUrl: "/tr-movies/movieApp.html",
        controllerAs: "m",
        controller: function() {
            var m = this;
            
            m.message = "Hello from a component";
        } 
    });

} ());