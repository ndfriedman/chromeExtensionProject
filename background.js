
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  	});
});


//LOGIN INFO CODE
//In the future we will actually use O-auth as detailed here https://developer.chrome.com/extensions/tut_oauth
//For now we can just click on the extension and manually set our username
chrome.storage.local.set({
    'username': 'notSpecified'
}, function () {
    console.log("Storage Succesful");
});

//LISTENER TO OPEN THE LOGIN WINDOW--called by content.js who is listening for a clicked action
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.type === "open_login_info" ) {
        chrome.tabs.create({
            url: chrome.extension.getURL('login.html'),
            active: false
        }, function(tab) {
                chrome.windows.create({
                tabId: tab.id,
                type: 'panel',
                height: 200, width:200,
                focused: true, left:2000
                // incognito, top, left, ...
            });

            //add a listener to communicate
            //respond to the handshake with a url
            /*chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
              chrome.runtime.sendMessage(
                  {type: 'adjustData', data:data},
                  function(response){//DO nothing?? 
                  });
            });*/
          }) 
    }});

//Launches the popup window with deal information
//uses a handshake to establish communication with popup.js then adjust its parameters
function launch_window(data){
  chrome.tabs.create({
            url: chrome.extension.getURL('popup.html'),
            active: false
        }, function(tab) {
                chrome.windows.create({
                tabId: tab.id,
                type: 'panel',
                height: 200, width:200,
                focused: true,
                // incognito, top, left, ...
            });

            //add a listener to communicate
            //respond to the handshake with a url
            chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
              chrome.runtime.sendMessage(
                  {type: 'adjustData', data:data},
                  function(response){//DO nothing?? 
                  });
            });
          }
  )
}


//Function that opens the deals page
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'open_deals_page') {

      //TEMP
      payload = {}
      payload['type'] = 'dealQuery'
      payload['content'] = request.info

      var d = new Date();
      payload['logParams'] = {
        'user': 'Noah',
        'mode': 'DEV',
        'time': d.getTime()
      }

      ///TEMP CHANGE STUFF
      alert(request.info)
      alert(JSON.stringify(payload))

      //POST to server then launch popup window in the callback
      $.post('https://noahfriedman.pythonanywhere.com/receiver', JSON.stringify(payload), 
        function(data, status){
          data = JSON.parse(data)
          alert(JSON.stringify(data))
          launch_window(data)
        })
    }
});

