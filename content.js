
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

//function to insert html code to intialize the popover on the webpage

function initialize_modal(html, data){

 // find_item_and_query('productPage')

  let title = document.getElementById('productTitle');

  title.insertAdjacentHTML('afterend', html);

  var modal = 
   document.getElementById("myModal");

   // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onmouseover = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}

function extract_item_info_from_page(){
  //promisified to allow for sequential operation
  return new Promise((resolve, reject) => {
    itemName = getItemNameByXpath('productPage')
    itemName = normalizeItemName(itemName)
    itemPrice = getItemPriceByXpath('productPage')
    itemPrice = normalizeItemPrice(itemPrice)
    var items = [{'itemName': itemName, 'price': itemPrice}]
    resolve(items)
  })
}

//makes a post request to the database
function post_request_to_database(info, dbUrl='https://noahfriedman.pythonanywhere.com/receiver'){

  //this whole function returns a promise so we can operate sequentially to render the webpage
  return new Promise((resolve, reject) => {
    payload = {}
    payload['type'] = 'dealQuery'
    payload['content'] = info

    var d = new Date();
    payload['logParams'] = {
      'user': 'Noah',
      'mode': 'DEV',
      'time': d.getTime()
    }

    $.post(dbUrl, JSON.stringify(payload)).then(
      res => resolve(JSON.parse(res))
    ) 
  })
}


//omnibus function: extracts our current item name, queries database, then sets up the popover
function query_from_item_page(){

  extract_item_info_from_page().then(
    res => post_request_to_database(res).then(
      function(res){
        //to load the html from a file into a variable called html we need to use chrome runtime send message
        chrome.runtime.sendMessage({cmd: "read_file", path:'module.html'}, function(html){
        initialize_modal(html, res)
      });
    })
  )
  
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



/*$(function(){ //Set an on click action for when we click the query page to open stuff up
    $('#queryDbButton').on('click',function(){
        find_item_and_query(mode='productPage')
    });
  });*/



//DEPRECATED CODE

/*function initialize_popover(popoverHtml){
    alert(popoverHtml)
    var title = document.getElementById('productTitle');
    htmlToInsert = `
                  <a href="#" data-html="true" data-toggle="popover" title="Popover Header"
                  data-content= "${popoverHtml}"> Toggle popover</a>
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
}*/


  //title.insertAdjacentHTML('afterend', htmlToInsert);

  //LOAD THE BOOTSTRAP POPOVER STUFF HERE
  //insert_script_element('script', 'jquery-3.4.1.js')
  //insert_script_element('script', 'Popper.js')
  //insert_script_element('script', 'bootstrap-4.3.1-dist/js/bootstrap.min.js')
  //var $j = jQuery.noConflict();
  //$('[data-toggle="popover"]').popover();

