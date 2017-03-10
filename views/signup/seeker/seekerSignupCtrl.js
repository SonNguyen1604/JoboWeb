angular
    .module('app')
.controller('seekerSignupCtrl', seekerSignupCtrl)
.filter('propsFilter', propsFilter)

function seekerSignupCtrl($rootScope, $scope, $window, $timeout, $state, $stateParams, $http, firebase, CONFIG) {

    
    $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue', 'Red'];

    $scope.userData = {
        "createdAt": 1488285452104,
        "email": "test2@joboapp.com",
        "name": "Hoàng Quốc",
        "phone": "0987654345",
        "photourl": "img/macdinh.jpg",
        "type": 2,
        "userid": "2Ex94dTG7ffOJTIuadP5Ko4XBtd2",
        //"address": "48 Hai Bà Trưng, Tràng Tiền, Hoàn Kiếm, Hà Nội, Vietnam",
        "birth": 1996,
        "figure": true,
        "job": {
            "baotri": true
        },
        "distance": 5,
        "location": {
            "lat": 21.0250862,
            "lng": 105.8502656
        },
        "sex": "Nữ",
    }


    //scholl
    $scope.autocompleteSchool = { text: '' };
    $scope.searchSchool = function () {

        $scope.URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + $scope.autocompleteSchool.text + '&language=vi&type=university&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
        $http({
            method: 'GET',
            url: $scope.URL
        }).then(function successCallback(response) {

            $scope.ketquasSchool = response.data.results;
            console.log($scope.ketquasSchool);
        })
    };

    //address
    $scope.autocompleteAddress = { text: '' };
    $scope.ketquasAddress = [];
    $scope.searchAddress = function () {
        $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
        $http({
            method: 'GET',
            url: $scope.URL
        }).then(function successCallback(response) {
            $scope.ketquasAddress = response.data.results;
            console.log($scope.ketquasAddress);
            $('#list-add').show();
            //$("#address").autocomplete({
            //    source: $scope.ketquaArray,
            //    select: function () {
            //        $timeout(function () {
            //            $("#address").trigger('input');
            //        }, 0);
            //    }
            //});
        })
    };

    $scope.setSelectedAddress = function (selected) {
        $scope.autocompleteAddress.text = selected;
        $scope.address = selected;
        console.log(selected);
        $('#list-add').hide();
        //$scope.userData.address = selected.formatted_address;
        //$scope.userData.location = selected.geometry.location;

    };

    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    }

    var a = 1;
    $scope.userData.experience = {}
    $scope.userData.experience[a] = {}
    $scope.addMoreExp = function (exp) {
        var stt;
        for (var i in exp) {
            stt = i
        }
        var n = stt + 1
        exp[n] = {}
    }

    $scope.deleteExp = function (exp) {
        var stt;
        for (var i in exp) {
            stt = i
        }
        delete exp[stt]
    }

    $scope.doSignup = function (userSignup) {
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
            $state.go('appSimple.seekersignupinfo')
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

function propsFilter() {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
}

function DefaultCtrl($scope) {
    $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];
}