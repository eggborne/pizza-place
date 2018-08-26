simulator = new Simulator();
$(function(){
  $('#blurb').text(simulator.blurbs[randomInt(0,simulator.blurbs.length)]);
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
  $('button#previous-button').text("Cancel")
}
jQuery.prototype.swapClass = function(oldClass,newClass) {
  $(this).addClass(newClass);
  $(this).removeClass(oldClass);
}
function handleBadgeClick(clicked,type) {
  var pizza = simulator.activePizza
  if (type==="size") {
    $('.size-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    console.log("found cost " + pizza.costOfItem(pizza.size) + " for " + pizza.size)
    pizza.subtractCost(pizza.costOfItem(pizza.size));
    var oldSizeIndex = pizza.sizeIndex()
    pizza.size = $(clicked).text();
    for (var i=1; i<pizza.toppings.length;i++) {
      var topping = pizza.toppings[i]
      pizza.subtractCost(pizza.costOfItem(topping,oldSizeIndex))
      pizza.addCost(pizza.costOfItem(topping))
    }
    $('#size-display').text(pizza.size + " ");
    pizza.addCost(pizza.costOfItem(pizza.size));
    pizza.updatePriceDisplay();
  } else if (type==="style") {
    $('.style-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    pizza.subtractCost(pizza.costOfItem(pizza.style));
    pizza.style = $(clicked).text();
    $('#style-display').text(pizza.style + " ");  
    pizza.addCost(pizza.costOfItem(pizza.style));
    pizza.updatePriceDisplay();
  } else if (type==="cheese") {
    var sizeIndex = pizza.sizeIndex()
    var cheeseName = "Cheese"
    $(clicked).text()==="None" ? cheeseName = "No Cheese" :
    $(clicked).text()==="Extra" ? cheeseName = "Extra Cheese" : false
    $('.cheese-badge').swapClass('badge-success','badge-secondary')
    $(clicked).swapClass('badge-secondary','badge-success')
    pizza.subtractCost(pizza.costOfItem(pizza.toppings[0]));
    pizza.toppings[0] = cheeseName
    pizza.addCost(pizza.costOfItem(cheeseName));
    pizza.updatePriceDisplay();
    $('#toppings-display').text(pizza.toppingsList())
  } else if (type==="toppings") {
    var sizeIndex = pizza.sizeIndex()
    if ($(clicked).hasClass('badge-success')) {
      $(clicked).swapClass('badge-success','badge-secondary')
      pizza.toppings.splice(pizza.toppings.indexOf($(clicked).text()),1)
      pizza.subtractCost(pizza.costOfItem($(clicked).text()))
    } else {
      $(clicked).swapClass('badge-secondary','badge-success')
      pizza.toppings.push($(clicked).text())
      pizza.addCost(pizza.costOfItem($(clicked).text()))
    }
    pizza.updatePriceDisplay()
    $('#toppings-display').text(pizza.toppingsList())
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
    "The greatest pizza you could ever imagine."
  ];
  this.prices = {
    sizes: {
      'Small': 600,
      'Medium': 750,
      'Large': 900,
      'Extra Large': 1200,
    },
    styles: {
      'Hand-Tossed': 0,
      'Deep Dish': 300,
      'Wafer-Thin': 200,
      'Gluten-Free': 350,
    },
    cheeses: {
      'No Cheese':[0,0,0,0],
      'Cheese':[0,0,0,0],
      'Extra Cheese':[150,250,350,450]
    },
    toppings: {
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
  };
  this.pizzas = [];
  this.sections = ["size","style","toppings"]
  this.activePizza = undefined;
  this.activeSection = undefined;
  this.startPizza = function() {
    var newPizza = new Pizza();
    this.pizzas.push(newPizza);
    newPizza.creator = this;
    this.activePizza = newPizza;
    this.activeSection = this.sections[0]
    newPizza.addCost(newPizza.costOfItem("Small"));
    newPizza.addCost(newPizza.costOfItem("Hand-Tossed"));
    newPizza.updatePriceDisplay();
    console.log(newPizza.costOfItem("Garlic"))
  }
  this.displayOverlay = function() {
    $('#overlay').fadeIn();
  }
  this.produceInvoice = function(pizza) {
    pizza.invoice = new Invoice(pizza);
  }
}
function Pizza() {
  this.creator;
  this.infoArea = $('#pizza-info');
  this.size = "Small";
  this.style = "Hand-Tossed";
  this.toppings = ["Cheese"];
  this.totalPrice = 0;
  this.invoice = undefined;
  this.sizeIndex = function(){
    return Object.keys(simulator.prices.sizes).indexOf(this.size)
  }
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
  console.log("size index is " + sizeIndex)
  if (typeof(price) === "object") {
    console.log("returning " + price[sizeIndex] + " for topping " + pricedItem)
    return price[sizeIndex]
  } else {
    console.log("returning " + price + " for " + pricedItem)
    return price
  }
}
Pizza.prototype.addCost = function(cost) {
  console.log("adding " + cost)
  this.totalPrice += cost;
}
Pizza.prototype.subtractCost = function(cost) {
  console.log("subtracting " + cost)

  this.totalPrice -= cost
}
Pizza.prototype.updatePriceDisplay = function(){ 
  console.log("total " + this.totalPrice)
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