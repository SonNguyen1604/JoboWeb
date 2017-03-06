angular
.module('app')
.controller('seekerLoginCtrl', seekerLoginCtrl);

function seekerLoginCtrl($rootScope, $state, firebase) {
    $rootScope.doLogin = function (userLogin) {

        firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function () {
            $rootScope.userid = firebase.auth().currentUser.uid;

            firebase.database().ref('user/' + $rootScope.userid + '/type').once('value', function (snap) {
                console.log(snap.val());
                console.log($rootScope.uid);
                if (snap.val() == 1) {
                    $state.go('app.seekerdash')
                }
                if (snap.val() == 2) {
                    $state.go('app.seekerdash')
                }
            })
        })
    }
}