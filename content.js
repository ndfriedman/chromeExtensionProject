
//FUNCTION for getting text of a webpage
function getText(){
    return document.body.innerText
}
function getHTML(){
    return document.body.outerHTML
}
console.log(getText()); 


//ACTION FUNCTIONS
//WHEN THE ICON IS CLICKED OPEN THE LOGIN WINDOW
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      chrome.runtime.sendMessage({type:'open_login_info'})
    }
  }
);


//THIS IS THE CODE THAT RUNS WHEN YOU LAND ON THE PROPER WEBPAGE (AMAZON checkout)

var text = getText(); 

let reItemName = /Items shipped from Amazon\.com\n(.*)/
let reItemPrice = /\n\$(.*)/

var resultItemName = text.match(reItemName)
var itemName = resultItemName[1]
var resultItemPrice = text.match(reItemPrice)
var itemPrice = resultItemPrice[1]

console.log(resultItemName)

//alert('You are buying ' + itemName + ' for ' + itemPrice + ' dollars') 
var items = [{'itemName': itemName, 'price': itemPrice}]

chrome.runtime.sendMessage({type:'open_deals_page', info:items})
//doWork(itemName, itemPrice);


//let re = new RegExp('ab+c')
//alert(var)

//var firstHref = $("a[href^='http']").eq(0).attr("href");
//alert(firstHref);
