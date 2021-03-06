"use strict";

app.controller('sprofileCtrl', sprofileCtrl).filter('propsFilter', propsFilter);

function sprofileCtrl($rootScope, $scope, AuthUser, $window, $timeout, $state, $stateParams, $http, firebase, CONFIG, Upload) {


    $scope.init = function () {
        AuthUser.user()
            .then(function (result) {
                    console.log(result)
                    var profileRef = firebase.database().ref('profile/' + $rootScope.userid);
                    profileRef.once('value', function (snap) {
                        $timeout(function () {
                            $rootScope.userData = snap.val();
                        }, 10)
                        console.log($rootScope.userData);
                        if (!$rootScope.userData) {
                            var userRef = firebase.database().ref('user/' + $rootScope.userid);
                            userRef.once('value', function (snap) {
                                var userInfo = snap.val();
                                console.log(userInfo);
                                if (userInfo) {
                                    $rootScope.userData = {
                                        name: userInfo.name,
                                        email: userInfo.email,
                                        phone: userInfo.phone,
                                        photourl: userInfo.photourl
                                    }
                                    $timeout(function () {
                                        $rootScope.userData = {
                                            name: userInfo.name,
                                            email: userInfo.email,
                                            phone: userInfo.phone,
                                            photourl: userInfo.photourl
                                        }
                                        console.log($rootScope.userData);
                                    }, 10)

                                }
                            })
                        }
                    })
                }, function (error) {
                    console.log(error)
                    // error
                }
            );
    }


    $scope.upimg = function () {
        if ($scope.file) {
            $scope.upload($scope.file);
        }
    };

    $scope.upload = function (imageData) {
        debugger
        console.log('imageData', imageData)
        var metadata = {
            'contentType': imageData.type
        };
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('images/' + $rootScope.userid + imageData[0].lastModified).put(imageData[0]);

        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {
            // Handle unsuccessful uploads
        }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
            $rootScope.userData.photourl = downloadURL;
            $scope.$apply(function () {
                $scope.photoUrl = downloadURL;

            })
        });
    };

    //Industry
    $scope.arrayIndustry = [];
    angular.forEach($rootScope.dataIndustry, function (e) {
        $scope.arrayIndustry.push(e);
    })
    $scope.availableIns = $scope.arrayIndustry;
    $scope.multipleIns = {};

    //Job
    $scope.arrayJob = [];
    angular.forEach($rootScope.dataJob, function (e) {
        $scope.arrayJob.push(e);
    })
    $scope.availableJob = $scope.arrayJob;
    $scope.multipleJob = {};

    //Language
    $scope.arrayLang = [];
    angular.forEach($rootScope.dataLanguages, function (e) {
        $scope.arrayLang.push(e);
    })
    $scope.availableColors = $scope.arrayLang;
    $scope.multipleDemo = {};

    //Time
    $scope.arrayTime = [];
    angular.forEach($rootScope.dataTime, function (e) {
        $scope.arrayTime.push(e);
    })
    $scope.timeData = $scope.arrayTime;
    $scope.timeDemo = {};

    //school
    $scope.autocompleteSchool = {text: ''};
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


    $scope.setSelectedSchool = function (selected) {
        $scope.school = selected;
        console.log($scope.school)
        $rootScope.userData.school = $scope.school.name

    };

    //address
    $scope.autocompleteAddress = {text: ''};
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
        //$rootScope.userData.address = selected.formatted_address;
        //$rootScope.userData.location = selected.geometry.location;

    };

    $scope.eraseAddress = function () {
        $scope.autocompleteAddress.text = null;
        $('#list-add').hide();
    }

    $scope.addMoreExp = function () {
        if (!$rootScope.userData.experience) {
            $rootScope.userData.experience = {};
        }
        var stt;
        for (var i in $rootScope.userData.experience) {
            stt = i
        }
        return new Promise(function (resolve) {
            resolve(stt)

        }).then(function (stt) {
                if (!stt) {
                    stt = 0
                }
                var n = Number(stt) + 1
                $timeout(function () {
                    $rootScope.userData.experience[n] = {id: n}

                }, 100)
            }
        )
    }
    $scope.deleteExp = function (exp) {
        var stt;
        for (var i in exp) {
            stt = i
        }
        $timeout(function () {
            delete $rootScope.userData.experience[stt]
        }, 100)
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

    $scope.submit = function () {

        console.log($rootScope.userData)
        var profileRef = firebase.database().ref('profile/' + $rootScope.userid)
        profileRef.update($rootScope.userData)
    }
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


/*
 "use strict";

 app.controller("sprofileCtrl", function ($scope,
 $rootScope,
 $ionicActionSheet,
 $ionicSlideBoxDelegate,
 $cordovaCamera,
 $ionicModal,
 $http,
 CONFIG,
 $cordovaCapture,
 $cordovaToast,
 $sce,
 $state,
 $timeout,
 $firebaseArray,
 $ionicLoading,
 $ionicPopup,
 AuthUser) {
 $scope.$back = function () {
 window.history.back();
 };
 $scope.init = function () {
 AuthUser.user()
 .then(function (result) {
 console.log(result)
 var profileRef = firebase.database().ref('profile/' + $rootScope.userid);
 profileRef.once('value', function (snap) {
 $rootScope.userData = snap.val();
 console.log($rootScope.userData);
 if (!$rootScope.userData) {
 var userRef = firebase.database().ref('user/' + $rootScope.userid);
 userRef.once('value', function (snap) {
 var userInfo = snap.val();
 console.log(userInfo)
 if (userInfo) {
 $rootScope.userData = {
 email: userInfo.email,
 phone: userInfo.phone,
 photourl: userInfo.photourl
 }
 console.log($rootScope.userData);

 }
 })
 }
 })
 }, function (error) {
 console.log(error)
 // error
 }
 );
 }


 $scope.selectJob = function (id) {
 $scope.newHospital.job = $rootScope.userData.experience[id].job;

 $ionicPopup.confirm({
 title: 'Chọn công việc',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/collect-job.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Xong ',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 for (var obj in $scope.newHospital.job) {
 $scope.keyjob = $scope.newHospital.job[obj];
 console.log('obj', $scope.keyjob);
 if ($scope.keyjob == false) {
 delete $scope.newHospital.job[obj];
 }
 }
 $rootScope.userData.experience[id].job = $scope.newHospital.job
 console.log($rootScope.userData.experience);
 $scope.newHospital = {}
 } else {
 console.log('You are not sure');
 }
 });
 };


 $scope.addMoreExp = function () {
 if (!$rootScope.userData.experience) {
 $rootScope.userData.experience = {};
 }
 var stt;
 for (var i in $rootScope.userData.experience) {
 stt = i
 }
 return new Promise(function (resolve) {
 resolve(stt)

 }).then(function (stt) {
 if (!stt) {
 stt = 0
 }
 var n = Number(stt) + 1
 $rootScope.userData.experience[n] = {id: n}
 $timeout(function () {
 console.log($rootScope.userData.experience)
 }, 10)
 })
 }

 $scope.deleteExp = function (card) {
 delete $rootScope.userData.experience[card];
 $state.reload()
 }

 // Search Address
 $scope.selectAddress = function () {
 $scope.newHospital = {};

 //find Address by Google
 $scope.autocompleteAddress = {text: ''};
 $scope.searchAddress = function () {

 $scope.URL = 'https://maps.google.com/maps/api/geocode/json?address=' + $scope.autocompleteAddress.text + '&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
 $http({
 method: 'GET',
 url: $scope.URL
 }).then(function successCallback(response) {

 $scope.ketquasAddress = response.data.results;
 console.log($scope.ketquasAddress);
 })
 };


 $scope.setSelectedAddress = function (selected) {
 $scope.address = selected;
 console.log($scope.address)
 $rootScope.userData.address = selected.formatted_address;
 $rootScope.userData.location = selected.geometry.location;

 };


 $ionicPopup.confirm({
 title: 'Địa chỉ',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/select-Address.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 console.log('You are sure');

 } else {
 console.log('You are not sure');
 }
 });

 };


 $scope.selectSchool = function () {
 $ionicPopup.confirm({
 title: 'Địa chỉ',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/select-School.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 console.log('You are sure');

 } else {
 console.log('You are not sure');
 }
 });
 //find school

 $scope.autocompleteSchool = {text: ''};
 $scope.searchSchool = function () {

 $scope.URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + $scope.autocompleteSchool.text + '&language=vi&type=university&components=country:VN&sensor=true&key=' + CONFIG.APIKey;
 $http({
 method: 'GET',
 url: $scope.URL
 }).then(function successCallback(response) {

 $scope.ketquasSchool = JSON.stringify(response).data.results
 console.log($scope.ketquasSchool);
 })
 };


 $scope.setSelectedSchool = function (selected) {
 $scope.school = selected;
 console.log($scope.school)
 $rootScope.userData.school = $scope.school.name

 };

 }
 $scope.newHospital = {}
 $scope.collectJob = function () {
 $ionicPopup.confirm({
 title: 'Công việc mong muốn',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/collect-job.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 for (var obj in $scope.newHospital.job) {
 $scope.keyjob = $scope.newHospital.job[obj];
 console.log('obj', $scope.keyjob);
 if ($scope.keyjob == false) {
 delete $scope.newHospital.job[obj];
 }
 }
 console.log('You are sure', $scope.newHospital);
 $rootScope.userData.job = $scope.newHospital.job

 } else {
 console.log('You are not sure');
 }
 })
 };

 $scope.collectTime = function () {
 $ionicPopup.confirm({
 title: 'Thời gian có thể đi làm',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/collect-time.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 for (var obj in $scope.newHospital.time) {
 $scope.keyjob = $scope.newHospital.time[obj];
 console.log('obj', $scope.keyjob);
 if ($scope.keyjob == false) {
 delete $scope.newHospital.time[obj];
 }
 }
 console.log('You are sure', $scope.newHospital);
 $rootScope.userData.time = $scope.newHospital.time
 $scope.newHospital = {}
 } else {
 console.log('You are not sure');
 }
 })
 }

 $scope.collectLanguages = function () {
 $scope.newHospital.languages = $rootScope.userData.languages

 $ionicPopup.confirm({
 title: 'Khả năng ngoại ngữ',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/collect-languages.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 for (var obj in $scope.newHospital.languages) {
 $scope.keyjob = $scope.newHospital.languages[obj];
 console.log('obj', $scope.keyjob);
 if ($scope.keyjob == false) {
 delete $scope.newHospital.languages[obj];
 }
 }
 console.log('You are sure', $scope.newHospital);

 $rootScope.userData.languages = $scope.newHospital.languages

 } else {
 console.log('You are not sure');
 }
 })
 }

 $scope.collectIndustry = function () {
 $scope.newHospital.industry = $rootScope.userData.industry

 $ionicPopup.confirm({
 title: 'Nơi làm việc mong muốn',
 scope: $scope,
 // template: 'Are you sure you want to eat this ice cream?',
 templateUrl: 'templates/popups/collect-industry.html',
 cssClass: 'animated bounceInUp dark-popup',
 okType: 'button-small button-calm bold',
 okText: 'Done',
 cancelType: 'button-small'
 }).then(function (res) {
 if (res) {
 for (var obj in $scope.newHospital.industry) {
 $scope.keyjob = $scope.newHospital.industry[obj];
 console.log('obj', $scope.keyjob);
 if ($scope.keyjob == false) {
 delete $scope.newHospital.industry[obj];
 }
 }
 console.log('You are sure', $scope.newHospital);
 $rootScope.userData.industry = $scope.newHospital.industry

 } else {
 console.log('You are not sure');
 }
 })
 }


 $scope.calculatemonth = function calculatemonth(birthday) { // birthday is a date
 var birthdate = new Date(birthday);
 var month = birthdate.getMonth() + 1;
 var year = birthdate.getFullYear();
 var time = month + "/" + year;

 return time;
 };
 $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
 var birthdate = new Date(birthday);
 var ageDifMs = Date.now() - birthdate;
 var ageDate = new Date(ageDifMs); // miliseconds from epoch
 return Math.abs(ageDate.getUTCFullYear() - 1970);
 };

 $scope.updateavatar = function () {
 console.log('update avatar clicked');
 $ionicActionSheet.show({
 buttons: [{
 text: 'Chụp ảnh'
 }, {
 text: 'Chọn từ thư viện'
 }],
 cancelText: 'Cancel',
 cancel: function () {
 },
 buttonClicked: function (index) {
 switch (index) {

 case 0:
 var options = {
 quality: 75,
 destinationType: Camera.DestinationType.FILE_URI,
 encodingType: Camera.EncodingType.JPEG,
 popoverOptions: CameraPopoverOptions,
 targetWidth: 500,
 targetHeight: 500,
 saveToPhotoAlbum: false,
 allowEdit: true

 };
 $cordovaCamera.getPicture(options).then(function (imageData) {
 $ionicLoading.show({
 template: '<p>Loading...</p><ion-spinner></ion-spinner>'
 });
 // $scope.images = imageData;

 var storageRef = firebase.storage().ref();
 // filename = imageData.name;

 var getFileBlob = function (url, cb) {
 var xhr = new XMLHttpRequest();
 xhr.open("GET", url);
 xhr.responseType = "blob";
 xhr.addEventListener('load', function () {
 cb(xhr.response);
 });
 xhr.send();
 };

 var blobToFile = function (blob, name) {
 blob.lastModifiedDate = new Date();
 blob.name = name;
 return blob;
 };

 var getFileObject = function (filePathOrUrl, cb) {
 getFileBlob(filePathOrUrl, function (blob) {
 cb(blobToFile(blob, new Date().getTime()));
 });
 };

 getFileObject(imageData, function (fileObject) {
 var metadata = {
 'contentType': fileObject.type
 };
 var uploadTask = storageRef.child('images/' + fileObject.name).put(fileObject, metadata);

 uploadTask.on('state_changed', null, function (error) {
 // [START onfailure]
 console.error('Upload failed:', error);
 alert('Upload failed:', error);
 // [END onfailure]
 }, function () {
 console.log(uploadTask.snapshot.metadata);
 var url = uploadTask.snapshot.metadata.downloadURLs[0];
 var usersRef = firebase.database().ref('user/jobber/' + $scope.uid);
 usersRef.update({
 photourl: url
 });
 $ionicLoading.hide()

 });

 });
 }, function (error) {
 console.error(error);
 alert(error);
 });


 break;
 case 1: // chọn pickercordova plugin add https://github.com/wymsee/cordova-imagePicker.git
 var options = {
 quality: 75,
 destinationType: Camera.DestinationType.FILE_URI,
 sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
 encodingType: Camera.EncodingType.JPEG,
 popoverOptions: CameraPopoverOptions,
 targetWidth: 500,
 targetHeight: 500,
 saveToPhotoAlbum: false,
 allowEdit: true
 };
 $cordovaCamera.getPicture(options).then(function (imageData) {

 $ionicLoading.show({
 template: '<p>Loading...</p><ion-spinner></ion-spinner>'
 });
 var storageRef = firebase.storage().ref();
 // filename = imageData.name;

 var getFileBlob = function (url, cb) {
 var xhr = new XMLHttpRequest();
 xhr.open("GET", url);
 xhr.responseType = "blob";
 xhr.addEventListener('load', function () {
 cb(xhr.response);
 });
 xhr.send();
 };

 var blobToFile = function (blob, name) {
 blob.lastModifiedDate = new Date();
 blob.name = name;
 return blob;
 };

 var getFileObject = function (filePathOrUrl, cb) {
 getFileBlob(filePathOrUrl, function (blob) {
 cb(blobToFile(blob, new Date().getTime()));
 });
 };

 getFileObject(imageData, function (fileObject) {

 var metadata = {
 'contentType': fileObject.type
 };
 var uploadTask = storageRef.child('images/' + fileObject.name).put(fileObject, metadata);

 uploadTask.on('state_changed', null, function (error) {
 // [START onfailure]
 console.error('Upload failed:', error);
 alert('Upload failed:', error);
 // [END onfailure]
 }, function () {
 console.log(uploadTask.snapshot.metadata);
 var url = uploadTask.snapshot.metadata.downloadURLs[0];
 var db = firebase.database();
 var ref = db.ref("user");
 var uid = firebase.auth().currentUser.uid;
 var usersRef = ref.child('jobber/' + uid);
 usersRef.update({
 photourl: url
 });
 $ionicLoading.hide()
 });

 });
 }, function (error) {
 console.error(error);
 $cordovaToast.showShortTop(error);
 });

 break;
 }

 return true;
 }
 });
 };

 $scope.captureVideo = function () {
 var options = {limit: 1, duration: 60};

 $cordovaCapture.captureVideo(options).then(function (mediaFiles) {
 $ionicLoading.show({
 template: '<p>Loading...</p><ion-spinner></ion-spinner>'
 });
 var i, imageData, len;
 for (i = 0, len = mediaFiles.length; i < len; i += 1) {
 imageData = mediaFiles[i].fullPath;
 var storageRef = firebase.storage().ref();

 var getFileBlob = function (url, cb) {
 var xhr = new XMLHttpRequest();
 xhr.open("GET", url);
 xhr.responseType = "blob";
 xhr.addEventListener('load', function () {
 cb(xhr.response);
 });
 xhr.send();
 };

 var blobToFile = function (blob, name) {
 blob.lastModifiedDate = new Date();
 blob.name = name;
 return blob;
 };
 var getFileObject = function (filePathOrUrl, cb) {
 getFileBlob(filePathOrUrl, function (blob) {
 cb(blobToFile(blob, new Date().getTime()));
 });
 };

 getFileObject(imageData, function (fileObject) {

 var metadata = {
 'contentType': fileObject.type
 };
 var uploadTask = storageRef.child('video/' + fileObject.name).put(fileObject, metadata);

 uploadTask.on('state_changed', null, function (error) {
 // [START onfailure]
 console.error('Upload failed:', error);
 $cordovaToast.showShortTop('Upload failed:', error);
 // [END onfailure]
 }, function () {
 console.log(uploadTask.snapshot.metadata);
 var url = uploadTask.snapshot.metadata.downloadURLs[0];
 var user = firebase.auth().currentUser;
 var db = firebase.database();
 var ref = db.ref("user");
 var uid = firebase.auth().currentUser.uid;
 var usersRef = ref.child('jobber/' + uid);
 usersRef.update({
 videourl: url
 });
 $ionicLoading.hide();
 $cordovaToast.showShortTop('Đã cập nhật video')

 });

 });
 }
 // Success! Video data is here

 }, function (err) {
 // An error occurred. Show a message to the user
 });
 };
 $scope.trustSrc = function (src) {
 return $sce.trustAsResourceUrl(src);
 };
 $scope.submit = function () {

 console.log($rootScope.userData)
 var profileRef = firebase.database().ref('profile/' + $rootScope.userid)
 profileRef.update($rootScope.userData)
 $scope.$back()
 }
 });
 */
