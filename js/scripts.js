var sections = ["size","style","toppings"]
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
    $('button#previous-button').text("Cancel")
    pizza = new Pizza()
  });
  $('#next-button').click(function(){
    $('button#previous-button').text("< " + activeSection[0].toUpperCase()+activeSection.substr(1,activeSection.length))
    $('.section#'+activeSection+'-card').slideUp()
    activeSection = sections[sections.indexOf(activeSection)+1]
    $('.section#'+activeSection+'-card').slideDown()
    if (sections.indexOf(activeSection) === sections.length-1) {
      $('button#next-button').text("Confirm Order")
    }
  })
  $('#previous-button').click(function(){
    if ($(this).text()==="Cancel") {
      location.reload();
    }
    if (sections.indexOf(activeSection) < sections.length) {
      $('button#next-button').text("Next >")
    }
    if (sections.indexOf(activeSection) < sections.length) {
      var lastSection = sections[sections.indexOf(activeSection)-2]
      if (!lastSection) {
        $('button#previous-button').text("Cancel")
      } else {
        $('button#previous-button').text("< " + lastSection[0].toUpperCase()+lastSection.substr(1,lastSection.length))
      }
      $('.section#'+activeSection+'-card').slideUp()
      activeSection = sections[sections.indexOf(activeSection)-1]
      $('.section#'+activeSection+'-card').slideDown()
    }
  });
  $('.size-badge').click(function(){
    $('.size-badge').removeClass('badge-success')
    $('.size-badge').addClass('badge-secondary')
    $(this).removeClass('badge-secondary')
    $(this).addClass('badge-success')
    pizza.size = $(this).text()
    $('#size-display').text(pizza.size + " ")
    console.log(pizza)
  })
  $('.style-badge').click(function(){
    $('.style-badge').removeClass('badge-success')
    $('.style-badge').addClass('badge-secondary')
    $(this).removeClass('badge-secondary')
    $(this).addClass('badge-success')
    pizza.style = $(this).text()
    $('#style-display').text(pizza.style + " ")
    console.log(pizza)
  })
  $('.toppings-badge').click(function(){
    if ($(this).hasClass('badge-success')) {
      $(this).removeClass('badge-success')
      $(this).addClass('badge-secondary')
      pizza.toppings.splice(pizza.toppings.indexOf($(this).text()),1)
    } else {
      $(this).removeClass('badge-secondary')
      $(this).addClass('badge-success')
      pizza.toppings.push($(this).text())
    }
    $('#toppings-display').text(pizza.toppingsList())
    console.log(pizza)
  })
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
function Pizza() {
  this.infoArea = $('#pizza-info')
  this.size = "Small";
  this.style = "Hand-Tossed";
  this.toppings = ["Cheese"];
  this.price = 0
}
Pizza.prototype.toppingsList = function() {
  var list = "";
  this.toppings.forEach(function(topping,i){
    list += topping;
    if (i < (pizza.toppings.length-1)) {
      list += ", ";
    }
  });
  console.log("list " + list)
  return list
}
