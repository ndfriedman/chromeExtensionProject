
//initiate the connection with the background.js with a handshake
chrome.runtime.sendMessage({data:"Handshake"},function(response){
	
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.type === 'adjustData') {
			//change HTML with jquery
	    	$(document).ready(function(){
	    		//change url
	    		$("#dealUrl").attr("href", message.data['url']);
			})
	}

});
 
 