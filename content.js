
///CODE FOR PARSING THE PAGE's HTML

//TODO these functions probably should live elsewhere
function getItemNameByXpath(mode) {
  pathItemName = ''
  if(mode == 'checkout'){
    pathItemName = './/div[@class="a-row breakword"]//span//text()'
  }
  if(mode == 'productPage'){
    pathItemName = './/span[@id="productTitle"]//text()'
  }

  return document.evaluate(pathItemName, document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
}

function getItemPriceByXpath(mode) {
  pathItemPrice = ''
  if(mode == 'checkout'){
    alert('not implemented yet, returning 150 as a dummy val')
    return '150'
  }
  if(mode == 'productPage'){
    pathItemPrice = './/span[@class="a-size-medium a-color-price priceBlockBuyingPriceString"]//text()'
  }

  var result = document.evaluate(pathItemPrice, document, null, XPathResult.ANY_TYPE, null).iterateNext()
  if(result == null){
    return 'unknown' //TODO have a more informative value returned
  }
  else{
    return result.textContent;
  }
}

//////////////////////////////////////

//NORMALIZES THE ITEM NAME TO OUR DB ACCEPTABLE FORMAT:
//spaces become _
function normalizeItemName(itemName){
  itemName = itemName.trim();//remove new lines from the item TODO have xpath do this
  itemName = itemName.replace(/\s+/g, '_')
  itemName = itemName.replace(/\W+/g, '')
  itemName = itemName.toUpperCase()
  return itemName
}

function normalizeItemPrice(itemPrice){
  itemPrice = itemPrice.replace(/\$/g, '')
  return itemPrice
}

//ACTION FUNCTIONS
//WHEN THE ICON IS CLICKED OPEN THE LOGIN WINDOW
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      chrome.runtime.sendMessage({type:'open_login_info'})
    }
  }
);

function find_item_and_query(mode){
  itemName = getItemNameByXpath(mode)
  itemName = normalizeItemName(itemName)
  itemPrice = getItemPriceByXpath(mode)
  itemPrice = normalizeItemPrice(itemPrice)
  var items = [{'itemName': itemName, 'price': itemPrice}]
  chrome.runtime.sendMessage({type:'open_deals_page', info:items})
}

//ACTUALLY set up a popover 
//currently just sets up a clickable button
function query_from_item_page(){

  var title = document.getElementById('productTitle');
  
  htmlToInsert = `
                  <a href="#" data-toggle="popover" title="Popover Header"
                  data-content="a message">Toggle popover</a>
                  `
  title.insertAdjacentHTML('afterend', htmlToInsert);


  $('[data-toggle="popover"]').popover({
    html: true,
    //content : function() {
    //    return loadContent($(this).data('popup.html'))
    //},
    placement : 'top',
    trigger : 'hover'
  });
  //title.insertAdjacentHTML('afterend', htmlToInsert);

  //LOAD THE BOOTSTRAP POPOVER STUFF HERE
  //insert_script_element('script', 'jquery-3.4.1.js')
  //insert_script_element('script', 'Popper.js')
  //insert_script_element('script', 'bootstrap-4.3.1-dist/js/bootstrap.min.js')
  //var $j = jQuery.noConflict();
  //$('[data-toggle="popover"]').popover();

  $(function(){ //Set an on click action for when we click the query page to open stuff up
    $('#queryDbButton').on('click',function(){
        find_item_and_query(mode='productPage')
    });
  });


}

//THIS IS THE CODE THAT RUNS WHEN YOU LAND ON THE PROPER WEBPAGE (AMAZON checkout)
$(document).ready(function(){
  var href = window.location.href
  varCheckoutPageStr = 'https://www.amazon.com/gp/buy'
  if(~href.indexOf(varCheckoutPageStr)){
    find_item_and_query(mode='checkout')
  }
  else{
    //TODO only trigger this on specific amazon pages, with different logic for each
    query_from_item_page()
  }
})



