(function () {
  "use strict"
 
  var onsubmit = function (event) {
    $("form").off("submit", onsubmit).on("submit", false);
  };
 
  $("form").on("submit", onsubmit);
})();
