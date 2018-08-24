var activeScreen = "intro"
$(function(){
  onFromRight('button#start-button')
  $('#start-button').click(function(){
    off('button#start-button');
    onFromRight('button#previous-button');
    onFromRight('button#next-button');
    $('.section#size-card').css({
      'transform': 'scaleY(1)'
    })
  })
})
function onFromRight(element) {
  $(element).css({
    'pointer-events': 'all',
  })
  $(element).css({
    'left': '0vw',
    'opacity': '1',
  });
}
function off(element) {
  $(element).css({
    'opacity': '0',
  })
}
