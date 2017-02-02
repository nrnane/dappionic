 myapp.controller('AppCtrl', function($scope, API_URL,Socket,$ionicModal, $timeout,$ionicPopup,$http,UserService,$localStorage,$rootScope,$state,toaster) {

  Socket.on("connect",function(){
    //alert(this.id);
    console.log("socket connected");
  });
  // Form data for the login modal
  $scope.loginData = {};
  $scope.doLogin = function(loginData) {
    $http.post(API_URL+"login",loginData).then(function(result){
      console.log(result);
        if(result && result.data && result.data.status=="success"){
          UserService.setUser({
            uid:result.data.uid,
            name:result.data.first_name+' '+result.data.last_name,
            mobile:result.data.mobile,
            email:result.data.email
          });

          $state.go('app.home',{},{reload: true});

        }else if(result && result.data && result.data.status=="error"){
          toaster.pop('danger', "Error", result.data.message);
        }
    });

  };

  if(UserService.checkIfUserLoginTrue()){

     $scope.peoples = [];

    $scope.userlogin = true;
    $scope.uid = UserService.getUserId();





   /* $http.post(API_URL+"getPeoples",{"uid":UserService.getUserId()}).then(function(result){
      console.log(result.data);
      if(result){
        $scope.peoples = result.data;
      }
    });*/

    $scope.profile_like = function(uid){
      //alert(uid);
      $http.post(API_URL+"profileLike",{"uid":UserService.getUserId(),"profile_liked_uid":uid}).then(function(result){
        console.log(result.data);
        //alert('#like_'+uid);
        if(result.data.msg=="created"){
          $('#like_'+uid).addClass('red');
           toaster.pop('success', "Liked", "You Liked");
        }
        if(result.data.msg=="deleted"){
          $('#like_'+uid).removeClass('red');
          toaster.pop('danger', "Removed", "Your Like Removed");
        }
      });

    }

      function updateUserOnline(){

          $http.post(API_URL+"updateUserOnline",{uid:UserService.getUserId()}).then(function(result){
            console.log("User Online Updated"+result.data.status);
          });

      }
      updateUserOnline();

      setTimeout(function () {
          updateUserOnline();

      }, 10000);

  }//end if user login

  //Popup
  $scope.show_img_popup = function(url,Title) {
  $scope.data = {};
  // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
    template: '<img src="'+url+'" width="98%" height="250" />',
    title: Title,
    scope: $scope,
    buttons:[{
      text:'Cancel'
    }]
  });
  }

  //End Popup


  $scope.delete_item = function(item,arrays,table,where,value){
    var index = arrays.indexOf(item);
    $http.post(API_URL+"deleteItemFromTable",{"table":table,"where":where,'value':value}).then(function(result){
      if(result){
        arrays.splice(index, 1);
         toaster.pop('danger', "Deleted", "You Deleted Successfully");
      }
    });
  }
});
myapp.controller("homeCtrl",function($scope, API_URL,toaster,$ionicLoading, $ionicModal, $timeout,UserService,$http,$localStorage,$rootScope,$state){

    UserService.checkUserLogin();
    $ionicLoading.show();
   $scope.uid = UserService.getUserId();
   $http.post(API_URL+"getUnSeenCount",{"uid":UserService.getUserId()}).then(function(result){
     console.log(result);
     if(result){
       $scope.get_unseen_count = result.data;
     }
     $ionicLoading.hide();
   });

   //---


    $scope.noMoreItemsAvailable = false;
    $scope.peoples_per_request = 1;
    $scope.rfrom = 0;
    $scope.rto =  $scope.peoples_per_request;
    $scope.loadMore = function() {
      //$scope.items.push({ id: $scope.items.length});
      var postData = {"uid":UserService.getUserId(),"rfrom":$scope.rfrom,"rto":$scope.rto};
      

    

       $http.post(API_URL+"getPeoples",postData).then(function(result){
          console.log(result.data);
          if(result.data.length!=0){
            $scope.peoples.push(result.data[0]);

            $scope.rfrom +=$scope.peoples_per_request;
            $scope.rto +=$scope.peoples_per_request;

          }else{
            $scope.noMoreItemsAvailable = true;
          }
           
        });
       //console.log(postData);
      
    
    
        

      
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    //Load more end

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });

   //---

});

myapp.controller("ProfileCtrl",function($scope, API_URL,toaster,$ionicLoading, $ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state,$stateParams){
    $scope.AddToFavorite = "Add to Favorites";
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.username = $stateParams.name;
  console.log($scope.username);

  $scope.addToFavorite = function(favorite_uid){
    //alert(uid);
    $http.post(API_URL+"addToFavorite",{"uid":UserService.getUserId(),"favorite_uid":favorite_uid}).then(function(result){
      if(result){
        $scope.AddToFavorite = result.data.text;
        toaster.pop('success', "Favorite", result.data.text);

      }
    });
  }
  $http.post(API_URL+"getUserId",{"username":$scope.username}).then(function(result){

    if(result && result.data){
      $scope.userid = result.data.uid;
      console.log(result.data.uid);

      $http.post(API_URL+"insertWhoViewedMe",{"uid":UserService.getUserId(),"viewed_uid":$scope.userid}).then(function(result){

      });

      $http.post(API_URL+"geUserTotalProfileData",{"uid":$scope.userid}).then(function(result){
        console.log(result);
        if(result && result.data){
          $scope.user = result.data;
          console.log(result.data);
          $ionicLoading.hide();
        }
      });

      $http.post(API_URL+"checkInFavorite",{"uid":UserService.getUserId(),"favorite_uid":$scope.userid}).then(function(result){
        console.log(result);
        if(result){
          $scope.AddToFavorite = result.data.text;

        }
      });

    }//end if userid

  });
});

myapp.controller("myprofileCtrl",function($scope, API_URL,toaster,$ionicLoading, $ionicModal, $stateParams,$timeout,$http,UserService,$localStorage,$rootScope,$state,$ionicScrollDelegate,$cordovaCamera,$cordovaFileTransfer,$ionicLoading,$cordovaCapture){
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.uid = $stateParams.uid;
  $http.post(API_URL+"geUserTotalProfileData",{"uid":$scope.uid}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.user = result.data;
      console.log(result.data);
    }
    $ionicLoading.hide();
  });

  $scope.uploadPhoto = function(){
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: Camera.MediaType.ALLMEDIA,
        targetWidth: 400,
        targetHeight: 400
    };

          $cordovaCamera.getPicture(options).then(function(data) {
            $ionicLoading.show();
          $scope.filepath = "file:"+data;

          var targetPath = $scope.filepath;
          var filename = targetPath.split("/").pop();
          filename = filename.replace(" ","_");
             var date = new Date().getTime();
             var imgName = $scope.uid+"_"+date+".jpg";
             var options = {
                 fileKey: "file",
                 fileName: filename,
                 chunkedMode: false,
                 mimeType: "image/jpg"
             };

             $cordovaFileTransfer.upload(API_URL+"uploadPhotos", $scope.filepath, options).then(function(result) {
                 console.log("SUCCESS: " + JSON.stringify(result.response));
                 console.log('Result_' + result.response[0] + '_ending');


                 $http.post(API_URL+"updateProfilePic",{uid:$scope.uid,ProfilePic:filename}).then(function(result){

                 });
                   $ionicLoading.hide();
                  //$state.go('app.my-profile/'+$scope.uid,{},{reload: true});
                  $state.go($state.current, {}, {reload: true});
             }, function(err) {
                 console.log("ERROR: " + JSON.stringify(err));
                 //alert(JSON.stringify(err));
             }, function (progress) {
                 // constant progress updates
             });


        }, function(error) {
          // error getting photos
           toaster.pop('danger', "Error", "while Uploading Error");

        });


    }//end uploadPhotoOrVideo

    $scope.capturePhoto = function(){
        var options = {
          quality: 75, //0-100
          destinationType: Camera.DestinationType.FILE_URI, //DATA_URL (returns base 64) or FILE_URI (returns image path)
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false, //allow cropping
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 400,
          targetHeight: 400,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: true
        };

         $cordovaCamera.getPicture(options).then(function(imageData) {
           // Success! Image data is here
           $ionicLoading.show();
           $scope.filepath = imageData;
           //$scope.user.ProfilePic = $scope.filepath;

           var targetPath = $scope.filepath;
           var filename = targetPath.split("/").pop();
           filename = filename.replace(" ","_");
              var date = new Date().getTime();
              var imgName = $scope.uid+"_"+date+".jpg";
              var options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  mimeType: "image/jpg"
              };

              $cordovaFileTransfer.upload(API_URL+"uploadPhotos", $scope.filepath, options).then(function(result) {
                  console.log("SUCCESS: " + JSON.stringify(result.response));
                  console.log('Result_' + result.response[0] + '_ending');
                  //alert("success");
                  //alert(JSON.stringify(result.response));
                  $http.post(API_URL+"updateProfilePic",{uid:$scope.uid,ProfilePic:filename}).then(function(result){

                  });
                  //$state.go('app.my-profile/'+$scope.uid,{},{reload: true});
                  $ionicLoading.hide();
                  $state.go($state.current, {}, {reload: true});
              }, function(err) {
                  console.log("ERROR: " + JSON.stringify(err));
                  //alert(JSON.stringify(err));
              }, function (progress) {
                  // constant progress updates
              });

         }, function(err) {
          // alert("Error while Capture Photo");
           toaster.pop('danger', "Error", "while Capture Photo");

         });
    } // capturePhoto

});

myapp.controller("favoritesCtrl",function($scope, API_URL,toaster, $ionicLoading,$ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.uid = UserService.getUserId();
  $http.post(API_URL+"getFavorites",{"uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.favorites = result.data;
    }
    $ionicLoading.hide();
  });

  $scope.addToFavorite = function(item){
    //alert(uid);
    var index = $scope.favorites.indexOf(item);
    $http.post(API_URL+"addToFavorite",{"uid":UserService.getUserId(),"favorite_uid":item.favorite_uid}).then(function(result){
      if(result){
        $scope.favorites.splice(index, 1);
         toaster.pop('success', "Favorite", result.data.text);
      }
    });
  }

});

myapp.controller("myphotosCtrl",function($scope,API_URL,toaster, $ionicLoading,$ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state,$cordovaFileTransfer, $cordovaImagePicker,$stateParams){
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.uid = $stateParams.uid;
  $scope.loggeduid = UserService.getUserId();
  $scope.API_URL = API_URL+'uploads/';
  $scope.uploadbtn = true;
  $scope.images = [];

  $http.post(API_URL+"getTableData",{"table":"photos",'where':'uid','value':$scope.uid}).then(function(result){
    if(result && result.data){
      console.log(result.data);
      $scope.imagesold = result.data;
      $ionicLoading.hide();
    }
  });


  $scope.UploadPhotos = function() {
      $scope.uploadbtn = false;
    var options = {
      maximumImagesCount: 10,
      width: 800,
      height: 800,
      quality: 80
     };
     var filename = '';
    $cordovaImagePicker.getPictures(options).then(function (results) {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                //alert(results[i]);
                $scope.images.push(results[i]);
                var targetPath = results[i];
                filename = results[i].split("/").pop();
                var renamefilename = filename.replace(" ","_");

                   var options = {
                       fileKey: "file",
                       fileName: renamefilename,
                       chunkedMode: false,
                       mimeType: "image/jpg"
                   };
                  //alert(JSON.stringify(options));
                  $http.post(API_URL+"insertUploadPhoto",{"uid":UserService.getUserId(),'filename':renamefilename}).then(function(resulti){
                    //alert(JSON.stringify(resulti.data));
                  });
                $cordovaFileTransfer.upload(API_URL+"uploadPhotos", results[i], options).then(function(resultd) {

                });//end filetransor

            }
              $scope.uploadbtn = true;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        },
        function (error) {
          //  alert('Error: ' + error);
            toaster.pop('danger', "Error", error);
              $scope.uploadbtn = true;
        });

  };

  $scope.delete_photo = function(item,arrays){
    //alert(item);
    var index = arrays.indexOf(item);
    arrays.splice(index, 1);
    $http.post(API_URL+"deletePhoto",{'filename':item}).then(function(resulti){
      //alert(JSON.stringify(resulti.data));
      if(resulti.data.deleted=="success"){
        toaster.pop('success', "Deleted", "Your photo deleted successfully");
      }else{
        toaster.pop('danger', "Failed", "your photo deleted failed");
      }
    });
  }

});


myapp.controller("whoviewedmeCtrl",function($scope, API_URL,toaster,$ionicLoading, $ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.uid = UserService.getUserId();
  $http.post(API_URL+"getWhoViewedMe",{"viewed_uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.whoviewedlist = result.data;

    }
      $ionicLoading.hide();
  });

});

myapp.controller("likesCtrl",function($scope, API_URL,toaster, $ionicLoading,$ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  UserService.checkUserLogin();
  $ionicLoading.show();
  $scope.uid = UserService.getUserId();
  $http.post(API_URL+"getLikesYou",{"uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.likesList = result.data;
    }
    $ionicLoading.hide();
  });

  $http.post(API_URL+"getYouLikedList",{"uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.YouLikedList = result.data;
    }
  });
});


myapp.controller("messagesCtrl",function($scope, API_URL,toaster, $ionicModal,$ionicLoading, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  UserService.checkUserLogin();
  console.log(UserService.getUserId());
  $scope.uid = UserService.getUserId();
  $ionicLoading.show();
  $http.post(API_URL+"getUnSeenChatMsgs",{"uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.UnSeenChatMsg = result.data;
      $ionicLoading.hide();
    }else{
      $scope.messages_text = "No Messages";
      $ionicLoading.hide();
    }
  });

});


myapp.controller("myprofile_editCtrl",function($scope, API_URL,toaster, $ionicModal,$ionicLoading, $timeout,UserService,$http,$localStorage,$rootScope,$state){

  UserService.checkUserLogin();
  $ionicLoading.show();
  $http.post(API_URL+"getTableData",{"table":"user_height"}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.height_list = result.data;
    }
  });
  $http.post(API_URL+"getTableData",{"table":"user_body_type"}).then(function(result){
    if(result && result.data){
      $scope.user_body_type = result.data;
    }
  });
  $http.post(API_URL+"getTableData",{"table":"user_intrest_types"}).then(function(result){
    if(result && result.data){
      $scope.user_intrest_type = result.data;
    }
  });
  $http.post(API_URL+"getTableData",{"table":"religion"}).then(function(result){
    if(result && result.data){
      $scope.religions = result.data;
    }
  });
  $http.post(API_URL+"getTableData",{"table":"habits_types"}).then(function(result){
    if(result && result.data){
      $scope.habits = result.data;
    }
  });

   $http.post(API_URL+"getTableData",{"table":"user_income"}).then(function(result){
    if(result && result.data){
      $scope.income = result.data;
    }
  });


  $http.post(API_URL+"geUserTotalData",{"uid":UserService.getUserId()}).then(function(result){
    console.log(result);
    if(result && result.data){
      $scope.user = result.data;
      console.log(result.data);
    }
    $ionicLoading.hide();
  });

  $scope.tracklocation = function(loc,user){
    console.log(loc);


    console.log(loc);
    var loccc = JSON.stringify(loc);
    console.log(loccc);

    var alllocationdata = loc.adr_address;
    console.log(alllocationdata);
    $("#search_res").append(alllocationdata);
    user.locality = ($('.extended-address').text())?$('.extended-address').text():'';
    user.city = $('.locality').text();
    user.state = $('.region').text();
    user.country = $('.country-name').text();

    var latlng = JSON.stringify(loc.geometry.location);
    console.log(latlng);
    var ll = JSON.parse(latlng);
    console.log(ll.lat);
    console.log(ll.lng);

    user.lat = ll.lat;
    user.lng = ll.lng;

    console.log(user);

  }

  $scope.updateProfileInfo = function(user){
      user.user_id = UserService.getUserId();
      $http.post(API_URL+"updateProfileData",user).then(function(result){
        console.log(result);
        if(result){
          $state.go('app.home',{},{reload:true});
        }
      });
  }
});
myapp.controller("registerCtrl",function($scope, API_URL,toaster, $ionicModal,$ionicPopup, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  $scope.checkusername = function(username){
    console.log(username);
    $http.post(API_URL+"checkUsername",{'username':username}).then(function(result){
      console.log(result);
      $scope.username_available = result.data.username;
    });
  }

  if($scope.accept_terms){
    alert(1);
  }

  $scope.read_terms_conditions_btn = false;

  var privacyData = '';
   $http.post(API_URL+"getTableData",{'table':'pages','where':'id','value':'1'}).then(function(result){
     
      privacyData = result.data[0].content;
      //console.log(privacyData);
    });

  
  $scope.termsConditions_popup = function(){
    var popup = $ionicPopup.show({
    template: privacyData,
    title: 'Terms and Conditions',
    scope: $scope,
    buttons: [
      
      {
        text: '<b>Close</b>',
        type: 'button-positive',
        onTap: function(e) {
          $scope.read_terms_conditions_btn = true;
        }
      }
    ]
  });

  }

$scope.tracklocation = function(loc,user){
 console.log(loc);
    var loccc = JSON.stringify(loc);
    console.log(loccc);

    var alllocationdata = loc.adr_address;
    console.log(alllocationdata);
    $("#search_res").append(alllocationdata);
    user.locality = ($('.extended-address').text())?$('.extended-address').text():'';
    user.city = $('.locality').text();
    user.state = $('.region').text();
    user.country = $('.country-name').text();

    var latlng = JSON.stringify(loc.geometry.location);
    console.log(latlng);
    var ll = JSON.parse(latlng);
    console.log(ll.lat);
    console.log(ll.lng);

    user.lat = ll.lat;
    user.lng = ll.lng;

    console.log(user);

}

  $scope.doRegister = function(user){
    console.log(user);
    if($scope.username_available==false){
    if(user.password == user.repassword){
    $http.post(API_URL+"register",user).then(function(result){

      console.log(result);
        if(result && result.data){
          UserService.setUser({
            uid:result.data.uid,
            name:result.data.first_name+' '+result.data.last_name,
            mobile:result.data.mobile,
            email:result.data.email
          });

            $state.go('app.home',{},{reload: true});
        }
    });
  }else{
    toaster.pop('danger', "Error", "Passwords not Matched");
  }
  }else{
    //alert("please fill all fields");
    toaster.pop('danger', "Error", "Please fill all fields");
  }
  }


});

myapp.controller("searchCtrl",function($scope, API_URL,toaster, $ionicLoading,$ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  $scope.ages = [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64];


    $http.post(API_URL+"getTableData",{"table":"user_intrest_types"}).then(function(result){
    if(result && result.data){
      $scope.user_intrest_type = result.data;
    }
  });


     

    $scope.userlogin = true;
    $scope.uid = UserService.getUserId();
    //---


          $scope.noMoreItemsAvailable = false;
          $scope.peoples_per_request = 1;
          $scope.rfrom = 0;
          $scope.rto =  $scope.peoples_per_request;


    $scope.search_filter = function(filter){
      console.log(filter);
        
        filter.uid = UserService.getUserId();
         $scope.peoples = [];

          
       
       
        $scope.filter = filter;

          $scope.rfrom = 0;
          $scope.rto =  $scope.peoples_per_request;
         
           $scope.loadMore();

      } //end search filter
      


       $scope.loadMore = function() {
        console.log("called load more..");
            //$scope.items.push({ id: $scope.items.length});
            var postData = {"uid":UserService.getUserId(),"rfrom":$scope.rfrom,"rto":$scope.rto};
            

              postData = extend(postData,$scope.filter);
              console.log(postData);
               $http.post(API_URL+"searchFilterUsers",postData).then(function(resultwo){
                console.log(resultwo.data.length);
                if(resultwo.data.length!=0){
                   $scope.peoples.push(resultwo.data[0]);
                    $scope.noMoreItemsAvailable = false;

                    $scope.rfrom +=$scope.peoples_per_request;
                    console.log($scope.rfrom);
                    $scope.rto +=$scope.peoples_per_request;
              
                }else{
                  $scope.noMoreItemsAvailable = true;
                }
              });

               //console.log($scope.peoples);
         
          
          
              

            
            $scope.$broadcast('scroll.infiniteScrollComplete');
          };

          //Load more end

          $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();
          });

      function extend(obj, src) {
          for (var key in src) {
              if (src.hasOwnProperty(key)) obj[key] = src[key];
          }
          return obj;
      }
   

 


   
   //---



 


  $scope.search = function(UserSearchWord){
    //alert(UserSearchWord);
    $http.post(API_URL+"searchFilterUsers",{'uid':UserService.getUserId(),'search_word':UserSearchWord}).then(function(result){
      console.log(result);
      if(result && result.data){
        $scope.peoples = result.data;
      }
    });
  }
  $scope.tracklocation = function(loc,user){
    console.log(loc);
    var loccc = JSON.stringify(loc);
    console.log(loccc);

    var alllocationdata = loc.adr_address;
    console.log(alllocationdata);
    $("#search_res").append(alllocationdata);
    user.locality = ($('.extended-address').text())?$('.extended-address').text():'';
    user.city = $('.locality').text();
    user.state = $('.region').text();
    user.country = $('.country-name').text();

    var latlng = JSON.stringify(loc.geometry.location);
    console.log(latlng);
    var ll = JSON.parse(latlng);
    console.log(ll.lat);
    console.log(ll.lng);

    user.lat = ll.lat;
    user.lng = ll.lng;

    //console.log(user);
  }
});


myapp.controller("settingsCtrl",function($scope, API_URL,toaster, $ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  $scope.logout = function(){

    UserService.removeUser();
    $rootScope.login = false;
    $scope.userlogin = false;
    $state.go('app.login',{},{reload: true});
  }


  $scope.changepassword = function(p){
    if(p.new_password == p.new_password_again){
      p.uid = UserService.getUserId();
      $http.post(API_URL+"getTableData",{'table':'users','where':'uid','value':p.uid}).then(function(result){
        if(result && result.data){
          //console.log(result);
          if(result.data[0].password == p.current_password){
            $http.post(API_URL+"change_password",p).then(function(result){
                if(result && result.data){
                  if(result.data.status=="success"){
                    toaster.pop('success', "Changed", result.data.msg);
                    $state.go('app.home',{},{reload: true});
                  }
                }
            });//end change password
          }else{
            toaster.pop('danger', "Wrong", "Current Password Not Matched");
          }
        }
      });

    }else{
      toaster.pop('danger', "Error", "New Password again Worng");
    }

  }
});

myapp.controller('forgotpassword',function($scope, API_URL,toaster, $ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
  $scope.forgot_password = function(p){
    $http.post(API_URL+"forgotPassword",{'email':p.email}).then(function(result){
      console.log(result);
      if(result && result.data){
        if(result.data.status=="success"){
          toaster.pop('success', "Success", result.data.msg);
        }else{
          toaster.pop('danger', "Error", result.data.msg);
        }
      }
    });
  }
});

myapp.controller('testCtrl',function($scope, API_URL,toaster, $ionicModal, $timeout,$http,UserService,$localStorage,$rootScope,$state){
    $scope.noMoreItemsAvailable = false;
    $scope.peoples_per_request = 4;
    $scope.rfrom = 0;
    $scope.rto =  $scope.peoples_per_request;
    $scope.loadMore = function() {
      //$scope.items.push({ id: $scope.items.length});
      var postData = {"uid":UserService.getUserId(),"rfrom":$scope.rfrom,"rto":$scope.rto};
       $http.post(API_URL+"getPeoples",postData).then(function(result){
          console.log(result.data);
          if(result.data.length!=0){
            $scope.items.push(result.data);
          }else{
            $scope.noMoreItemsAvailable = true;
          }
        });
       //console.log(postData);

        $scope.rfrom +=$scope.peoples_per_request;
        $scope.rto +=$scope.peoples_per_request;

      
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    
    $scope.items = [];
});

myapp.controller('privatechat', function($scope, API_URL,toaster,UserService,$rootScope,$state,$ionicModal,$ionicScrollDelegate,$timeout,Socket,$stateParams,$http,$localStorage) {
  $scope.messages=[];
  $scope.other_chat_uid = $stateParams.ouid;
  $scope.uid = UserService.getUserId();
  $scope.ProfilePic = "male.png";

  $scope.status_message = "";

  $scope.getTime = function(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  $scope.getDate = function(){
    var today  = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    mm= mm+1;
    var yyyy = today.getFullYear();
    if(dd<10) { dd='0'+dd }
    if(mm<10) { mm='0'+mm }
    var date= yyyy+'-'+mm+'-'+dd;
    return date;
  }

  //Get chatID
  //alert($stateParams.ouid);
  var getChatID = {
    uid:$scope.uid,
    other_chat_uid:$scope.other_chat_uid
  }
  console.log(getChatID);
  $http.post(API_URL+"gpChatId",getChatID).then(function(result){
    //$scope.contactsList = result.data;
    console.log(result);
    //Get and Store Chat Messages
    $scope.messages = result.data.ChatHistory;
    if($scope.messages==null){$scope.messages=[]}
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    angular.forEach($scope.messages,function(index,value){
      console.log(index);
        if(index['seen']==0 && index['to_uid']==$scope.uid){

          var updateChatRow = {
            id:index['id']
          }
          console.log(updateChatRow);
          $http.post(API_URL+"ChatMsgSeen",updateChatRow).then(function(res){
            console.log(res);
          });
        }
    });
    $scope.ChatOtherUser=result.data.ChatOtherUser;

      $scope.chatID = result.data.chatID
      //console.log(result.data.chatID);
      $scope.sendMessage = function(){
        if($scope.message==''){
          return;
        }

          var newMessage = {
            from_uid:$scope.uid,
            ouid:$scope.other_chat_uid,
            name:UserService.getUserName(),
            mobile:UserService.getUserMobile(),
            message:$scope.message,
            chatID:$scope.chatID,
            time:$scope.getTime(),
            date:$scope.getDate()
          }
          console.log(newMessage);
          Socket.emit("Private Message",newMessage);
          $http.post(API_URL+"insertChatMsg",newMessage).then(function(result){
            console.log(result);
          });
          $scope.message = '';
          Socket.emit("stop typing",{
            from_uid:$scope.uid,
            ouid:$scope.other_chat_uid,
            name:UserService.getUserName(),
            chatID:$scope.chatID
          });
      }

      Socket.on($scope.chatID,function(data){
        console.log("Return Chat Data");
        console.log(data);
        $scope.messages.push(data);
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
      })

      var typing = false;
      var TYPING_TIMER_LENGTH = 2000;

      $scope.updateTyping = function() {
        if(!typing){
          typing = true;
          Socket.emit("typing",{
            from_uid:$scope.uid,
            ouid:$scope.other_chat_uid,
            name:UserService.getUserName(),
            chatID:$scope.chatID
          });
        }

        lastTypingTime = (new Date()).getTime();
        $timeout(function(){
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if(timeDiff >= TYPING_TIMER_LENGTH && typing){
              Socket.emit("stop typing",{
                from_uid:$scope.uid,
                ouid:$scope.other_chat_uid,
                name:UserService.getUserName(),
                chatID:$scope.chatID
              });
              typing = false;
            }
        },TYPING_TIMER_LENGTH);

      }//End TypingUpdate



      Socket.on($scope.chatID+'-typing',function(data){
        $scope.status_message = data.name+ " is typing...";
      });

      Socket.on($scope.chatID+'-stop typing',function(data){
        $scope.status_message = "";
      });


      $scope.claerchathistory = function(){
        $http.post(API_URL+"DeleteChatHistory",{chat_id:$scope.chatID}).then(function(result){
          console.log(result);
          if(result.data.status=='success'){
            $scope.messages=[];

             toaster.pop('success', "Success", "Chat History Deleted");
          }
        });

      }


  }); //End GEtChatID



  //Check User Online
  function CheckUserOnline(){
    if($localStorage.userData){
      $http.post(API_URL+"CheckUserOnline",{uid:$scope.other_chat_uid}).then(function(result){
        if(result.data.online==1){
             $('.useronline').show();
        }else{
          $('.useronline').hide();
        }//End
        console.log("Checking User Online");
        console.log(result);
      });
    }
  }
  CheckUserOnline();

  setTimeout(function () {
      CheckUserOnline();

  }, 10000);
});
