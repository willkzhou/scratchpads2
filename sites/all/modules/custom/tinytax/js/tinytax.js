(function($){
  Drupal.behaviors.tinytax = {attach: function(context, settings){
    if($.cookie('tinytax_toggled') > 0) {
      $('.tinytax-toggle-checkbox').attr('checked', 'checked');
    }
    $('.tinytax-toggle-checkbox').change(function(){
      if($(this).attr('checked')) {
        $.cookie('tinytax_toggled', 1);
        $('.vid-' + $(this).data('vid') + '.toggleable').hide();
      } else {
        $.cookie('tinytax_toggled', 0);
        $('.vid-' + $(this).data('vid') + '.toggleable').show();
      }
    });
    $('img.click', context).once().click(function(){
      var img_clicked = $(this);
      // If we're clicking a plus
      if(img_clicked.attr('src') == Drupal.settings.tinytax.plus) {
        if(img_clicked.parent('li').children('ul').length) {
          img_clicked.parent('li').children('ul').slideDown();
          img_clicked.attr('src', Drupal.settings.tinytax.minus);
        } else {
          // Check if we already have the children data, if so, we just show it
          img_clicked.attr('src', Drupal.settings.tinytax.load);
          $.getJSON(Drupal.settings.tinytax.callback + "/" + $(this).attr('id'), function(data){
            img_clicked.parent('li').append(data[1]['data']);
            Drupal.attachBehaviors(img_clicked.parent('li').children('ul'));
            img_clicked.attr('src', Drupal.settings.tinytax.minus);
            $('.tinytax-toggle-checkbox').each(function(){
              if($(this).attr('checked')) {
                $('.vid-' + $(this).data('vid') + '.toggleable').hide();
              } else {
                $('.vid-' + $(this).data('vid') + '.toggleable').show();
              }
            });
          });
        }
      }
      // If we're clicking a minus
      else if(img_clicked.attr('src') == Drupal.settings.tinytax.minus) {
        img_clicked.parent().children('ul').slideUp();
        img_clicked.attr('src', Drupal.settings.tinytax.plus);
      }
    });
    var background_colour = false;
    $('.tinytax li:last-child').addClass('last');
    $('.tinytax li:last-child').each(function(){
      $(this).parents().each(function(){
        if($(this).css('background-color') != 'transparent' && !background_colour) {
          background_colour = $(this).css('background-color');
          $('.tinytax li:last-child').addClass('last').css('background-color', background_colour);
        }
      });
    });
  },
  // Return the status of the tinytax block - which elements are open/closed
  getStatus: function(){
    var tids = [];
    $('div.tinytax li:visible ul:visible').each(function(){
      var id = $(this).closest('li').attr('id');
      if(id) {
        tids.push(id.replace(/^tinytax-/, ''));
      }
    });
    return {open_tids: tids};
  }}
})(jQuery);