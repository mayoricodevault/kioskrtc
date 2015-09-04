xively.factory("Orders", ["$firebaseObject",
  function($firebaseObject) {
    return function(sessUrl) {
      var ref = new Firebase(sessUrl);
      return $firebaseObject(ref);
    };
  }
]);
