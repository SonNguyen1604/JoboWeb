angular
.module('app')


  .service('AuthUser', function ($rootScope, $q) {

      this.employer = function (data) {
          var output = [],
            deferred = $q.defer();

          firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                  $rootScope.userid = user.uid;
                  var setCurrent = firebase.database().ref('user/' + $rootScope.userid)
                  setCurrent.once('value', function (snap) {
                      var dataCurrent = snap.val();
                      if (dataCurrent) {
                          $rootScope.storeIdCurrent = dataCurrent.currentStore;
                          output = {
                              userid: $rootScope.userid,
                              storeIdCurrent: $rootScope.storeIdCurrent
                          }
                          deferred.resolve(output);
                      } else {
                          console.log("i'm in " + $rootScope.userid + 'with' + "no store")
                      }
                  });
                  // User is signed in.
              } else {
                  data = "None";
                  // No user is signed in.
              }

          })


          return deferred.promise;
      }
  }
  );