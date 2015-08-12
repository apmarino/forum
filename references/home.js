console.log("Linked Home")

$( document ).ready(function() {
  console.log( "ready!" );

  
  $('.usr-button').on('click', function(){
    $.cookie("username", $('.username').val());
  })
});//End Document Ready