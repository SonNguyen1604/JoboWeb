//Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#79c447';
var brandInfo = '#67c2ef';
var brandWarning = '#fabb3d';
var brandDanger = '#ff5454';

var grayDark = '#384042';
var gray = '#9faecb';
var grayLight = '#c0cadd';
var grayLighter = '#e1e6ef';
var grayLightest = '#f9f9fa';

var app = angular
    .module('app', [
        'ui.router',
        'oc.lazyLoad',
        'pascalprecht.translate',
        'ncy-angular-breadcrumb',
        'angular-loading-bar',
        'ngSanitize',
        'ngAnimate',
        'firebase',
        'starter.configs',
        'starter.services',
        'ngFileUpload'
    ])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;
    }])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess', function () {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $rootScope.$state = $state;
        return $rootScope.$stateParams = $stateParams;
    }])
    .run(function ($rootScope, CONFIG) {

        $rootScope.CONFIG = CONFIG;
        $rootScope.dataJob = CONFIG.data.job;
        $rootScope.dataTime = CONFIG.data.time;
        $rootScope.dataIndustry = CONFIG.data.industry;
        $rootScope.dataLanguages = CONFIG.data.languages;
    });
