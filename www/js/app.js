// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myapp = angular.module('myapp', ['ionic','ngCordova','toaster','ngAnimate','ngStorage','google.places','btford.socket-io'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

myapp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    cache: false,
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })
  .state('app.register', {
    cache: false,
      url: '/register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller:'registerCtrl'
        }
      }
    })
    .state('app.home', {
      cache: false,
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller:'homeCtrl'
        }
      }
    })
    .state('app.my-profile', {
      cache: false,
      url: '/my-profile/:uid',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-profile.html',
          controller:'myprofileCtrl'
        }
      }
    })

    .state('app.profile', {
      cache: false,
      url: '/profile/:name',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-profile.html',
          controller:'ProfileCtrl'
        }
      }
    })
    .state('app.my-photos', {
      cache: false,
      url: '/my-photos/:uid',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-photos.html',
          controller:'myphotosCtrl'
        }
      }
    })
    .state('app.myprofile_edit', {
      cache: false,
      url: '/myprofile_edit',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-profile-edit.html',
          controller:'myprofile_editCtrl'
        }
      }
    })
     .state('app.templates', {
      cache: false,
      url: '/test',
      views: {
        'menuContent': {
          templateUrl: 'templates/test.html',
          controller:'testCtrl'
        }
      }
    })



  .state('app.search', {
    cache: false,
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller:'searchCtrl'
      }
    }
  })
  .state('app.who-viewed-me', {
    cache: false,
    url: '/who-viewed-me',
    views: {
      'menuContent': {
        templateUrl: 'templates/who-viewed-me.html',
        controller:'whoviewedmeCtrl'
      }
    }
  })


    .state('app.messages', {
      cache: false,
      url: '/messages',
      views: {
        'menuContent': {
          templateUrl: 'templates/messages.html',
          controller:'messagesCtrl'
        }
      }
    })
    .state('app.your-activity', {
      cache: false,
      url: '/your-activity',
      views: {
        'menuContent': {
          templateUrl: 'templates/your-activity.html'
        }
      }
    })

    .state('app.settings', {
      cache: false,
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller:'settingsCtrl'
        }
      }
    })
    .state('app.change-password', {
      cache: false,
      url: '/change-password',
      views: {
        'menuContent': {
          templateUrl: 'templates/change-password.html',
          controller:'settingsCtrl'
        }
      }
    })
    .state('app.favorites', {
      cache: false,
      url: '/favorites',
      views: {
        'menuContent': {
          templateUrl: 'templates/favorites.html',
          controller:'favoritesCtrl'
        }
      }
    })
    .state('app.likes', {
      cache: false,
      url: '/likes',
      views: {
        'menuContent': {
          templateUrl: 'templates/likes.html',
          controller:'likesCtrl'
        }
      }
    })
    .state('app.privatechat', {
    cache: false,
    url: '/privatechat/:ouid',
    views: {
      'menuContent': {
        templateUrl: 'templates/privatechat.html',
        controller:'privatechat'
      }
    }
  })
  .state('app.forgot-password',{
    cache:false,
    url:'/forgot-password',
    views:{
      'menuContent':{
        templateUrl:'templates/forgot-password.html',
        controller:'forgotpassword'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
