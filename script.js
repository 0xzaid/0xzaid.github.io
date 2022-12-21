// Toggle the burger menu dropdown when the burger menu button is clicked
$('.burger').click(function () {
  $('.burger-menu').slideToggle();
});

// Close the burger menu when a link in the dropdown is clicked
$('.burger-menu a').click(function () {
  $('.burger-menu').slideUp();
});

$('#copy').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function setTooltip(message) {
  $('#copy').tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function hideTooltip() {
  setTimeout(function () {
    $('#copy').tooltip('hide');
  }, 1000);
}

// Clipboard
var clipboard = new ClipboardJS('#copy');

clipboard.on('success', function (e) {
  setTooltip('Copied!');
  hideTooltip();

});

clipboard.on('error', function (e) {
  setTooltip('Failed!');
  hideTooltip();

});

$(window).scroll(function () {
  if ($(this).scrollTop() < 400) {
    $('.scroll-indicator').hide();
    $('.scroll-indicator').show();
  } else {
    $('.scroll-indicator').show();
    $('.scroll-indicator').hide();
  }
});