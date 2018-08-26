simulator = new Simulator();
$(function(){
  $('#blurb').html(simulator.blurbs[randomInt(0,simulator.blurbs.length-1)]);
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
jQuery.prototype.swapClass = function(oldClass,newClass) {
  $(this).addClass(newClass);
  $(this).removeClass(oldClass);
}
function handleBadgeClick(clicked,type) {
  var pizza = simulator.activePizza
  var labelText = $(clicked).text()
  if (type==="size") {
    pizza.changeItem(type,labelText)
    pizza.updatePriceDisplay();
    $('.size-badge').swapClass('badge-success','badge-secondary'); // make them all gray
    $(clicked).swapClass('badge-secondary','badge-success'); // change the clicked one
    $('#size-display').text(pizza.size + " ");
  } else if (type==="style") {
    pizza.changeItem(type,labelText)
    pizza.updatePriceDisplay();
    $('.style-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    $('#style-display').text(pizza.style + " ");
   
  } else if (type==="cheese") {
    // get long name of cheese states
    var cheeseName = "Normal Cheese"
    labelText==="None" ? cheeseName = "No Cheese" :
    labelText==="Extra" ? cheeseName = "Extra Cheese" : false;
    pizza.changeItem(type,cheeseName)
    pizza.updatePriceDisplay();
    $('.cheese-badge').swapClass('badge-success','badge-secondary');
    $(clicked).swapClass('badge-secondary','badge-success');
    $('#cheese-display').text(pizza.cheese)
  } else if (type==="toppings") {
    var remove = $(clicked).hasClass('badge-success'); // already selected?
    if (remove) {
      $(clicked).swapClass('badge-success','badge-secondary');
    } else {
      $(clicked).swapClass('badge-secondary','badge-success')
    }
    pizza.changeItem(type,labelText,remove)
    pizza.updatePriceDisplay();
    $('#toppings-display').text(pizza.toppings.join(", "));
  }
}
function handlePrevClick(clicked) {
  if ($(clicked).text()==="Cancel") {
    location.reload();
  }
  if (simulator.sections.indexOf(simulator.activeSection) < simulator.sections.length) {
    $('button#next-button').text("Next >")
  }
  if (simulator.sections.indexOf(simulator.activeSection) < simulator.sections.length) {
    var lastSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)-2]
    if (!lastSection) {
      $('button#previous-button').text("Cancel")
    } else {
      $('button#previous-button').text("< " + lastSection[0].toUpperCase()+lastSection.substr(1,lastSection.length))
    }
    $('.section#'+simulator.activeSection+'-card').slideUp()
    simulator.activeSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)-1]
    $('.section#'+simulator.activeSection+'-card').slideDown()
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
    $('.section#'+simulator.activeSection+'-card').slideUp()
    simulator.produceInvoice(simulator.activePizza)
    simulator.displayOverlay()
  } else {
    $('button#previous-button').text("< " + simulator.activeSection[0].toUpperCase()+simulator.activeSection.substr(1,simulator.activeSection.length))
    $('.section#'+simulator.activeSection+'-card').slideUp()
    simulator.activeSection = simulator.sections[simulator.sections.indexOf(simulator.activeSection)+1]
    $('.section#'+simulator.activeSection+'-card').slideDown()
    if (simulator.sections.indexOf(simulator.activeSection) === simulator.sections.length-1) {
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
    'The greatest pizza you can imagine.',
    'You\'ll never have a pizza this good.',
    'Cholesterol-free <span style="color:lightgray">|</span> Zero calories <span style="color:lightgray">|</span> Level 5 Vegan'
  ];
  this.prices = {
    sizes: {
      'Small': 600,
      'Medium': 725,
      'Large': 875,
      'Extra Large': 1050,
    },
    styles: {
      'Hand-Tossed': 0,
      'Deep Dish': 200,
      'Wafer-Thin': 150,
      'Gluten-Free': 175,
    },
    cheese: {
      // prices for ["Small","Medium","Large","Extra Large"]
      'No Cheese':[0,0,0,0],
      'Normal Cheese':[0,0,0,0],
      'Extra Cheese':[100,150,200,250]
    },
    toppings: {
      // prices for ["Small","Medium","Large","Extra Large"]
      'Diced Tomatoes': [75,100,125,150],
      'Red Onions': [75,100,125,150],
      'Mushrooms': [75,100,125,150],
      'Green Peppers': [75,100,125,150],
      'Black Olives': [75,100,125,150],
      'Pepperoncinis': [75,100,125,150],
      'Jalapenos': [100,125,175,225],
      'Red Peppers': [100,150,200,225],
      'Spinach': [100,150,200,225],
      'Cauliflour': [150,200,250,350],
      'Garlic': [200,300,450,400],
      'Sprouts': [50,75,100,125],
    }
  };
  this.pizzas = [];
  this.sections = ["size","style","toppings"]
  this.activePizza;
  this.activeSection;
  this.startPizza = function() {
    var newPizza = new Pizza(this);
    this.pizzas.push(newPizza);
    this.activePizza = newPizza;
    this.activeSection = this.sections[0]
    newPizza.addCost(newPizza.costOfItem(newPizza.size));
    newPizza.addCost(newPizza.costOfItem(newPizza.style));
    newPizza.addCost(newPizza.costOfItem(newPizza.cheese)); 
    newPizza.updatePriceDisplay();
  }
  this.displayOverlay = function() {
    $('#overlay').fadeIn();
  }
  this.produceInvoice = function(pizza) {
    pizza.invoice = new Invoice(pizza);
  }
}
function Pizza(creator) {
  this.creator = creator; // creator dictates prices
  this.infoArea = $('#pizza-info');
  this.size = "Small";
  this.style = "Hand-Tossed";
  this.cheese = "Normal Cheese";
  this.toppings = [];
  this.totalPrice = 0;
  this.invoice = undefined;
}
Pizza.prototype.sizeIndex = function(){
  return Object.keys(simulator.prices.sizes).indexOf(this.size)
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
Pizza.prototype.changeItem = function(category,item,remove) {
  if (category === "toppings") {
    if (!remove) {
      this[category].push(item);
      this.totalPrice += this.costOfItem(item);
    } else {
      this[category].splice(this[category].indexOf(item),1);
      this.totalPrice -= this.costOfItem(item);
    }
  } else if (category === "cheese") {
    this.totalPrice -= this.costOfItem(this.cheese);
    this.totalPrice += this.costOfItem(item);
    this.cheese = item;
  } else {
    this.totalPrice += this.costOfItem(item);
    this.totalPrice -= this.costOfItem(this[category]);
    if (category === "size") { // if changing size, reevaluate toppings/extra cheese costs
      var oldSizeIndex = this.sizeIndex();
      this[category] = item;
      for (var i=0; i<this.toppings.length;i++) {
        var topping = this.toppings[i];
        this.totalPrice -= this.costOfItem(topping,oldSizeIndex);
        this.totalPrice += this.costOfItem(topping);
      }
      this.totalPrice -= this.costOfItem(this.cheese,oldSizeIndex);
      this.totalPrice += this.costOfItem(this.cheese);
    } else {
      this[category] = item;
    }
  }
}
Pizza.prototype.addCost = function(cost) {
  this.totalPrice += cost;
}
Pizza.prototype.subtractCost = function(cost) {
  this.totalPrice -= cost;
}
Pizza.prototype.updatePriceDisplay = function(){ 
  $('#total-price').text("Price: "+toDollars(this.totalPrice));
}
function Invoice(pizza) {
  this.pizza = pizza;
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
  $('body').prepend(this.html);
  this.div = $('#invoice');
  this.div.css({
    'width': ($('#header').width()*0.75)+'px'
  })
  this.confirmButton = $('#final-button')
  this.div.css({
    'top': '-10%'
  });
  this.div.animate({
    'top': '10%'
  },400)
  this.confirmButton.css({
    'left': '0px',
  }).animate({
    'opacity': '1'
  },400,function(){
    $(this).addClass('pulse')
  });
  this.itemList = $('#item-list');
  this.priceList = $('#price-list');
  this.itemList.append(pizza.size + " Pizza<br />");
  this.priceList.append(toDollars(pizza.creator.prices.sizes[pizza.size])+ "<br />");
  this.itemList.append(pizza.style + " Crust<br />");
  this.priceList.append(toDollars(pizza.creator.prices.styles[pizza.style])+ "<br />");
  this.itemList.append(pizza.cheese + "<br />");
  this.priceList.append(toDollars(pizza.creator.prices.cheese[pizza.cheese][pizza.creator.activePizza.sizeIndex()])+ "<br />");
  for (var i=0; i<pizza.toppings.length; i++) {
    var topping = pizza.toppings[i];
    this.itemList.append(" - add " + topping + "<br />");
    this.priceList.append(toDollars(pizza.creator.prices.toppings[topping][pizza.creator.activePizza.sizeIndex()])+"<br />");
  }
}
toDollars = function(num) {
  var dollars = Math.floor(num/100)
  var cents = num%100
  if (cents.toString().length===1) {
    cents += "0"
  }
  return "$" + dollars + "." + cents
}
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}