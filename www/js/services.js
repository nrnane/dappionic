myapp.service('UserService', function($state) {
  var setUser = function(user_data) {
    window.localStorage.user_data = JSON.stringify(user_data);
   };

   var getUser = function(){
     return JSON.parse(window.localStorage.user_data || '{}');
   };
   var getUserId = function(){
     var user = JSON.parse(window.localStorage.user_data || '{}');
     if(user!=null){
        return user.uid;
     }

   };
   var getUserName = function(){
     var user = JSON.parse(window.localStorage.user_data || '{}');
     return user.name;
   };
   var getUserMobile = function(){
     var user = JSON.parse(window.localStorage.user_data || '{}');
     return user.mobile;
   };
   var removeUser = function(){
     window.localStorage.user_data=null;
   };
   var checkUserLogin = function(){
     console.log('user login checking');
     console.log(window.localStorage.user_data);
     if(window.localStorage.user_data==null || window.localStorage.user_data=='null' || window.localStorage.user_data=='undefined'){
           $state.go('app.login');
     }
   }

   var checkIfUserLoginTrue = function(){

     if(window.localStorage.user_data=='null' || window.localStorage.user_data=='undefined'){
           return false;
     }else{
       return true;
     }
   }
   return {
     setUser:setUser,
     getUser:getUser,
     removeUser:removeUser,
     checkUserLogin:checkUserLogin,
     checkIfUserLoginTrue:checkIfUserLoginTrue,
     getUserId:getUserId,
     getUserName:getUserName,
     getUserMobile:getUserMobile
   };

});
