
//FUNCTION for getting text of a webpage
function getText(){
    return document.body.innerText
}
function getHTML(){
    return document.body.outerHTML
}
console.log(getText()); 


//TODO these functions probably should live elsewhere
function getItemNameByXpath() {
  pathItemName = './/div[@class="a-row breakword"]//span//text()'
  return document.evaluate(pathItemName, document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
}

function 

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


itemName = getItemNameByXpath()
itemName = itemName.trim();//remove new lines from the item TODO have xpath do this
itemPrice = 150

/*var text = getText(); 

let reItemName = /Items shipped from Amazon\.com\n(.*)/
let reItemPrice = /\n\$(.*)/

var resultItemName = text.match(reItemName)
var itemName = resultItemName[1]
var resultItemPrice = text.match(reItemPrice)
var itemPrice = resultItemPrice[1]

console.log(resultItemName)

//alert('You are buying ' + itemName + ' for ' + itemPrice + ' dollars') */

console.log(itemName)
var items = [{'itemName': itemName, 'price': itemPrice}]
console.log(items)
alert(JSON.stringify({type:'open_deals_page', info:items}))
chrome.runtime.sendMessage({type:'open_deals_page', info:items})


