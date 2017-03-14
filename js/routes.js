/// <reference path="../bower_components/ng-file-upload/ng-file-upload-shim.min.js" />
/// <reference path="../bower_components/ng-file-upload/ng-file-upload-shim.min.js" />
angular
  .module('app')
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

      $urlRouterProvider.otherwise('/intro');

      $ocLazyLoadProvider.config({
          // Set to true if you want to see what and when is dynamically loaded
          debug: true
      });

      $breadcrumbProvider.setOptions({
          prefixStateName: 'app.main',
          includeAbstract: true,
          template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
      });

      $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'views/common/layouts/full.html',
            //page title goes here
            ncyBreadcrumb: {
                label: 'Root',
                skip: true
            },
            resolve: {
                loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load CSS files
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'Font Awesome',
                        files: ['css/font-awesome.min.css']
                    }, {
                        serie: true,
                        name: 'Simple Line Icons',
                        files: ['css/simple-line-icons.css']
                    }]);
                }],
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'chart.js',
                        files: [
                          'bower_components/chart.js/dist/Chart.min.js',
                          'bower_components/angular-chart.js/dist/angular-chart.min.js'
                        ]
                    }]);
                }],
            }
        })
        .state('app.main', {
            url: '/dashboard',
            templateUrl: 'views/main.html',
            //page title goes here
            ncyBreadcrumb: {
                label: 'Home',
            },
            //page subtitle goes here
            params: { subtitle: 'Welcome to Clever Bootstrap 4 Admin Template' },
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load([
                      {
                          serie: true,
                          name: 'chart.js',
                          files: [
                            'bower_components/chart.js/dist/Chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.min.js'
                          ]
                      },
                      {
                          serie: true,
                          files: ['bower_components/moment/min/moment.min.js']
                      },
                      {
                          serie: true,
                          files: ['bower_components/gauge.js/dist/gauge.min.js']
                      },
                      {
                          serie: true,
                          files: ['bower_components/angular-gaugejs/src/angular-gauge.js']
                      },
                      {
                          serie: true,
                          files: [
                            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                            'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'
                          ]
                      },
                      {
                          files: ['bower_components/angular-toastr/dist/angular-toastr.tpls.min.js']
                      }
                    ]);
                }],
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load controllers
                    return $ocLazyLoad.load({
                        files: ['js/controllers/main.js']
                    });
                }]
            }
        })
        .state('appSimple', {
            abstract: true,
            templateUrl: 'views/common/layouts/simple.html',
            resolve: {
                loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load CSS files
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'Font Awesome',
                        files: ['css/font-awesome.min.css']
                    }, {
                        serie: true,
                        name: 'Simple Line Icons',
                        files: ['css/simple-line-icons.css']
                    }]);
                }],
            }
        })
        .state('signup', {
            url: '/signup/:id',
            templateUrl: 'templates/signup.html',
            controller: 'signupCtrl'
        })

        .state('reset', {
            url: '/reset',
            templateUrl: "templates/resetemail.html",
            controller: "resetController"
        })


        .state('intro', {
            url: '/intro',
            templateUrl: "templates/intro.html",
            controller: "introController"
        })

        .state('profile', {
            url: '/profile',
            templateUrl: 'jobseeker/sprofile.html',
            controller: 'sprofileCtrl',
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      {
                          serie: true,
                          files: ['bower_components/moment/min/moment.min.js']
                      },
                      {
                          serie: true,
                          files: [
                            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                            'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'
                          ]
                      },
                      {
                          files: ['bower_components/angular-ui-mask/dist/mask.min.js']
                      },
                      {
                          files: ['bower_components/angular-ui-select/dist/select.min.js']
                      },
                      {
                          files: [
                            'bower_components/ionrangeslider/js/ion.rangeSlider.min.js',
                            'bower_components/ionrangeslider.angular/slider.js'
                          ]
                      },
                    ]);
                }],
                loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load CSS files
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'Font Awesome',
                        files: ['css/font-awesome.min.css']
                    }, {
                        serie: true,
                        name: 'Simple Line Icons',
                        files: ['css/simple-line-icons.css']
                    }]);
                }],
            }

        })

        //job seeker dash
        .state('app.seekerdash', {
            url: '/seekerdash',
            templateUrl: 'views/dash/seekerDashboard.html',
            controller: 'seekerdashboardCtrl',
        })

        // seeker login
        .state('appSimple.login', {
            url: '/login',
            templateUrl: 'views/auth/seekerLogin.html',
            controller: 'seekerLoginCtrl'
        })
        .state('appSimple.signup', {
            url: '/seekersignup',
            templateUrl: 'views/signup/seeker/seekerSignup.html',
            controller: 'seekerSignupCtrl'
        })
        .state('appSimple.signupinfo', {
            url: '/seekersignupinfo',
            templateUrl: 'views/signup/seeker/seekersignupinfo.html',
            controller: 'seekerSignupCtrl',
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                      {
                          serie: true,
                          files: ['bower_components/moment/min/moment.min.js']
                      },
                      {
                          serie: true,
                          files: [
                            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                            'bower_components/angular-daterangepicker/js/angular-daterangepicker.min.js'
                          ]
                      },
                      {
                          files: ['bower_components/angular-ui-mask/dist/mask.min.js']
                      },
                      {
                          files: ['bower_components/angular-ui-select/dist/select.min.js']
                      },
                      {
                          files: [
                            'bower_components/ionrangeslider/js/ion.rangeSlider.min.js',
                            'bower_components/ionrangeslider.angular/slider.js'
                          ]
                      },
                    ]);
                }],
                //loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                //    return $ocLazyLoad.load({
                //        files: ['views/signup/seeker/seekerSignupCtrl.js']
                //    });
                //}]
            }
        })

        .state('appSimple.jobfast', {
            url: '/jobfast',
            templateUrl: 'views/joblist/joblist.html',
            controller: 'joblistCtrl',
        })

        .state('appSimple.viewprofile', {
            url: '/viewprofile/:id',
            templateUrl: 'views/employer/modals/viewprofile.html',
            controller: 'ViewProfileCtrl'
        })


        .state('appSimple.404', {
            url: '/404',
            templateUrl: 'views/pages/404.html'
        })
        .state('appSimple.500', {
            url: '/500',
            templateUrl: 'views/pages/500.html'
        })

  }]);
