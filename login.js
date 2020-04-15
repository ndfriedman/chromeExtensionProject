//do a handshake to initiate communications with the background page
chrome.runtime.sendMessage({data:"Handshake"},function(response){

});

$(document).ready(function(){
	$("#submitButton").click( //add click listener for clicking on url
		function (event) {
			//chrome.storage.sync.get(['key'], function(result) {
          	//	console.log('Value currently is ' + result.key);
			//});
			chrome.storage.local.set(
			{'username': $("#uname").val()}, function () {});
		})
})