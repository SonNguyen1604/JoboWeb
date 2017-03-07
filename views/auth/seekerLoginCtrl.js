angular
.module('app')
.controller('seekerLoginCtrl', seekerLoginCtrl);

function seekerLoginCtrl($rootScope, $state, $window, $timeout, firebase) {
    $rootScope.doLogin = function (userLogin) {
        console.log(userLogin);

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
        }, function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            debugger
            if (errorCode === 'auth/invalid-email') {
                $rootScope.password = '';
                $timeout($rootScope.accout = errorMessage, 500);
                return false;
            }
            else if (errorCode === 'auth/wrong-password') {
                $rootScope.password = '';
                //$window.alert('Kiểm tra lại mật khẩu.');
                $timeout($rootScope.password = errorMessage, 500);
                return false
            } else if (errorCode === 'auth/argument-error') {
                $rootScope.accout = '';
                //$window.alert('Password must be string.');
                $timeout($rootScope.password = errorMessage, 500);
                return false;
            } else if (errorCode === 'auth/user-not-found') {
                $rootScope.password = '';
                //$window.alert('Email này không tồn tại.');
                $timeout($rootScope.accout = errorMessage, 500);
                return false;
            } else if (errorCode === 'auth/too-many-requests') {
                $rootScope.accout = '';
                //$window.alert('Too many failed login attempts, please try after sometime.');
                $timeout($rootScope.password = errorMessage, 500);
                return false;
            } else if (errorCode === 'auth/network-request-failed') {
                $rootScope.accout = '';
                //$window.alert('Request timed out, please try again.');
                $timeout($rootScope.password = errorMessage, 500);
                return false;
            } else {
                $window.alert(errorMessage);
                return false;
            }
        });
    };
}