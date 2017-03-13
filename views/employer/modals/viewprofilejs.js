"use strict"

angular.module('app')

.controller('ViewProfileCtrl', ViewProfileCtrl)

function ViewProfileCtrl($scope, $timeout, $stateParams, $http, CONFIG) {
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var ageDifMs = new Date().getFullYear() - birthday
        return ageDifMs
    };

    $scope.profileId = $stateParams.id;

    $scope.userData = {}
    var ProfileRef = firebase.database().ref('user/' + $scope.profileId)
    ProfileRef.on('value', function (snap) {
        $scope.userData = snap.val();
        $timeout(console.log($scope.userData), 500)
    })

}
