var sections = ["size","style","toppings"]
var activeSection = "intro";

$(function(){
  simulator = new Simulator();
  $('#start-button').css({
    'transform': 'translateX(0%)',
    'opacity': '1'
  });
  onFromRight('button#start-button');
  $('#start-button').click(function(event){
    handleStartClick(this)
  });
  $('#next-button').click(function(){
    handleNextClick(this)
  });
  $('#previous-button').click(function(){
    handlePrevClick(this)
  });
  $('.size-badge').click(function(){
    handleBadgeClick(this,'size')
  });
  $('.style-badge').click(function(){
    handleBadgeClick(this,'style')
  });
  $('.toppings-badge').click(function(){
    handleBadgeClick(this,'toppings')
  });
  $('.cheese-badge').click(function(){
    handleBadgeClick(this,'cheese')
  });
});
function handleStartClick(clicked) {
  simulator.startPizza();
  activeSection = sections[0];
  onFromRight('button#previous-button');
  onFromRight('button#next-button');
  $('.section#'+activeSection+'-card').slideDown(600)
  $('.section').css({
    'opacity': '1'
  });
  $('#pizza-card').css({
    'transform': 'translateX(0%)',
    'opacity': '1'
  });
  $('#start-button').css({
    'opacity': '0'
  });
  $('button#previous-button').text("Cancel")
}
jQuery.prototype.swapClass = function(oldClass,newClass) {
  $(this).addClass(newClass);
  $(this).removeClass(oldClass);
}
function handleBadgeClick(clicked,type) {
  if (type==="size") {
    $('.size-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    simulator.activePizza.subtractCost('sizes',simulator.activePizza.size);
    var oldSizeIndex = Object.keys(simulator.prices.sizes).indexOf(simulator.activePizza.size)
    var newSizeIndex = Object.keys(simulator.prices.sizes).indexOf($(clicked).text())
    for (var i=1; i<simulator.activePizza.toppings.length;i++) {
      var topping = simulator.activePizza.toppings[i]
      simulator.activePizza.subtractCost('toppings',topping,oldSizeIndex)
      simulator.activePizza.addCost('toppings',topping,newSizeIndex)
    }
    simulator.activePizza.size = $(clicked).text();
    $('#size-display').text(simulator.activePizza.size + " ");
    simulator.activePizza.addCost('sizes',$(clicked).text());
    simulator.activePizza.updatePriceDisplay();
  } else if (type==="style") {
    $('.style-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    simulator.activePizza.subtractCost('styles',simulator.activePizza.style);
    simulator.activePizza.style = $(clicked).text();
    $('#style-display').text(simulator.activePizza.style + " ");  
    simulator.activePizza.addCost('styles',$(clicked).text());
    simulator.activePizza.updatePriceDisplay();
  } else if (type==="cheese") {
    var sizeIndex = simulator.activePizza.sizeIndex()
    var cheeseName = "Cheese"
    $(clicked).text()==="None" ? cheeseName = "No Cheese" :
    $(clicked).text()==="Extra" ? cheeseName = "Extra Cheese" : false
    $('.cheese-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    simulator.activePizza.subtractCost('cheeses',simulator.activePizza.toppings[0],sizeIndex);
    simulator.activePizza.toppings[0] = cheeseName
    simulator.activePizza.addCost('cheeses',cheeseName,sizeIndex);
    simulator.activePizza.updatePriceDisplay();
    $('#toppings-display').text(simulator.activePizza.toppingsList())
  } else if (type==="toppings") {
    var sizeIndex = simulator.activePizza.sizeIndex()
    if ($(clicked).hasClass('badge-success')) {
      $(clicked).swapClass('badge-success','badge-secondary')
      simulator.activePizza.toppings.splice(simulator.activePizza.toppings.indexOf($(clicked).text()),1)
      simulator.activePizza.subtractCost('toppings',$(clicked).text(),sizeIndex)
    } else {
      $(clicked).swapClass('badge-secondary','badge-success')
      simulator.activePizza.toppings.push($(clicked).text())
      simulator.activePizza.addCost('toppings',$(clicked).text(),sizeIndex)
    }
    simulator.activePizza.updatePriceDisplay()
    $('#toppings-display').text(simulator.activePizza.toppingsList())
  }
}
function handlePrevClick(clicked) {
  if ($(clicked).text()==="Cancel") {
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
}
function handleNextClick(clicked) {
  if ($(clicked).text() === "Confirm Order") {
    $('#final-button').css({
      'left':'0px',
      'opacity': '1'
    }).addClass('pulse')
    var moveAmount = $('#pizza-card').width()+(window.innerWidth/8)
    $('#pizza-card').css({
      'transform': 'translateX(+'+(moveAmount)+'px)',
      'opacity': 0
    })
    $(clicked).css({
      'opacity': '0',
      'pointer-events': 'none'
    })
    $('button#previous-button').css({
      'opacity': '0',
      'pointer-events': 'none'
    });
    $('button#start-button').css({
      'pointer-events': 'none'
    });
    $('.section#'+activeSection+'-card').slideUp()
    simulator.produceInvoice(simulator.activePizza)
    simulator.displayOverlay()
  } else {
    $('button#previous-button').text("< " + activeSection[0].toUpperCase()+activeSection.substr(1,activeSection.length))
    $('.section#'+activeSection+'-card').slideUp()
    activeSection = sections[sections.indexOf(activeSection)+1]
    $('.section#'+activeSection+'-card').slideDown()
    if (sections.indexOf(activeSection) === sections.length-1) {
      $('button#next-button').text("Confirm Order")
    }
  }
}
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
function Simulator() {
  this.blurbs = [
    "The greatest pizza you could ever imagine."
  ]
  this.pizzas = [];
  this.prices = {
    'sizes': {
      'Small': 600,
      'Medium': 750,
      'Large': 900,
      'Extra Large': 1200,
    },
    'styles': {
      'Hand-Tossed': 0,
      'Deep Dish': 300,
      'Wafer-Thin': 200,
      'Gluten-Free': 350,
    },
    'cheeses': {
      'No Cheese':[0,0,0,0],
      'Cheese':[0,0,0,0],
      'Extra Cheese':[150,250,350,450]
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
  this.startPizza = function() {
    var newPizza = new Pizza()
    this.pizzas.push(newPizza)
    this.activePizza = newPizza
  }
  this.displayOverlay = function() {
    $('#overlay').fadeIn()
  }
  this.produceInvoice = function(pizza) {
    pizza.invoice = new Invoice(pizza)
  }
  console.log(this.blurbs[randomInt(0,this.blurbs.length)])
  $('#blurb').text(this.blurbs[randomInt(0,this.blurbs.length)])
}
function Pizza() {
  this.infoArea = $('#pizza-info')
  this.size = "Small";
  this.style = "Hand-Tossed";
  this.toppings = ["Cheese"];
  this.totalPrice = 0;
  this.addCost('sizes','Small');
  this.addCost('styles','Hand-Tossed');
  this.invoice = undefined;
  this.sizeIndex = function(){
    return Object.keys(simulator.prices.sizes).indexOf(this.size)
  }
  this.updatePriceDisplay();
}
Pizza.prototype.toppingsList = function() {
  var list = "";
  this.toppings.forEach(function(topping,i){
    list += topping;
    if (i < (simulator.activePizza.toppings.length-1)) {
      list += ", ";
    }
  });
  console.log("list " + list)
  return list;
}
Pizza.prototype.addCost = function(category,item,index) {
  if (index) {
    this.totalPrice += parseInt(simulator.prices[category][item][index])
  } else {
    this.totalPrice += parseInt(simulator.prices[category][item]);
  }
}
Pizza.prototype.subtractCost = function(category,item,index) {
  if (index) {
    this.totalPrice -= parseInt(simulator.prices[category][item][index])
  } else {
    
    this.totalPrice -= parseInt(simulator.prices[category][item]);
  }
}
Pizza.prototype.updatePriceDisplay = function(){ 
  $('#total-price').text("Price: "+toDollars(this.totalPrice))
}
function Invoice(pizza) {
  this.html = `<div id="invoice" class="card">
                <div style="text-align:center" class="card-header">
                  <button class="btn btn-success btn-lg" id="final-button">
                    PLACE ORDER
                  </button>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-10 bordered"><strong>Item</strong></div>
                    <div class="col-2 right-align bordered"><strong>Price</strong></div>
                  </div>
                  <div class="row">
                    <div id="item-list" class="col-10 bordered">
                    </div>
                    <div id="price-list" class="col-2 right-align bordered">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-10 bordered"><strong>Total</strong></div>
                    <div class="col-2 right-align bordered"><strong>`+toDollars(pizza.totalPrice)+`</strong></div>
                  </div>
                </div>
              </div>`;
  $('body').prepend(this.html)
  this.div = $('#invoice')
  this.div.css({
    'width': ($('#header').width()*0.75)+'px'
  })
  this.confirmButton = $('#final-button')
  this.div.css({
    'top': '-10%'
  })
  this.div.animate({
    'top': '10%'
  },400)
  this.confirmButton.css({
    'left': '0px',
  }).animate({
    'opacity': '1'
  },400,function(){
    $(this).addClass('pulse')
  })
  this.itemList = $('#item-list');
  this.priceList = $('#price-list');
  this.itemList.append(pizza.size + " Pizza<br />");
  this.priceList.append(toDollars(simulator.prices.sizes[pizza.size])+ "<br />");
  this.itemList.append(pizza.style + " Crust<br />");
  this.priceList.append(toDollars(simulator.prices.styles[pizza.style])+ "<br />");
  var sizeIndex = simulator.activePizza.sizeIndex()
  for (var i=0; i<pizza.toppings.length; i++) {
    var topping = pizza.toppings[i];
    this.itemList.append(" - add " + topping + "<br />");
    if (i===0) {
      this.priceList.append(toDollars(simulator.prices.cheeses[topping][sizeIndex])+"<br />")
    } else {
      this.priceList.append(toDollars(simulator.prices.toppings[topping][sizeIndex])+"<br />");
    }
  }
}
toDollars = function(num) {
  console.log("translating " + num)
  var dollars = Math.floor(num/100)
  var cents = num%100
  if (cents.toString().length===1) {
    cents += "0"
  }
  return "$" + dollars + "." + cents
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};