xively.factory("Messages", ["$firebaseObject",
  function($firebaseObject) {
    return function(sessUrl) {
      var ref = new Firebase(sessUrl);
      return $firebaseObject(ref);
    };
  }
]);
