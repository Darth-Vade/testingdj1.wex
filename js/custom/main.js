

// FOR PRELOADER
window.addEventListener("load", function(){
    var preload = document.querySelector(".preloader");
    preload.classList.add("finish-load");
});


// FOR BACK2TOP BUTTON
$(window).on("scroll", function(){
    var scroll = $(this).scrollTop();
    
    if(scroll > 1000){
        $(".back2top-btn").show();
    }else{
        $(".back2top-btn").hide();
    }
});


// FOR NAVBAR FIXED WHEN SCROLL
$(window).on("scroll", function(){
    var scrolling = $(this).scrollTop();
    if (scrolling > 80){
        $(".navbar-part").addClass("navbar-fixed");
    }else{
        $(".navbar-part").removeClass("navbar-fixed");
    }
});


// FOR RESPONSIVE SLIDE NAVBAR
$(".navbar-toggle").on('click', function(){
  $(".navbar-overlay").addClass('active');
  $(".cencel").on('click', function(){
      $(".navbar-overlay").removeClass('active');
  })
});


// FOR RESPONSIVE DROPDOWN MENU
$(function () {
  $(".navbar-dropdown a").click(function() {
      $(this).next().toggle();
      if($('.dropdown-list:visible').length > 1) {
          $('.dropdown-list:visible').hide();
          $(this).next().show();
      }
  }); 
});
