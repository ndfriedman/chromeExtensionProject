
//FUNCTION for getting text of a webpage
function getText(){
    return document.body.innerText
}
function getHTML(){
    return document.body.outerHTML
}
console.log(getText()); 


//ACTION FUNCTIONS
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      alert('hi there you clicked, taking you to barnes and noble for a better deal');

      chrome.runtime.sendMessage({"message": "open_new_tab", "url": 'https://www.barnesandnoble.com/'});
    }
  }
);


//SERVER / FLASK FUNCTIONALITY

//renders the results of our post query to the user
function render_results(results){
	alert(results)
}

//TODO make it work for more than one item
function doWork(itemName, itemPrice) {

	var items = [{'itemName': itemName, 'price': itemPrice}]
	console.log(JSON.stringify(items))
	// ajax the JSON to the server
	$.post('https://noahfriedman.pythonanywhere.com/receiver', JSON.stringify(items), 
		function(data, status){
			console.log(data)
			chrome.runtime.sendMessage({type:'open_deals_page', info:data}) //, 
				//function (response) {
				//	console.log(response);
    		//})

			//console.log(document.querySelectorAll('*[id]'))
			//document.getElementById('dealUrl').attribute = data['url']
			alert('completed')
		});
	// stop link reloading the page
 //event.preventDefault();
}

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
