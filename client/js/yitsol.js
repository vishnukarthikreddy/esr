var app = angular.module('myApp', ['ngRoute','ngCalendar'])

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
      .when('/manager', {
        templateUrl: '/ManagerCreate.html',
        controller: 'managerController'
      })

      .otherwise({redirectTo: '/'});
});

function validateAccessToken(){

  var experiedTime = new Date(window.localStorage.getItem('experiedTime'));
  var date=new Date();
  console.log('now Time is'+date);
  console.log('experiedTime is'+experiedTime);
  if(experiedTime>date){
    console.log('It is more');
    return true;
  }else{
    console.log('It is less');
    return false;
  }

}


/** index controlle **/
app.controller('indexController', function($http, $scope, $window, $location, $rootScope) {
  console.log("indexController");

  $scope.user = {
    "email": "",
    "password": "",
  };

  $scope.loginSubmit = function() {
    $scope.word = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    if($scope.word=="" ||$scope.word==null){
      alert();
    }

    $http({
      "method": "POST",
      "url": "http://139.162.42.96:4545/api/Resources/login",
      "headers": {"Content-Type": "application/json", "Accept": "application/json"},
      "data": {
        "email": $scope.user.email,
        "password": $scope.user.password      }
    }).success(function (response, data) {
        console.log("success");
        $scope.userDetails = response;
       var accessToken=$scope.userDetails.id;
      console.log("details....."+ JSON.stringify($scope.userDetails));
      $window.localStorage.setItem('userDetails',JSON.stringify($scope.userDetails));
      if($scope.userDetails.expireTime)
        var experiedTime=$scope.userDetails.expireTime;
      $window.localStorage.setItem('experiedTime',experiedTime);
      console.log(validateAccessToken());

      $http({
        method: 'GET',
        url: 'http://139.162.42.96:4545/api/Resources/'+$scope.userDetails.userId+"?access_token="+$scope.userDetails.id,
        headers: {"Content-Type": "application/json", "Accept": "application/json"}
      }).success(function (response) {
        console.log('Users Response :' + JSON.stringify(response));
        $window.localStorage.setItem('profileDetails',response);
        $scope.loginDetails= response;
        if(response.role=='admin'){
          window.location.href = "/index.html#/rsr-resources";
        }else if(response.role=='manager'){

        }else if(response.role=='employee'){

        }

      }).error(function (response) {
        console.log('Error Response :' + JSON.stringify(response));
      });




    }).error(function (response, data) {
      console.log("failure"+JSON.stringify(response));
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
      url: 'http://139.162.42.96:4545/api/Resources/',
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
      url: 'http://139.162.42.96:4545/api/Resources',
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
      url: 'http://139.162.42.96:4545/api/Resources/'+$scope.updateResource.email,
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

  $scope.cancelEdit = function(){
    $scope.getResources();
    $('#resourceEdit').modal('hide');
  };


  $scope.getManager=function(){
    $http({
      method: 'GET',
      url: 'http://139.162.42.96:4545/api/Resources?filter={"where":{"role":"manager"}}',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}

    }).success(function (response) {
      // console.log('Users Response :' + JSON.stringify(response));
      $scope.managerList=response;
    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
      console.log("entered post last");
    });
  }

  $scope.getManager();

});
//*************************ResourceController**************************


//************************ProjectController**************************
app.controller('projectsController', function($http, $scope, $window, $location, $rootScope) {

  $scope.master = {};
    console.log("projects controller entered");
    $scope.getProjects = function() {
        $http({
            method: 'GET',
            url: 'http://139.162.42.96:4545/api/Projects',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.projectsData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getProjects();

  $scope.editProject=function(project){

    $scope.editProject =project;

  }


    $scope.reset = function() {
        $scope.project = angular.copy($scope.master);
    };

    $scope.project = {};
    $scope.reset();
  $scope.getManager=function(){
    $http({
      method: 'GET',
      url: 'http://139.162.42.96:4545/api/Resources?filter={"where":{"role":"manager"}}',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}

    }).success(function (response) {
      // console.log('Users Response :' + JSON.stringify(response));
      $scope.managerList=response;
    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
      console.log("entered post last");
    });
  }

  $scope.getManager();


  $scope.createProject=function(){
alert('hai');
var projectDetails=$scope.project;
console.log('project details'+JSON.stringify(projectDetails));
    $http({
      method: 'POST',
      url: 'http://139.162.42.96:4545/api/Projects',
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data:projectDetails
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
        $rootScope.projectsData = response;

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

   // alert('create Project');


  }



});
//************************ProjectController**************************

//****************************CalenderController************************//
app.controller('calenderController', function($http, $scope, $window, $location, $rootScope) {

    console.log("calender controller entered");
    $scope.getCalender = function() {
        $http({
            method: 'GET',
            url: 'http://139.162.42.96:4545/api/Calendars',
            headers: {"Content-Type": "application/json", "Accept": "application/json"}
        }).success(function (response) {
            console.log('Users Response :' + JSON.stringify(response));
            $rootScope.calenderData = response;

        }).error(function (response) {
            console.log('Error Response :' + JSON.stringify(response));
        });
    };
    $scope.getCalender();

  $scope.createCalendar = function() {
    var createCalendar={
      "startDate": $scope.calendar.calendarStartDate,
      "endtDate": $scope.calendar.calendarEndDate,
      "period": $scope.calendar.calendarStartDate+" To "+ $scope.calendar.calendarEndDate
    }

    $http({
      method: 'POST',
      url: 'http://139.162.42.96:4545/api/Calendars',
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data: createCalendar
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
      $rootScope.CalendarData = response;
      $scope.getCalender();
    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    console.log('project calendar details'+JSON.stringify(createCalendar));

  }

    $scope.reset = function() {
        $scope.calender = angular.copy($scope.master);
    };

    $scope.calender = {};
    $scope.reset();

  $scope.reset = function() {
    $scope.resource = angular.copy($scope.master);
  };

});
//****************************CalenderController************************


//****************************UsersController************************//
app.controller('usersController', function($scope,$http,$rootScope) {

    console.log("users controller entered");
    $scope.getUsers = function() {
        $http({
            method: 'GET',
            url: 'http://139.162.42.96:4545/api/RsrUsers',
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
//****************************UsersController************************//

//****************************WeeklyStatusController************************//
app.controller('StatusController', function($scope,$http,$rootScope) {

    console.log("status controller entered");
    $scope.getStatus = function() {
        $http({
            method: 'GET',
            url: 'http://139.162.42.96:4545/api/WeeklyStatuses',
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
//****************************WeeklyStatusController************************//

//****************************Status entry Controller************************//
app.controller('StatusEntryController', function($scope,$http,$rootScope) {

  $scope.getCalender = function() {
    $http({
      method: 'GET',
      url: 'http://139.162.42.96:4545/api/Calendars',
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
      url: 'http://139.162.42.96:4545/api/Projects',
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

  /*$scope.addPerson = function(){
    var person = {
      name: $scope.name,
      age: $scope.age,
      title: $scope.title,
    };

    $scope.people.push(person);
  };*/
  $scope.timeList= [

  ];
var timeDetails={
  "project1":"",
  "task1":"",
  "monday1":'',
  "tuesday1":'',
  "wednesday1":'',
  "thursday1":'',
  "friday1":'',
  "saturday1":'',
  "sunday1":'',
  "total1":''
};

  $scope.timeList.push(timeDetails);
  $scope.rowsLength=1;
  $scope.addIme = function(){
    var lengthOfRows=$scope.timeList.length+1;
    var projectName='project'+lengthOfRows;
    var taskName='task'+lengthOfRows;
    var mondayName='monday'+lengthOfRows;
    var tuesdayName='tuesday'+lengthOfRows;
    var wednesdayName='wedneday'+lengthOfRows;
    var thursdayName='thursday'+lengthOfRows;
    var fridayName='friday'+lengthOfRows;
    var saturdayName='saturday'+lengthOfRows;
    var sundayName='sunday'+lengthOfRows;
    var totalTime='total'+lengthOfRows;
    var projectRows = {
      projectName:"",
      taskName:"",
      mondayName:'',
      tuesdayName:'',
      wednesdayName:'',
      thursdayName:'',
      fridayName:'',
      saturdayName:'',
      sundayName:'',
      totalTime:''
    };

    $scope.timeList.push(projectRows);
  };

  $scope.removePerson = function(index){
    $scope.timeList.splice(index, 1);
  };

});

//****************************manager Approval Controller************************//
app.controller('managerApprovalController', function($scope,$http,$rootScope) {

  $scope.rowCount=[];
//  var data=


});
//****************************manager Approval Controller************************//

//****************************report Controller************************//
app.controller('reportController', function($scope,$http,$rootScope) {

  $scope.rowCount=[];
//  var data=


});
//****************************report Controller************************//

//****************************manager Controller************************//
app.controller('managerController', function($scope,$http,$window,$rootScope) {
  $scope.master={};
  $scope.rowCount=[];
//  var data=
  /*status*/
  $scope.reset = function() {
    $scope.manager = angular.copy($scope.master);
  };

  $scope.getManager=function(){
    $http({
      method: 'GET',
      url: 'http://139.162.42.96:4545/api/Resources?filter={"where":{"role":"manager"}}',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}

    }).success(function (response) {
     // console.log('Users Response :' + JSON.stringify(response));
      $scope.managerList=response;
    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
      console.log("entered post last");
    });
  }

$scope.getManager();


$scope.editManager=function(manager){
  $scope.editManager=manager;
}
 $scope.managerEdit=function(){

   var editManagerDetails={
     "name":$scope.editManager.name,
     "employeeId":$scope.editManager.employeeId,
     "email":$scope.editManager.email,
     "status":$scope.editManager.status
   }

   console.log(JSON.stringify(editManagerDetails));
   $http({
     method: 'PUT',
     url: 'http://139.162.42.96:4545/api/Resources/'+ $scope.editManager.id,
     headers: {"Content-Type": "application/json", "Accept": "application/json"},
     data: editManagerDetails
   }).success(function (response) {
     console.log('Users Response :' + JSON.stringify(response));
     $rootScope.resourcesData.push(response);
     $scope.resource ={};
     $scope.getManager();
     $('#managerEditDetails').modal('hide');
   }).error(function (response) {
     console.log('Error Response :' + JSON.stringify(response));
     console.log("entered post last");
   });

   alert(JSON.stringify($scope.editManager));



 }

  $scope.createManager=function(){
    alert($scope.manager.password);
    var manager={
      "name":$scope.manager.name,
      "employeeId":$scope.manager.employeeId,
      "email":$scope.manager.email,
      "password":$scope.manager.password,
      "role":"manager",
      "status":$scope.manager.status
      };

      //=$scope.manager;
    //manager
    if(validateAccessToken()){
      var loginDetails=$window.localStorage.getItem('profileDetails');

      console.log('login details'+loginDetails);

      if(loginDetails.role=='admin'){

        manager['createdBy']=loginDetails.name;
        manager['createdTime']=new Date();

        $http({
          method: 'POST',
          url: 'http://139.162.42.96:4545/api/Resources',
          headers: {"Content-Type": "application/json", "Accept": "application/json"},
          data: manager

        }).success(function (response) {
          console.log('Users Response :' + JSON.stringify(response));
          $rootScope.resourcesData.push(response);
          $scope.resource ={};
          $scope.getManager();
          $('#myModal').modal('hide');
        }).error(function (response) {
          console.log('Error Response :' + JSON.stringify(response));
          console.log("entered post last");
        });

      }else{
        alert('You donot have option to create manager');
      }
    }else{

    }

 /*
*/
    //alert(JSON.stringify($scope.manager));



  }


});
//****************************manager Controller************************
