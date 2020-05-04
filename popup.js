
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
	    		$("#itemPrice").text(data['price']);
			})
	}

});

function on_link_clicked(){
	//post information to our database to log who clicked and when
	//get the username then post the link clicked info to the database
	alert('yodelabhh')
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
 
$(document).ready(function(){

	$('[data-toggle="popover"]').popover();
	//const template = Handlebars.compile(document.querySelector('#result').innerHTML);

	//event listener for clicks
	$("#dealUrl").click( //add click listener for clicking on url
		function (event) {
			on_link_clicked()
		})
})


//ADD POPOVER SOURCE MANUALLY
chrome.tabs.executeScript({code:
    "document.body.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js';"
});
chrome.tabs.executeScript({code:
    "document.body.appendChild(document.createElement('script')).src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js';"
});

