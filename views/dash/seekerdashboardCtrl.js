"use strict"

angular.module('app')

.controller('seekerdashboardCtrl', dashboardCtrl)

function dashboardCtrl($scope, $timeout) {

    $scope.openModal = function ($event) {
        $event.preventDefault();
        var inst = $('[data-remodal-id=modal]').remodal();
        inst.open();
    }


    $scope.Userdata = {}
    var ProfileRef = firebase.database().ref('user/')

    ProfileRef.on('value', function (snap) {
        $scope.Userdata = snap.val();

        $timeout(console.log($scope.Userdata))
    })
}
