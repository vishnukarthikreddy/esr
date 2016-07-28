var app = angular.module('myApp', ['ngRoute', 'ngCalendar'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'homeController'
        })
        .when('/rsr-resources', {
          templateUrl: '/rsr-resources.html',
          controller: 'resourcesController'
        })
        .when('/projects', {
            templateUrl: '/rsr-projects.html',
            controller: 'projectsController'
        })
        .when('/calender', {
            templateUrl: '/rsr-calender.html',
            controller: 'calenderController'
        })
        .when('/users', {
            templateUrl: '/rsr-users.html',
            controller: 'usersController'
        })
        .when('/status', {
            templateUrl: '/rsr-weekly-status.html',
            controller: 'StatusController'
        })
        .when('/statusEntry', {
          templateUrl: '/statusEntry.html',
          controller: 'StatusEntryController'
        })
        .when('/managerApproval', {
          templateUrl: '/managerApproval.html',
          controller: 'managerApprovalController'
        })
        .when('/report', {
          templateUrl: '/report.html',
          controller: 'reportController'
        })
        .otherwise({redirectTo: '/'});
});

/** index controlle **/
app.controller('indexController', function($http, $scope, $window, $location, $rootScope) {
  console.log("indexController");

  $scope.user = {
    "email": "",
    "password": "",
  };

  $scope.loginSubmit = function() {
    $http({
      "method": "POST",
      "url": "http://localhost:3000/api/Resources/login",
      "headers": {"Content-Type": "application/json", "Accept": "application/json"},
      "data": {
        "email": $scope.user.email,
        "password": $scope.user.password      }
    }).success(function (response, data) {
        console.log("success");
        $scope.userDetails1 = response;
        console.log("details....."+ JSON.stringify($scope.userDetails1));
        $window.localStorage.setItem('userDetails',JSON.stringify($scope.userDetails1));

        /*console.log("details111"+ $scope.userDetails1);
        $window.localStorage.setItem('userDetails',$scope.user);
        $scope.userDetails = $window.localStorage.getItem('userDetails');
        console.log("details"+ JSON.stringify($scope.userDetails));*/
        window.location.href = "/index.html";
    }).error(function (response, data) {
      console.log("failure");
    })
  }

});
/** index controlle **/


/** home controlle **/
app.controller('homeController', function($http, $scope, $window, $location, $rootScope) {
  console.log("homeController");
});
/** home controlle **/

//*************ResourcesController***********************
app.controller('resourcesController', function($scope,$http,$rootScope) {
    console.log("resources controller entered");
  
    $scope.getResources = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/Resources/',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.resourcesData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getResources();

    $scope.reset = function() {
        $scope.resource = angular.copy($scope.master);
    };

    $scope.resource = {};
    //********create Resource***********
    $scope.createResource = function() {
        console.log('User data:' + JSON.stringify($scope.resource));
    //$scope.reset();

        console.log("resource"+$scope.resource);
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/Resources',
          headers: {"Content-Type": "application/json", "Accept": "application/json"},
            data: $scope.resource

        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.resourcesData.push(response);
            $scope.resource ={};
            $('#myModal').modal('hide');
        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
            console.log("entered post last");
        });
    };

    $scope.updateResource = {};
    $scope.editPopup = function(resourceInfo){
        console.log('Edit resource:'+JSON.stringify(resourceInfo));
        $scope.updateResource = resourceInfo;
        console.log("entered resource Update");
    };

    $scope.editResource = function(){
        console.log('Edit Resource:'+JSON.stringify($scope.updateResource));
        $http({
            method: 'PUT',
            url: 'http://localhost:3000/api/Resources/'+$scope.updateResource.id,
            headers: {"Content-Type": "application/json", "Accept": "application/json"},
            data: $scope.updateResource
        }).success(function (response) {
            console.log('Resources Response :' + JSON.stringify(response));
            $scope.updateResource = {};
            console.log("entered Put");
            $scope.getResources();
            $('#resourceEdit').modal('hide');
        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
            console.log("Update done");
        });
    };


});

//*************************ResourceController**************************


//************************ProjectController**************************
app.controller('projectsController', function($http, $scope, $window, $location, $rootScope) {

    console.log("projects controller entered");
    $scope.getProjects = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/Projects',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.projectsData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getProjects();

    $scope.reset = function() {
        $scope.project = angular.copy($scope.master);
    };

    $scope.project = {};
    $scope.reset();


});

//************************ProjectController**************************

//****************************CalenderController************************

app.controller('calenderController', function($http, $scope, $window, $location, $rootScope) {

    console.log("calender controller entered");
    $scope.getCalender = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/Calendars',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.calenderData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getCalender();

    $scope.reset = function() {
        $scope.calender = angular.copy($scope.master);
    };

    $scope.calender = {};
    $scope.reset();


});
//****************************CalenderController************************


//****************************UsersController************************

app.controller('usersController', function($scope,$http,$rootScope) {

    console.log("users controller entered");
    $scope.getUsers = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/RsrUsers',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.usersData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getUsers();

    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };

    $scope.user = {};
    $scope.reset();


});
//****************************UsersController************************

//****************************WeeklyStatusController************************

app.controller('StatusController', function($scope,$http,$rootScope) {

    console.log("status controller entered");
    $scope.getStatus = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/WeeklyStatuses',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.statusData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getStatus();

    $scope.reset = function() {
        $scope.status = angular.copy($scope.master);
    };

    $scope.status = {};
    $scope.reset();


});
//****************************WeeklyStatusController************************


//****************************Status entry Controller************************

app.controller('StatusEntryController', function($scope,$http,$rootScope) {
  $scope.getCalender = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/api/Calendars',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
      $rootScope.calenderData = response;

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });
  };
  $scope.getCalender();

  $scope.getProjects = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/api/Projects',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
      $rootScope.projectsData = response;

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });
  };

  $scope.getProjects();




  $scope.rowCount=[];
//  var data=


});

app.controller('managerApprovalController', function($scope,$http,$rootScope) {

  $scope.rowCount=[];
//  var data=


});
app.controller('reportController', function($scope,$http,$rootScope) {

  $scope.rowCount=[];
//  var data=


});
//****************************Status Entry Controller************************
