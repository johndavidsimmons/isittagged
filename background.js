console.log("background running!");

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({ showTags: false }, function() {
    // console.log("Showtags set to false");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "rocketmortgage" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "quickenloans" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
}); //runtime listener
