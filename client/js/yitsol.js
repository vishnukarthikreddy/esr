var app = angular.module('myApp', ['ngRoute','ngCalendar','datatables'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'homeController'
        }).when('/userProfile', {
        templateUrl: '/profile.html',
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
        .when('/Status', {
          templateUrl: '/Status.html',
          controller: 'StatusController'
        })
        .when('/report', {
          templateUrl: '/report.html',
          controller: 'reportController'
        })
      .when('/rsr-resourcesleaves', {
        templateUrl: '/rsr-resourcesleaves.html',
        controller: 'resourcesleavesController'
      })
      .when('/manager', {
        templateUrl: '/ManagerCreate.html',
        controller: 'managerController'
      })
      .when('/LeaveRequest',{
        templateUrl:'Leave Request.html',
        controller:'LeaveRequestController'
      })
      .when('/ResourceLeaves',{
        templateUrl:'Resource Leaves.html',
        controller:'ResourceLeavesController'
      })
      .when('/TaskTypeMaster',{
        templateUrl:'TaskTypeMaster.html',
        controller:'TaskTypeMasterController'
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
  $scope.adminshow=true;
  $scope.profileDetails = JSON.parse($window.localStorage.getItem('profileDetails'))
  if($scope.profileDetails) {

    if ($scope.profileDetails.resourceName == undefined || $scope.profileDetails.resourceName == null) {
      $rootScope.nameOfLoginPerson = $scope.profileDetails.name;
    } else {
      $rootScope.nameOfLoginPerson = $scope.profileDetails.resourceName;
    }
  }
  $('#errormsgdis').hide();
  $scope.forgotPassword=function () {

    var sendmail=$scope.forgotmail;
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (reg.test(sendmail)) {
      $http({
        method: 'POST',
        url: 'http://139.162.42.96:4545/api/emails',
        headers: {"Content-Type": "application/json", "Accept": "application/json"},
        data: {
          "to": "hr@yitsol.com",
          "from": sendmail,
          "subject": "Forgot Password",
          "text": "",
          "html": "Password for  is  &nbsp;&nbsp;" + sendmail+ "&nbsp;&nbsp; Change password after login. " + "<br>Thank You"
        }
      }).success(function (response) {
        $('#errormsgdis').hide();
        console.log('Users Response :');
        $('#myModal112').modal('hide');

      }).error(function (response) {
        console.log('Error Response :' + JSON.stringify(response));
      });
    }else{
      $('#errormsgdis').show();
    }

  }
  $scope.user = {
    "email": "",
    "password": "",
  };

  $scope.loginSubmit = function() {
    $scope.word = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    if($scope.word=="" ||$scope.word==null){

    }
    var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (reg.test($scope.user.email)){

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
          $rootScope.loginPersonDetails="somedata is";
          $rootScope.nameOfLoginPerson=response.username;

          var data=response;
          $window.localStorage.setItem("profileDetails",JSON.stringify(data));
          console.log('after login details are'+$rootScope.loginPersonDetails);
          $scope.loginDetails= response;
          if(response.role=='admin'){
            window.location.href = "/index.html#/rsr-resources";
          }else if(response.role=='manager'){
            window.location.href = "/index.html#/rsr-resources";
          }else if(response.role=='employee'){
            window.location.href = "/index.html#/rsr-resources";
          }
          window.location.href = "/index.html#/rsr-resources";
        }).error(function (response) {
          console.log('Error Response :' + JSON.stringify(response));
        });




      }).error(function (response, data) {
        console.log("failure"+JSON.stringify(response));
      })
    }else {
      Notification.error({message: 'Enter valid email id', delay: 3000});
      alert("Enter valid email id");
    }

  }

});
/** index controlle **/


/** home controlle **/
app.controller('homeController', function($http, $scope, $window, $location, $rootScope) {
  console.log("homeController");

    $scope.profile=JSON.parse($window.localStorage.getItem("profileDetails"));


  /*$scope.updatePassword=function(){
    $scope.userInfo=JSON.parse($window.localStorage.getItem('userInfo'));

    var oldPassword = document.getElementById("oldPassword").value;
    var npassword = document.getElementById("nPassword").value;
    var cpasswor = document.getElementById("cPassword").value;
    if (oldPassword.length >= 6 ){
      if (npassword.length >= 6 ){

        if(npassword==cpasswor){

          $http({
            "method": "POST",
            "url": "http://139.162.42.96:4545/api/Resources/login",
            "headers": {"Content-Type": "application/json", "Accept": "application/json"},
            "data": {
              "email": $scope.profile.email,
              "password": oldPassword.trim()      }
          }).success(function (response, data) {
            console.log("success");
            $scope.userDetails = response;

            var accessToken=$scope.userDetails.id;
            console.log("details....."+ JSON.stringify($scope.userDetails));
            $window.localStorage.setItem('userDetails',JSON.stringify($scope.userDetails));
            if($scope.userDetails.expireTime)
              var experiedTime=$scope.userDetails.expireTime;
            $window.localStorage.setItem('experiedTime',experiedTime);



              $http({
                method:"put",
                url: 'http://139.162.42.96:4545/api/Resources/'+$scope.userDetails.userId+"?access_token="+$scope.userDetails.id,
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                data:{"password":npassword}
              }).success(function(responce){



              }).error(function(responce){
                cb(responce);

              })



          }).error(function (data) {
            $scope.passwordError = true;
            // $scope.passwordErrorMessage = 'Please enter Correct password';
            Notification.error({message: 'Please Enter Correct Password', delay: 5000});
          })
        }
        else{
          Notification.error({message: 'Password dose not match', delay: 3000});
          return false;
        }
      }
      else{
        Notification.error({message: 'Password must have atleast 6 characters', delay: 3000});
        return false;
      }
    }else{
      Notification.error({message: 'Password must have atleast 6 characters', delay: 3000});
      return false;
    }
  };*/


});
/** home controlle **/

//*************ResourcesController***********************
app.controller('resourcesController', function($scope,$http,$rootScope) {

  console.log("resources controller entered"+$rootScope.loginPersonDetails);
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
    //$scope.reset();resource.password
    $scope.resource['confpassword']=$scope.resource.password;
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

  //$scope.updateResource = {};
  $scope.editPopup = function(resourceInfo){
    console.log('Edit resource:'+JSON.stringify(resourceInfo));
    $scope.updateResource = resourceInfo;
    console.log("entered resource Update"+JSON.stringify($scope.updateResource1));
  };

  $scope.editResource = function(){

    console.log('Edit Resource:'+JSON.stringify($scope.updateResource));
    $http({
      method: 'PUT',
      url: 'http://139.162.42.96:4545/api/Resources/'+$scope.updateResource.id,
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data: $scope.updateResource
    }).success(function (response) {
      console.log('Resources Response :' + JSON.stringify(response));
      $rootScope.updateResource = {};
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
      $rootScope.managerList=response;

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

$scope.editProject={
  "projectId":"",
  "id":"",
  "name":"",
  "description":"",
  "technology":"",
  "startDate":"",
  "endDate":"",
  "status":"",
  "company":""
}

  $scope.editProject12=function(project){

    $scope.editProject.projectId=project.projectId;
    $scope.editProject.id=project.id;
    $scope.editProjectname=project.name;
    $scope.editProject.description=project.description;
    $scope.editProject.technology=project.technology;
    $scope.editProject.startDate=project.startDate;
    $scope.editProject.endDate=project.endDate;
    $scope.editProject.status=project.status;
    $scope.editProject.company=project.company;
    $('#resourceEdit').modal('show');


  /*  $scope.editProject =project;
    $scope.showeditprojectpopup();*/
  }

  $scope.updateProject=function(){
//alert('hai');
    var projectDetails=$scope.editProject;
    projectDetails['name']=$scope.editProjectname;
    projectDetails['updatedBy']=loginDetails.name;
    projectDetails['updatedTime']=new Date();


    console.log('project details'+JSON.stringify(projectDetails));
    $http({
      method: 'PUT',
      url: 'http://139.162.42.96:4545/api/Projects/'+$scope.editProject.id,
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data:projectDetails
    }).success(function (response) {
      $scope.getProjects();
      $('#resourceEdit').modal('hide');
      // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
       $rootScope.projectsData = response;*/

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    // alert('create Project');


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

  //console.log(JSON.stringify(JSON.parse($window.localStorage.getItem('profileDetails'))));
  var loginDetails=JSON.parse($window.localStorage.getItem('profileDetails'));

  $scope.createProject=function(){
//alert('hai');
var projectDetails=$scope.project;
    projectDetails['createdBy']=loginDetails.name;
    projectDetails['createdTime']=new Date();


console.log('project details'+JSON.stringify(projectDetails));
    $http({
      method: 'POST',
      url: 'http://139.162.42.96:4545/api/Projects',
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data:projectDetails
    }).success(function (response) {
      $scope.getProjects();
      $('#myModal').modal('hide');
     // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
        $rootScope.projectsData = response;*/

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
//      $rootScope.CalendarData = response;
      $('#createCalendar').modal('hide');
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
            url: 'http://139.162.42.96:4545/api/Resources',
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
app.controller('LeaveRequestController',function($scope,$http,$rootScope,$window) {

  $scope.master = {};
  console.log("projects controller entered");
  $scope.getLeaveRequests = function () {
    $http({
      method: 'GET',
      url: 'http://localhost:4545/api/LeaveRequests',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
      $scope.projectsData = response;

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });
  };
  $scope.getLeaveRequests();


  $scope.editLeaveRequest = {
    "empId": "",
    "empName": "",
    "startDt": "",
    "endDt": "",
    "noOfDays": "",
    "leaveType": "",
    "mgrApprovalStatus": "",
    "hrApprovalStatus": "",
    "reasonforleave": ""


  }
  $scope.editLeaveRequest1 = function (Leaverequest) {
   // alert(JSON.stringify(Leaverequest))
    $scope.editLeaveRequest.id = Leaverequest.id;
    $scope.editLeaveRequest.empId = Leaverequest.empId;
    $scope.editLeaveRequest.empName = Leaverequest.empName;
    $scope.editLeaveRequest.startDt = Leaverequest.startDt;
    $scope.editLeaveRequest.endDt = Leaverequest.endDt;
    $scope.editLeaveRequest.noOfDays = Leaverequest.noOfDays;
    $scope.editLeaveRequest.reasonForLeave = Leaverequest.reasonForLeave;
    alert("hiii:"+$scope.editLeaveRequest.reasonForLeave);
    $scope.editLeaveRequest.leaveType = Leaverequest.leaveType;
    $scope.editLeaveRequest.mgrApprovalStatus = Leaverequest.mgrApprovalStatus;
    $scope.editLeaveRequest.hrApprovalStatus = Leaverequest.hrApprovalStatus;

    $('#projectEdit').modal('show');
  }
  $scope.updateProject = function () {
//alert('hai');
   /* var requestDetails = $scope.editProject;
    requestDetails['name'] = $scope.editProjectname;
    requestDetails['updatedBy'] = loginDetails.name;
    requestDetails['updatedTime'] = new Date();*/


    //console.log('request details' + JSON.stringify(requestDetails));
    $http({
      method: 'PUT',
      url: 'http://localhost:4545/api/LeaveRequests/' + $scope.editLeaveRequest.id,
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data: $scope.editLeaveRequest
    }).success(function (response) {
      $scope.getLeaveRequests();
      $('#resourceEdit').modal('hide');
      // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
       $rootScope.projectsData = response;*/

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    // alert('create Project');


  }
  /* var loginDetails=JSON.parse($window.localStorage.getItem('profileDetails'));
   $scope.request={
   "noOfDays":"",
   "name":loginDetails.empName
   }



   console.log("$scope.request.noOfDays"+$scope.request.noOfDays);
   $scope.formatString = function(format) {
   var day   = parseInt(format.substring(0,2));
   var month  = parseInt(format.substring(3,5));
   var year   = parseInt(format.substring(6,10));
   var date = new Date(year, month-1, day);
   return date;
   }
   $scope.calData=function()
   {

   var date1 = new Date($scope.formatString($scope.request.startDt));
   var date2 = new Date($scope.formatString($scope.request.endDt));
   var timeDiff = Math.abs(date2.getTime() - date1.getTime());
   var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
   $scope.request.noOfDays=diffDays;
   }*/
  $scope.reset = function () {

    $scope.request = angular.copy($scope.master);
  };

  $scope.request= {};
  $scope.reset();
/*
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

  console.log(JSON.stringify(JSON.parse($window.localStorage.getItem('profileDetails'))));
  var loginDetails=JSON.parse($window.localStorage.getItem('profileDetails'));
*/

  var loginDetails=JSON.parse($window.localStorage.getItem('profileDetails'));
  $scope.request={
    "noOfDays":"",
    "name":loginDetails.empName
  }



  console.log("$scope.request.noOfDays"+$scope.request.noOfDays);
  $scope.formatString = function(format) {
    var day   = parseInt(format.substring(0,2));
    var month  = parseInt(format.substring(3,5));
    var year   = parseInt(format.substring(6,10));
    var date = new Date(year, month-1, day);
    return date;
  }
  $scope.calData=function()
  {

    var date1 = new Date($scope.formatString($scope.request.startDt));
    var date2 = new Date($scope.formatString($scope.request.endDt));
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    $scope.request.noOfDays=diffDays;
  }
  $scope.createRequest=function(){
//alert('hai');
    var requestDetails=$scope.request;
     // 9

    requestDetails['createdBy']=loginDetails.name;
    requestDetails['createdTime']=new Date();
  /*  requestDetails['numberOfDays']=d;*/


  console.log("requestDetails"+JSON.stringify(requestDetails));
    $http({
      method: 'POST',
      url: 'http://localhost:4545/api/leaveRequests',
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      data:requestDetails
    }).success(function (response) {
      $scope.getLeaveRequests();
      $('#myModal').modal('hide');
      // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
       $rootScope.projectsData = response;*/

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    // alert('create Project');


  }
  })
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
/*anil*/
app.controller('ResourceLeavesController',function($scope,$http,$rootScope) {
  $scope.master = {};
  console.log("resourceLeaves controller entered");
  $scope.getLeaves = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:4545/api/employeeLeaveMasters',
      headers: {"Content-Type": "application/json", "Accept": "application/json"}
    }).success(function (response) {
      console.log('Users Response :' + JSON.stringify(response));
      $scope.editLeave = response;

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });
  };
  $scope.getLeaves();

  $scope.resourceLeave={
    "empId":"",
    "financialYear":"",
    "CLsEntitled":"",
    "CLsAvailed":"",
    "SLsEntitled":"",
    "SLsAvailed":"",
    "ELsEntitled":"",
    "ELsAvailed":""

  }


  $scope.editLeave2=function(leave){
   // alert(leave)
    $scope.resourceLeave=leave;
    $('#resourceEdit').modal('show');


  }


  $scope.editLeave=function(resourceLeave){
    alert(" "+resourceLeave)
  $('#resourceEdit').modal('show');
    console.log('project details'+JSON.stringify(Leave));
    $scope.editLeave.empId=resourceLeave.empId;
    $scope.editLeave.financialYear=resourceLeave.financialYear;
    $scope.editLeave.CLsEntitled=resourceLeave.CLsEntitled;
    $scope.editLeave.CLsAvailed=resourceLeave.CLsAvailed;
    $scope.editLeave.SLsEntitled=resourceLeave.SLsEntitled;
    $scope.editLeave.SLsAvailed=resourceLeave.SLsAvailed;
    $scope.editLeave.ELsEntitled=resourceLeave.ELsEntitled;
    $scope.editLeave.ELsAvailed=resourceLeave.ELsAvailed;
    //$('#projectEdit').modal('show');
    //$('#resourceEdit').modal('show');


   $scope.editProject =project;
     $scope.showeditprojectpopup();
  }
  $scope.updateLeave=function(){
//alert('hai');
    var leaveDetails=$scope.editLeave;
    editLeave['name']=$scope.editResourceLeavename;
    editLeave['updatedBy']=loginDetails.name;
    editLeave['updatedTime']=new Date();


    /*console.log('project details'+JSON.stringify(projectDetails));*/
    $http({
      method: 'PUT',
      url: 'http://localhost:4545/api/employeeLeaveMasters/'+$scope.resourceLeave.id,
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      "data":leaveDetails
    }).success(function (response) {
      $scope.getLeaves();
      $('#resourceEdit').modal('hide');
      // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
       $rootScope.projectsData = response;*/

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    // alert('create Project');


  }

  $scope.reset = function() {

    $scope.project = angular.copy($scope.master);
  };

  $scope.project = {};
  $scope.reset();


 /* $scope.getManager();

  console.log(JSON.stringify(JSON.parse($window.localStorage.getItem('profileDetails'))));
  var loginDetails=JSON.parse($window.localStorage.getItem('profileDetails'));
*/

  $scope.createLeave1=function(){
 /* alert('hai'+JSON.stringify($scope.editLeave));*/
  /*  var projectDetails=$scope.project;
    projectDetails['createdBy']=loginDetails.name;
    projectDetails['createdTime']=new Date();*/


  /*  console.log('project details'+JSON.stringify(projectDetails));*/
    $http({
      method: 'POST',
      url: 'http://localhost:4545/api/employeeLeaveMasters',
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      "data": leaveDetails
    }).success(function (response) {



      $('#resourceEdit').modal('hide');

      $scope.getLeaves();
      // $('#createCalendar').modal('hide');
      /*console.log('Users Response :' + JSON.stringify(response));
       $rootScope.projectsData = response;*/

    }).error(function (response) {
      console.log('Error Response :' + JSON.stringify(response));
    });

    // alert('create Project');

  }


})
app.controller('TaskTypeMasterController',function($scope,$http,$rootScope) {

})

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
  $scope.timeList= [];
var timeDetails={
  "project":"",
  "task":"",
  "monday":'',
  "tuesday":'',
  "wednesday":'',
  "thursday":'',
  "friday":'',
  "saturday":'',
  "sunday":'',
  "total":''
};

  $scope.timeList.push(timeDetails);
  $scope.rowsLength=1;
  $scope.addIme = function(){
    console.log('lenght is'+    $scope.timeList.length);
    console.log('monday value'+$scope.timeList[0].monday);
    $scope.timeList[0].total= $scope.timeList[0].monday+$scope.timeList[0].monday;


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
app.controller('StatusController', function($scope,$http,$rootScope) {

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
  var loginPersonDetail=JSON.parse($window.localStorage.getItem('profileDetails'));

 //console.log(JSON.parse($window.localStorage.getItem('profileDetails')));
//console.log('login user details are'+JSON.stringify($rootScope.loginPersonDetails));
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

  // alert(JSON.stringify($scope.editManager));



 }

  $scope.createManager=function(){
    //alert($scope.manager.password);
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
      //console.log(JSON.stringify(JSON.parse($window.localStorage.getItem('profileDetails'))));
      var loginDetails=$window.localStorage.getItem('profileDetails');

      console.log('login details'+JSON.stringify(loginDetails));

      if(loginPersonDetail.role=='admin'){

        manager['createdBy']=loginPersonDetail.name;
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
app.controller('resourcesleavesController', function($http, $scope, $window, $location, $rootScope){
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
});
