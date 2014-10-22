/********************************** About Me **********************************/
function showAboutMe(buttonToRemove)
{
  $("#about-me").hide(); // hide so that I can fade it after removing classes
  $("#about-me").removeClass("hidden-xs");
  $("#about-me").removeClass("hidden-sm");
  $("#about-me").slideDown();
  $("html, body").animate({ scrollTop: $("footer").offset().top }, 1000);
  $(buttonToRemove).remove();
}

/********************************* Thumbnails *********************************/
$(".thumbnail[data-fullres-src]").click(function()
{
  // create modal for fullres image
  var $modal = $("<div/>", { "class": "modal fade" }).insertAfter($(this));
  var $modalDialog = $("<div/>", { "class": "modal-dialog" }).appendTo($modal);
  var $modalContent = $("<div/>", { "class": "modal-content" }).appendTo($modalDialog);
  $("<img/>", { "class": "fullres", "src": $(this).attr("data-fullres-src") }).appendTo($modalContent);

  // set event to remove modal
  $modal.on('hidden.bs.modal', function (e) { $modal.remove(); });

  // show the modal
  $modal.modal();
});
