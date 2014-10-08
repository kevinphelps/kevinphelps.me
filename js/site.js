function showAboutMe(buttonToRemove)
{
  $("#about-me").hide(); // hide so that I can fade it after removing classes
  $("#about-me").removeClass("hidden-xs");
  $("#about-me").removeClass("hidden-sm");
  $("#about-me").slideDown();
  $("html, body").animate({ scrollTop: $("footer").offset().top }, 1000);
  $(buttonToRemove).remove();
}
