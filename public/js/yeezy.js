
$('.container-contact').has('#alert-contact').css({'margin': '80px auto'});

$(function() {

  const score_content = 'Shows the AFINN-based sentiment score of an article<div class=\'pop\'><i class=\'far fa-smile icon-popover\'></i><span><span class=\'colon\'>:</span>Score > 20</span><br><i class=\'far fa-meh icon-popover\'></i><span><span class=\'colon\'>:</span>-20 < Score < 20</span><br><i class=\'far fa-smile icon-popover\'></i><span><span class=\'colon\'>:</span>Score < -20</span></div>'

  const comparative_content = 'Shows the AFINN-based sentiment comparative score of an article<div class=\'pop\'><i class=\'far fa-heart icon-popover\'></i><span><span class=\'colon\'>:</span>Score > 0.05</span><br><i class=\'far fa-handshake icon-popover\'></i><span><span class=\'colon\'>:</span>-0.02 < Score < 0.05</span><br><i class=\'far fa-window-close icon-popover\'></i><span><span class=\'colon\'>:</span>Score < -0.02</span></div>'


  const score_options = options('Sentiment Score', score_content);
  const comparative_options = options('Sentiment Comparative', comparative_content);

  // select element by clasa
  $('.fa-eye').popover({ trigger: 'hover'});

  $('.score i').popover(score_options);

  $('.comparative i').popover(comparative_options);

  $('#weeks').change(function() {
    location.href = $(this).val();
  });

  $('#faq-btn').on('click', function(e) {
    const allCards = $('#accordionExample .card').length;
    const uncollapsedCards = $('#accordionExample .show').length;
    if(allCards === uncollapsedCards) {
      $('.accordion .collapse').collapse('hide');
    } else {
      $('.accordion .collapse').collapse('show');
    }
      // if all cards are open, then collapse all
      // if one card open, then open all
  });


  function options(title, content) {
    return {
      trigger: 'hover',
      title: title,
      content: content,
      html: true,
      placement: 'right'
    }
  }
});
