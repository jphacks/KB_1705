(function () {
  //戻るボタン
  let btnBack_onclick = function (event) {
    let $form = $(".form");
    $form.attr("action", "/");
    $form.submit();
  };
 
  //登録
  let btnRegist_onclick = function (event) {
    let $form = $(".form");
    $form.attr("action", "/complete");
    $form.submit();
  };
 
  //読み込み完了
  let document_onready = function (event) {
    console.log(55555555);
    $("#btn-back").on("click", btnBack_onclick);
    $("#btn-regist").on("click", btnRegist_onclick).focus();
  };
 
  $(document).ready(document_onready);
})();
