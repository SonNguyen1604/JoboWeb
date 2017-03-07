angular
    .module('app')
.controller('seekerSignupCtrl', seekerSignupCtrl)

function seekerSignupCtrl($rootScope, $scope, $window, $timeout, $state, $stateParams, firebase) {

    $scope.doSignup = function (userSignup) {
        debugger
        $rootScope.registering = true;

        firebase.auth().createUserWithEmailAndPassword(userSignup.email, userSignup.password).then(function (user) {
            $rootScope.userid = user.uid;
            $rootScope.usersRef = firebase.database().ref('user/' + user.uid);
            $scope.usersRef.update({
                type: 2,
                name: userSignup.name,
                userid: user.uid,
                email: userSignup.email,
                photourl: "img/macdinh.jpg",
                createdAt: new Date().getTime()
            });

            console.log("Update user successfully");
            $state.go('appSimple.signupphone')
        }, function (error) {
            var errorCode = error.code;
            console.log(errorCode);

            if (errorCode === 'auth/weak-password') {
                $window.alert('Mật khẩu không an toàn, hãy chọn mật khẩu khác!');
                return false;
            } else if (errorCode === 'auth/email-already-in-use') {
                //$scope.previous();
                $window.alert('Email này đã được sử dụng rồi');

                return false;
            }
        })
    };

    $scope.doUpdate = function (userSignup) {
        debugger
        console.log($rootScope.userid);
        $scope.usersRef = firebase.database().ref('user/' + $rootScope.userid);
        console.log($scope.usersRef);

        $scope.usersRef.update({
            phone: userSignup.phone,
        });
        console.log("phone ok");
    };

}
