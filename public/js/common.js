$(".other").click(() => {
if($("#panel-main-page").hasClass("panel-active")){
  $("#panel-div").toggleClass("active");
  $("#overlay").toggleClass("active");
}else{
  var page = $("#panel-div").find(".panel-active")
  console.log(page)
  page.toggleClass("panel-active");
  $("#panel-main-page").toggleClass("panel-active");
}


});

$("#overlay").click(()=>{
  var page = $("#panel-div").find(".panel-active")
  page.toggleClass("panel-active");
  $("#panel-main-page").toggleClass("panel-active");
  $("#panel-div").toggleClass("active");
  $("#overlay").toggleClass("active");
})


$("#panel-div .back-icon").click((event) => {
  var backIcon = $(event.target);
  var page = backIcon.parents(".panel-page")
  console.log(page)
  page.toggleClass("panel-active");
  $("#panel-main-page").toggleClass("panel-active");
});

$("#panel-item-companies").click(() => {
  $("#panel-main-page").toggleClass("panel-active");
  $("#panel-companies").toggleClass("panel-active");
});

$("#panel-item-persons").click(() => {
  $("#panel-main-page").toggleClass("panel-active");
  $("#panel-persons").toggleClass("panel-active");
});
