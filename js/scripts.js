simulator = new Simulator();
$(function(){
  $('#blurb').html(simulator.blurbs[randomInt(0,simulator.blurbs.length-1)]);
  $('#start-button').css({
    'transform': 'translateX(0%)',
    'opacity': '1'
  });
  onFromRight('button#start-button');
  $('#start-button').click(function(){
    handleStartClick(this)
  });
  $('#next-button').click(function(){
    handleNextClick(this)
  });
  $('#previous-button').click(function(){
    handlePrevClick(this)
  });
  $('.size-badge, .style-badge, .toppings-badge, .cheese-badge').click(function(){
    handleItemClick(this)
  })
});
function handleStartClick() {
  simulator.startPizza();
  simulator.revealElements()
}
function handleItemClick(clicked,remove) {
  var badge = $(clicked)
  var itemName = badge.text();
  var type = simulator.getCategory(itemName)
  if (type==="size" || type==="style" || type==="cheese") { // one selected at a time
    $('.'+type+'-badge').swapClass('badge-success','badge-secondary'); // make all others gray
  } else if (type==="toppings") { // multiple selected/deselected
    remove = badge.hasClass('badge-success'); // was badge already green when clicked?
  }
  if (remove) {
    badge.swapClass('badge-success','badge-secondary');
  } else {
    badge.swapClass('badge-secondary','badge-success');
  }
  simulator.activePizza.changeItem(itemName,remove)
  simulator.updateDisplay(simulator.activePizza);
}
function handlePrevClick(clicked) {
  if ($(clicked).text()==="Cancel") {
    location.reload();
  }
  if (simulator.sections.indexOf(simulator.activeSection) < simulator.sections.length) {
    $('button#next-button').text("Next >");
    var lastSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)-2];
    if (!lastSection) {
      $('button#previous-button').text("Cancel");
    } else {
      $('button#previous-button').text("< " + lastSection[0].toUpperCase()+lastSection.substr(1,lastSection.length));
    }
    $('.section#'+simulator.activeSection+'-card').slideUp();
    simulator.activeSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)-1];
    $('.section#'+simulator.activeSection+'-card').slideDown();
  }
}
function handleNextClick(clicked) {
  if ($(clicked).text() === "Confirm Order") {
    simulator.produceInvoice(simulator.activePizza);
    simulator.showInvoice(simulator.activePizza.invoice);
  } else {
    $('button#previous-button').text("< " + simulator.activeSection[0].toUpperCase()+simulator.activeSection.substr(1,simulator.activeSection.length));
    $('.section#'+simulator.activeSection+'-card').slideUp();
    simulator.activeSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)+1];
    $('.section#'+simulator.activeSection+'-card').slideDown();
    if (simulator.sections.indexOf(simulator.activeSection) === simulator.sections.length-1) {
      $('button#next-button').text("Confirm Order");
    }
  }
}
function onFromRight(element) {
  $(element).css({
    'pointer-events': 'all',
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
    'The greatest pizza you can imagine.',
    'You\'ll never experience a pizza this good.',
    'Cholesterol-free <span style="color:lightgray">|</span> Zero calories <span style="color:lightgray">|</span> Level 5 Vegan'
  ];
  this.prices = {
    size: {
      'Small': 600,
      'Medium': 725,
      'Large': 875,
      'Extra Large': 1050,
    },
    style: {
      'Hand-Tossed': 0,
      'Deep Dish': 200,
      'Wafer-Thin': 150,
      'Gluten-Free': 175,
    },
    cheese: {
      // prices for ["Small","Medium","Large","Extra Large"]
      'None': [0,0,0,0],
      'Normal': [0,0,0,0],
      'Extra': [100,150,200,250]
    },
    toppings: {
      // prices for ["Small","Medium","Large","Extra Large"]
      'Diced Tomatoes': [50,75,100,125],
      'Red Onions': [50,75,100,125],
      'Mushrooms': [50,75,100,125],
      'Green Peppers': [50,75,100,125],
      'Black Olives': [50,75,100,125],
      'Pepperoncinis': [50,75,100,125],
      'Jalapenos': [75,100,125,150],
      'Red Peppers': [75,100,125,150],
      'Spinach': [75,100,125,150],
      'Cauliflour': [100,125,150,200],
      'Garlic': [100,125,150,200],
      'Sprouts': [100,125,150,200]
    }
  };
  this.pizzas = [];
  this.sections = ["size","style","toppings"];
  this.activePizza;
  this.activeSection;
}
Simulator.prototype.startPizza = function() {
  var newPizza = new Pizza(this);
  this.pizzas.push(newPizza);
  this.activePizza = newPizza;
  this.activeSection = this.sections[0];
  simulator.updateDisplay(newPizza);
}
Simulator.prototype.updateDisplay = function(pizza) { 
  $('#total-price').text("Price: " + (pizza.totalPrice).toDollars());
  $('#size-display').text(pizza.size + " ");
  $('#style-display').text(pizza.style + " ");
  $('#cheese-display').text(pizza.cheese);
  $('#toppings-display').text(pizza.toppings.join(", "));
}
Simulator.prototype.produceInvoice = function(pizza) {
  pizza.invoice = new Invoice(pizza);
}
Simulator.prototype.showInvoice = function(invoice) {
  invoice.div.css({
    'width': ($('#header').width()*0.75)+'px',
    'top': '-10%'
  }).animate({
    'top': '10%'
  },400);
  invoice.confirmButton.css({
    'left': '0px',
  }).animate({
    'opacity': '1'
  },400,function(){
    $(this).addClass('pulse')
  });
  $('#overlay').fadeIn();
}
Simulator.prototype.revealElements = function() {
  onFromRight('button#previous-button');
  onFromRight('button#next-button');
  $('.section#'+simulator.activeSection+'-card').slideDown(600)
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
  $('button#previous-button').text("Cancel");
}
Simulator.prototype.hideElements = function() {
  var moveAmount = $('#pizza-card').width()+(window.innerWidth/8)
  $('#pizza-card').css({
    'transform': 'translateX(+'+(moveAmount)+'px)',
    'opacity': 0
  })
  $('button#previous-button').css({
    'opacity': '0',
    'pointer-events': 'none'
  });
  $('button#start-button').css({
    'pointer-events': 'none'
  });
  $('.section#'+simulator.activeSection+'-card').slideUp(600)
}
Simulator.prototype.getCategory = function(itemName) {
  for (category in this.prices) {
    if (Object.keys(this.prices[category]).includes(itemName)) {
      return category
    }
  }
}
function Pizza(creator) {
  this.creator = creator;
  this.infoArea = $('#pizza-info');
  this.size = "Large";
  this.style = "Hand-Tossed";
  this.cheese = "Normal";
  this.toppings = [];
  this.totalPrice = 0;
  this.invoice = undefined;
  this.totalPrice += this.costOfItem(this.size);
  this.totalPrice += this.costOfItem(this.style);
  this.totalPrice += this.costOfItem(this.cheese);
}
Pizza.prototype.sizeIndex = function(){
  return Object.keys(simulator.prices.size).indexOf(this.size)
}
Pizza.prototype.costOfItem = function(pricedItem,sizeIndex=this.sizeIndex()) {
  var price;
  for (category in this.creator.prices) {
    for (item in this.creator.prices[category]) {
      if (item === pricedItem) {
        price = this.creator.prices[category][item]
        continue;
      }
    }
  }
  if (typeof(price) === "object") {
    return price[sizeIndex]
  } else {
    return price;
  }
}
Pizza.prototype.changeItem = function(itemName,remove) {
  var category = this.creator.getCategory(itemName)
  console.log()
  if (category === "toppings") {
    if (remove) {
      this[category].splice(this[category].indexOf(itemName),1);
      console.log("takiong off cost of " + itemName + " " + this.costOfItem(itemName))
      this.totalPrice -= this.costOfItem(itemName);
    } else {
      this[category].push(itemName);
      this.totalPrice += this.costOfItem(itemName);
    }
  } else if (category === "cheese") {
    this.totalPrice -= this.costOfItem(this[category]);
    this.totalPrice += this.costOfItem(itemName);
    this[category] = itemName;
  } else {
    this.totalPrice -= this.costOfItem(this[category]);
    this.totalPrice += this.costOfItem(itemName);
    if (category === "size") { // if changing size, reevaluate toppings/extra cheese costs
      var oldSizeIndex = this.sizeIndex();
      this[category] = itemName;
      for (var i=0; i<this.toppings.length;i++) {
        var topping = this.toppings[i];
        this.totalPrice -= this.costOfItem(topping,oldSizeIndex);
        this.totalPrice += this.costOfItem(topping);
      }
      this.totalPrice -= this.costOfItem(this.cheese,oldSizeIndex);
      this.totalPrice += this.costOfItem(this.cheese);
    } else {
      this[category] = itemName;
    }
  }
}
function Invoice(pizza) {
  this.pizza = pizza;
  var cheeseName = pizza.cheese
  if (cheeseName === "None") {
    cheeseName = "No"
  } 
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
                      `+pizza.size+` Pizza<br />` + pizza.style + ` Crust<br />` + cheeseName + ` Cheese<br />
                    </div>
                    <div id="price-list" class="col-2 right-align bordered">` + 
                    (pizza.creator.prices.size[pizza.size]).toDollars() + 
                    `<br />` +
                    (pizza.creator.prices.style[pizza.style]).toDollars() + 
                    `<br />` + 
                    (pizza.creator.prices.cheese[pizza.cheese][pizza.sizeIndex()]).toDollars() + `<br />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-10 bordered"><strong>Total</strong></div>
                    <div class="col-2 right-align bordered"><strong>` + (pizza.totalPrice).toDollars() + `</strong></div>
                  </div>
                </div>
              </div>`;            
  $('body').prepend(this.html);
  this.div = $('#invoice');
  this.confirmButton = $('#final-button')
  for (var i=0; i<pizza.toppings.length; i++) {
    var topping = pizza.toppings[i];
    $('#item-list').append(" - add " + topping + "<br />");
    $('#price-list').append((pizza.creator.prices.toppings[topping][pizza.sizeIndex()]).toDollars() + "<br />");
  }
}
Number.prototype.toDollars = function() {
  var dollars = Math.floor(this / 100);
  var cents = this % 100;
  if (cents.toString().length ===1 ) {
    cents += "0";
  }
  return "$" + dollars + "." + cents;
}
jQuery.prototype.swapClass = function(oldClass,newClass) {
  $(this).addClass(newClass);
  $(this).removeClass(oldClass);
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}