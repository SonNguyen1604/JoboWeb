"use strict"

angular.module('app')

.controller('seekerdashboardCtrl', dashboardCtrl)

function dashboardCtrl($scope, $timeout) {
    $scope.Userdata = {}
    var ProfileRef = firebase.database().ref('user/')

    ProfileRef.on('value', function (snap) {
        $scope.Userdata = snap.val();

        $timeout(console.log($scope.Userdata))
    })
}
