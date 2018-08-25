var sections = ["size","style","toppings"]
var activeSection = "intro";
var prices = {
  'sizes': {
    'Small': 600,
    'Medium': 750,
    'Large': 900,
    'Extra Large': 1200,
  },
  'styles': {
    'Hand-Tossed': 0,
    'Deep Dish': 300,
    'Thin Crust': 200,
    'Gluten-Free': 400,
  },
  'toppings': {
    'Diced Tomatoes': [100,200,250,300],
    'Green Onions': [100,200,250,300],
    'Red Onions': [100,200,250,300],
    'Artichoke Hearts': [200,300,350,400],
    'Green Peppers': [100,200,250,300],
    'Red Peppers': [100,200,250,300],
    'Pepperoncinis': [100,200,250,300],
    'Spinach': [150,250,300,350],
    'Garlic': [200,300,450,400],
    'Black Olives': [100,200,250,300],
    'Jalapenos': [100,200,250,300],
    'Sprouts': [50,100,150,200],
  }
}
$(function(){
  onFromRight('button#start-button');
  pizza = new Pizza()
  $('#start-button').click(function(event){
    off('button#start-button');
    onFromRight('button#previous-button');
    onFromRight('button#next-button');
    activeSection = sections[0]
    $('.section#'+activeSection+'-card').slideDown(600)
    $('.section').css({
      'opacity': '1'
    });
    $('#pizza-card').css({
      'transform': 'translateX(0%)',
      'opacity': '1'
    });
    $('button#previous-button').text("Cancel")
    // event.preventDefault()
  });
  $('#next-button').click(function(){
    if ($(this).text() === "Confirm Order") {
      $('#pizza-card').css({
        'transform': 'translateX(-50%)'
      })
      var moveAmount = $('#pizza-card').width()/2
      $(this).css({
        'transform': 'translateX('+moveAmount+'px)'
      })
      $('button#previous-button').css({
        'opacity': '0'
      })
    }
    $('button#previous-button').text("< " + activeSection[0].toUpperCase()+activeSection.substr(1,activeSection.length))
    $('.section#'+activeSection+'-card').slideUp()
    activeSection = sections[sections.indexOf(activeSection)+1]
    $('.section#'+activeSection+'-card').slideDown()
    if (sections.indexOf(activeSection) === sections.length-1) {
      $('button#next-button').text("Confirm Order")
    }
  });
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
    $('.size-badge').removeClass('badge-success');
    $('.size-badge').addClass('badge-secondary');
    $(this).removeClass('badge-secondary');
    $(this).addClass('badge-success');
    pizza.subtractCost('sizes',pizza.size);
    pizza.size = $(this).text();
    $('#size-display').text(pizza.size + " ");
    
    pizza.addCost('sizes',$(this).text());
    pizza.updatePrice();
  });
  $('.style-badge').click(function(){
    $('.style-badge').removeClass('badge-success');
    $('.style-badge').addClass('badge-secondary');
    $(this).removeClass('badge-secondary');
    $(this).addClass('badge-success');
    pizza.subtractCost('styles',pizza.style);
    pizza.style = $(this).text();
    $('#style-display').text(pizza.style + " ");  
    pizza.addCost('styles',$(this).text());
    pizza.updatePrice();
  });
  $('.toppings-badge').click(function(){
    var sizeIndex = Object.keys(prices.sizes).indexOf(pizza.size)
    if ($(this).hasClass('badge-success')) {
      $(this).removeClass('badge-success')
      $(this).addClass('badge-secondary')
      pizza.toppings.splice(pizza.toppings.indexOf($(this).text()),1)
      pizza.subtractCost('toppings',$(this).text(),sizeIndex)
    } else {
      $(this).removeClass('badge-secondary')
      $(this).addClass('badge-success')
      pizza.toppings.push($(this).text())
      pizza.addCost('toppings',$(this).text(),sizeIndex)
    }
    pizza.updatePrice()
    $('#toppings-display').text(pizza.toppingsList())
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
function Pizza() {
  this.infoArea = $('#pizza-info')
  this.size = "Small";
  this.style = "Hand-Tossed";
  this.toppings = ["Cheese"];
  this.totalPrice = 0;
  this.addCost('sizes','Small');
  this.addCost('styles','Hand-Tossed');
  this.updatePrice();
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
  return list;
}
Pizza.prototype.addCost = function(category,item,index) {
  if (index) {
    this.totalPrice += parseInt(prices[category][item][index])
  } else {
    this.totalPrice += parseInt(prices[category][item]);
  }
}
Pizza.prototype.subtractCost = function(category,item,index) {
  if (index) {
    this.totalPrice -= parseInt(prices[category][item][index])
  } else {
    
    this.totalPrice -= parseInt(prices[category][item]);
  }
}
Pizza.prototype.updatePrice = function(){
  var dollars = Math.floor(this.totalPrice/100)
  var cents = this.totalPrice%100
  if (cents.toString().length===1) {
    cents += "0"
  }
  $('#total-price').text("Price: $"+dollars+"."+cents)

}
