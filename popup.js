
//initiate the connection with the background.js with a handshake
chrome.runtime.sendMessage({data:"Handshake"},function(response){

});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.type === 'adjustData') {
			//change HTML with jquery
			data = message.data
	    	$(document).ready(function(){
	    		//change url
	    		$("#dealUrl").attr("href", data['url']);
			})
	}

});

function on_link_clicked(){
	//post information to our database to log who clicked and when
	//get the username then post the link clicked info to the database
	chrome.storage.local.get(['username'], function(result) {
			var username = result.username
			var d = new Date();
			request = {'mode': 'DEV',
					   'type': 'logClick',
					   'content':{
					   		'user': username,
					   		'link': $("#dealUrl").attr("href"),
					   		'time': d.getTime() //TODO actually get a full UTC time
						}
			}
			$.post('https://noahfriedman.pythonanywhere.com/receiver', JSON.stringify(request), 
		        function(data, status){
		     })
				}
     );
}
 
//event listener for clicks
//event listener for clicks
$(document).ready(function(){
	$("#dealUrl").click( //add click listener for clicking on url
		function (event) {
			on_link_clicked()
		})
})