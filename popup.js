function setUp() {
  //Input box
  const selectorInput = document.getElementById("selectorInput");
  const currentSelector = document.getElementById("currentSelector");
  const saveSelector = document.getElementById("saveSelector");
  const btn = document.getElementById("tags");
  const params = {
    active: true,
    currentWindow: true
  };

  // Show tags button event listener
  btn.addEventListener("click", function() {
    chrome.storage.local.get(["showTags"], function(result) {
      // flip the value of showtags
      let showTags = result.showTags;
      chrome.storage.local.set({ showTags: !showTags }, function() {
        console.log("Showtags flipped in storage");
      });
    });
  });

  //for listening any message which comes from runtime
  chrome.runtime.onMessage.addListener(messageReceived);

  // received message handler
  function messageReceived(request) {
    // The number of tagged nodes sent back by content.js
    // Then update the popup to show that number
    if (request.txt === "num of tagged nodes") {
      let { number } = request;
      if (number) {
        document.getElementById("number").innerHTML = `${number}`;
      } else {
        document.getElementById("number").innerHTML = "";
      }
    }

    if (request.txt === "change button to hide tags") {
      btn.innerHTML = "Hide Tags";
    }

    if (request.txt === "change button to show tags") {
      btn.innerHTML = "Show Tags";
      chrome.storage.local.set({ showTags: false }, function() {
        console.log("Showtags flipped in storage");
      });
    }
  }

  // Handle user input on the current Selector input box
  // Whatever is in the input box will be the current selector
  // Even if a selector is already saved
  selectorInput.addEventListener("keyup", () => {
    // Output the current selector to the popup
    let { value } = selectorInput;

    // if there is a value enable the button
    if (!value) {
      btn.className = "disabled";
    } else if (value) {
      btn.className = "";
    }

    // store the value on keyup
    chrome.storage.local.set({ currentSelector: value }, function() {
      console.log(`Selector set to: ${value}`);
    });

    chrome.storage.local.set({ showTags: false }, function() {
      console.log("Showtags flipped in storage");
    });
  });

  // find the selector in storage when the window opens
  window.addEventListener("DOMContentLoaded", event => {
    let savedSelector;
    //get value from storage
    chrome.storage.local.get(["currentSelector"], function(result) {
      savedSelector = result.currentSelector;
      if (savedSelector) {
        selectorInput.value = savedSelector;
      } else if (!saveSelector) {
        btn.className = "disabled";
      }
    });
  });
}

setUp();
