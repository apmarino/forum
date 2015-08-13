console.log("Linked Home")

$( document ).ready(function() {
  console.log( "ready!" );

  $('.topic-user').val($.cookie().username);//Sets hidden input the value of the username cookie

  $('.comment-user').val($.cookie().username);//Sets hidden input the value of the username cookie

  $('.usr-button').on('click', function(){
    $.cookie("username", $('.username').val());
    $('.reveal-modal').hide();  
  });
});//End Document Ready