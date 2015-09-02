(function(angular) {
  "use strict";
  return angular.module("app.fullscreen", []).directive("myFullscreen", [
    "$document", function($document) {
      var _enter, _exit, _isFullscreenActive;
      _isFullscreenActive = function() {
        return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) != null;
      };
      _enter = function(elem) {
        console.log("  entering fullscreen...");
        if (elem.requestFullscreen && elem.requestFullscreen()) {
          return;
        }
        if (elem.msRequestFullscreen && elem.msRequestFullscreen()) {
          return;
        }
        if (elem.mozRequestFullScreen && elem.mozRequestFullScreen()) {
          return;
        }
        if (elem.webkitRequestFullscreen && elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)) {
          return;
        }
      };
      _exit = function() {
        var doc;
        console.log("  exiting fullscreen...");
        doc = $document[0];
        if (doc.exitFullscreen && doc.exitFullscreen()) {
          return;
        }
        if (doc.mozCancelFullScreen && doc.mozCancelFullScreen()) {
          return;
        }
        if (doc.webkitExitFullscreen && doc.webkitExitFullscreen()) {
          return;
        }
        if (doc.msExitFullscreen && doc.msExitFullscreen()) {
          return;
        }
      };
      return function(scope, element, attrs) {
        console.log("attrs.myFullscreen=" + attrs.myFullscreen);
        scope.$watch(attrs.myFullscreen, function(value) {
          console.log("value = " + value);
          if (value) {
            element.addClass("fullscreen-active");
            _enter(element[0]);
          } else {
            _exit();
          }
        });
        $document.on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function() {
          if (!_isFullscreenActive()) {
            console.log("  removing .fullscreen-active class...");
            element.removeClass("fullscreen-active");
            scope.$apply(function() {
              return scope.isFullscreen = false;
            });
          }
        });
      };
    }
  ]);
})(window.angular);
