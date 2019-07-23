// by definition, the content script does not run until the page has loaded
//the content script is sandboxed and only knows whats happening on the page
// console.log("Chrome extension ready to go!!!!");

// store the value of the current Selector when you receive it from a message
// or get it from storage
let currentSelector;
// Get the value of the current selector from storage on runtime
// if exists, send to popup
chrome.storage.local.get(["currentSelector"], function(result) {
  // selector from storage
  currentSelector = result.currentSelector;
});

/***********************/
/***helper functions****/
/***********************/
// apply border to tagged elements
const applyBorder = el => {
  el.style["outline-width"] = "2px";
  el.style["outline-style"] = "dotted";
  el.style["outline-color"] = "red";
  el.style["outline-offset"] = "5px";
};

const removeBorder = el => {
  el.style["outline-width"] = "";
  el.style["outline-style"] = "";
  el.style["outline-color"] = "";
  el.style["outline-offset"] = "";
};

const getTag = selector => {
  let ret;
  if (/^\[.+\]$/.test(selector)) {
    ret = el.getAttribute(selector.slice(1, -1));
  } else {
    ret = el.getAttribute(selector);
  }
  return ret;
};

const applyShadow = el => {
  const shadowCSS = "20px 20px 22px -1px rgba(0,0,0,0.75)";
  el.style["-webkit-box-shadow"] = shadowCSS;
  el.style["-moz-box-shadow"] = shadowCSS;
  el.style["box-shadow"] = shadowCSS;
};

const isHidden = element => {
  return (
    window.getComputedStyle(element, null).getPropertyValue("visibility") ===
    "hidden"
  );
};

/***********************/

// Handler for when the current selector changes in storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];

    if (key === "currentSelector") {
      currentSelector = storageChange.newValue;
      //send message to popup to reset number
      chrome.runtime.sendMessage({ txt: "num of tagged nodes", number: 0 });

      // change button to show tags
      chrome.runtime.sendMessage({ txt: "change button to show tags" });
    }

    if (key === "showTags") {
      // console.log("showTags has changed");
      let showTags = storageChange.newValue;
      let taggedElements = document.querySelectorAll(`${currentSelector}`);
      let numOfElements = taggedElements.length;
      let hiddenElements = [...taggedElements].filter(
        el => isHidden(el) == true
      );
      let numOfHiddenElements = hiddenElements.length;
      let taggedParents = [];

      // Send number back to popup
      // popup will show number when it receives this
      let message = {
        txt: "num of tagged nodes",
        number: numOfElements
      };
      chrome.runtime.sendMessage(message);
      //if true
      if (showTags) {
        // highlight new elements
        if (numOfElements > 0) {
          for (el of taggedElements) {
            // if element visible on page

            if (isHidden(el)) {
              el.style.visibility = "visible";
            }

            applyBorder(el);

            // Styling for the tag
            // Add as a string instead of individually
            let tag = getTag(currentSelector);
            let styles =
              "color:red; position: absolute; background-color: lemonchiffon; visibility: visible; z-index: 9999999";
            if (tag) {
              el.insertAdjacentHTML(
                "beforeend",
                `<div class="tagflag" style="${styles}">${tag}</div>`
              );
            }
          }
        }
        // change button text to 'Hide Tags'
        let hideMessage = {
          txt: "change button to hide tags"
        };
        chrome.runtime.sendMessage(hideMessage);
      }

      if (!showTags) {
        if (numOfElements > 0) {
          for (el of taggedElements) {
            // hide styles
            removeBorder(el);
            // remove tag flag
            for (el of document.querySelectorAll(".tagflag")) {
              el.parentNode.removeChild(el);
            }
          }
          // change button text to 'show Tags'
          let showMessage = {
            txt: "change button to show tags"
          };
          chrome.runtime.sendMessage(showMessage);
        }
        //send message to popup to reset number
        chrome.runtime.sendMessage({ txt: "num of tagged nodes", number: 0 });
      }
    }
  }
});
