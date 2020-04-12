
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  	});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);


function adjust_window_url(tabId){
  //alert($( "#" + tabId)
  alert('mind is ongodng')
  $(document).ready(function(){
      console.log('hello')
      console.log($("*"));
  });
  //console.log($(Document).$("[href]"))
  //$("#dealUrl").href = 'https//:msnbc.com'
}

function launch_window(){
  alert('launch commencing')
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
            alert(tab.id)
            alert('message into the ether')
            //chrome.runtime.sendMessage(tab.id, {type:'babadook'})
          }
  )
}

//Function that opens the deals page
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'open_deals_page') {
       
       /* fetch(
          'https://noahfriedman.pythonanywhere.com/receiver', 
        { 
            method: 'POST', 
            body: JSON.stringify(request.info)
        }
      )
      //.then(launchWindow())
      */

      $.post('https://noahfriedman.pythonanywhere.com/receiver', JSON.stringify(request.info), 
        function(data, status){
          alert('postmates')
          alert(data)
          launch_window()
        })
    }
});

