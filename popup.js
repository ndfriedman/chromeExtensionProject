
alert('cannibalism')

//var x = $("#dealUrl")
//alert(x)

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    alert('hey there delilah')
	    if (request.type === 'babadook') {
	    	$(document).ready(function(){
	    		alert('hello from the farm')
	    		$("#dealUrl").attr("href", 'https://www.cnn.com/');
			})
		}
})

 
 