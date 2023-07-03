jQuery(document).ready(function ($) {

  $('#header .header_user .user_menu_btn').click(function() {
      $(this).parent('div').toggleClass('active_menu');
  });
  // $('#header .header_user .menu_btn').click(function() {
  //     $('#header .header_user').removeClass('active_menu');
  // });

  jQuery('#school_reviews .inner_rev_block .content_side .review_comment').hide();

  
  jQuery('#school_reviews .inner_rev_block .see_review_btn').click(function() {
      if ($(this).hasClass("active_btn")) {
          jQuery(this).siblings('.review_comment').slideUp();
          jQuery(this).removeClass('active_btn');
          jQuery(this).text('See provider response');
      } else {
          jQuery('.review_comment').slideUp();
          jQuery(this).siblings('.review_comment').slideDown();
          jQuery('.see_review_btn').removeClass('active_btn');
          jQuery(this).addClass('active_btn');
          jQuery('#school_reviews .inner_rev_block .see_review_btn').text('See provider response');
          jQuery(this).text('Hide provider response');             
      }
      
  });

  $("#what_looking").owlCarousel({
      center: true,
      items: 1,
      loop: true,
      nav: true,
      margin: 35,
      autoplay:true,
      autoplayTimeout:5000,
      autoplayHoverPause:true,
      responsive: {
          768: {
              items: 3,
          },
          1200: {
              items: 5,
          },
      },
  });

  jQuery("#preschoolForm .form_header .search_provider .form-block").hide();
  jQuery("#preschoolForm .form_header .search_provider .activate_searchbar").click(function() {
      jQuery(this).slideUp();
      jQuery(this).siblings('.form-block').slideDown();
  });

  function brandSliderClasses() {
      $("#what_looking").each(function() {
          var total = $(this).find('.owl-item.active').length;
          $(this).find('.owl-item').removeClass('firstactiveitem');
          $(this).find('.owl-item').removeClass('lastactiveitem');
          $(this).find('.owl-item.active').each(function(index) {
              if (index === 1) {
                  $(this).addClass('firstactiveitem')
              }
              if (index === 3) {
                  $(this).addClass('lastactiveitem')
              }
          })
      })
  }
  brandSliderClasses();
  $("#what_looking").on('translated.owl.carousel', function(event) {
      brandSliderClasses()
  }); 
});


jQuery(document).ready(function() {
  jQuery('.steps_count').html("Step <b>" + (currentTab + 1) + "</b>" + " of <b>4</b>");
});
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
// This function will display the specified tab of the form...
var x = document.getElementsByClassName("tab");
jQuery(x[n]).show();
//... and fix the Previous/Next buttons:
if (n == 0) {
  jQuery('#prevBtn').hide();
  jQuery('#preschoolForm .skip_steps').hide();
} else {
  jQuery('#prevBtn').show();
  jQuery('#preschoolForm .skip_steps').show();
}
if (n == (x.length - 1)) {
  jQuery('#nextBtn').html('Submit');
  jQuery('.progress_bar_steps').addClass("last_step");

  // document.getElementById("nextBtn").innerHTML = "Submit";
} else {
  jQuery('#nextBtn').html('Next');
  jQuery('.progress_bar_steps').removeClass("last_step");
}
//... and run a function that will display the correct step indicator:
fixStepIndicator(n)
}

function nextPrev(n) {
// This function will figure out which tab to display
var x = document.getElementsByClassName("tab");
// Exit the function if any field in the current tab is invalid:
if (n == 1 && !validateForm()) return false;
// Hide the current tab:
jQuery(x[currentTab]).hide();
// Increase or decrease the current tab by 1:
currentTab = currentTab + n;
// if you have reached the end of the form...
if (currentTab >= x.length) {
  // ... the form gets submitted:
  document.getElementById("regForm").submit();
  return false;
}
// Otherwise, display the correct tab:
  showTab(currentTab);
  jQuery('.steps_count').html("Step <b>" + (currentTab + 1) + "</b>" + " of <b>4</b>");
  jQuery('.progress_bar_steps .progress-bar').width(((currentTab + 1)*"25") + "%");
  var location_name = $( "#user_location").val();
  var location_radius = $(".location_radius input[name='locate_radius']:checked").val();
  jQuery('.step.step_1').html("<span>|</span> Within " + location_radius + " of " + location_name); 
  
  var when_need = $(".when_time input[name='when_need']:checked").val();
  jQuery('.step.step_2').html("<span>|</span> " + when_need); 

  var what_looking = $(".what_looking_dur input[name='what_looking_dur']:checked").val();
  var what_looking_length = $(".what_looking_leng input[name='what_looking_leng']:checked").val();
  jQuery('.step.step_3').html("<span>|</span> " + what_looking + ", " + what_looking_length); 
}

function validateForm() {
// This function deals with validation of the form fields
var x, y, i, checkRadio, valid = true;
x = document.getElementsByClassName("tab");
y = x[currentTab].getElementsByTagName("input");
//   checkRadio = x[currentTab].getElementsByClassName("radio_btn");  
// A loop that checks every input field in the current tab:
for (i = 0; i < y.length; i++) {
  
  if (y[i].value == "") {
    y[i].className += " invalid";      
    valid = false;
  }



}
// If the valid status is true, mark the step as finished and valid:
if (valid) {
  document.getElementsByClassName("step")[currentTab].className += " finish"; 
}
return valid; // return the valid status
}

function fixStepIndicator(n) {
// This function removes the "active" class of all steps...
var i, x = document.getElementsByClassName("step");
for (i = 0; i < x.length; i++) {
  x[i].className = x[i].className.replace(" active", "");
}
//... and adds the "active" class on the current step:
//   x[n].className += " active";
$(x[n]).addClass('active');
}