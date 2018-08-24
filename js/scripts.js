var sections = ["size","type","toppings",]
var activeSection = "intro";
$(function(){
  onFromRight('button#start-button');
  $('#start-button').click(function(){
    off('button#start-button');
    onFromRight('button#previous-button');
    onFromRight('button#next-button');
    activeSection = sections[0]
    $('.section#'+activeSection+'-card').slideDown(600)
    $('.section').css({
      'opacity': '1'
    })
    $('#pizza-card').css({
      'transform': 'translateX(0%)',
      'opacity': '1'
    })
  });
  $('#next-button').click(function(){
    $('.section#'+activeSection+'-card').slideUp()
    activeSection = sections[sections.indexOf(activeSection)+1]
    $('.section#'+activeSection+'-card').slideDown()
  })
  $('#previous-button').click(function(){
    if (sections.indexOf(activeSection) > 0) {
      $('.section#'+activeSection+'-card').slideUp()
      activeSection = sections[sections.indexOf(activeSection)-1]
      $('.section#'+activeSection+'-card').slideDown()
    }
  });
});
function onFromRight(element) {
  $(element).css({
    'pointer-events': 'all',
  });
  $(element).css({
    'left': '0vw',
    'opacity': '1',
  });
}
function off(element) {
  $(element).css({
    'opacity': '0',
  });
}
