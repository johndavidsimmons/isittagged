# Is It Tagged

## A Chrome Extension

---

![is it tagged demo gif](https://i.imgur.com/sNKC1pD.gif)

**Is It Tagged** is a Chrome extension for highlighting elements on a webpage via a CSS selector. It was developed to allow Quicken Loans' team members to inspect their pages for click attribute tags without having to open the developer tools.

## Installation & Usage

- Download from the Chrome Extensions Store or load unpacked in extension development mode
- Navigate to any quickenloans.com or rocketmortgage.com domain (subdomains included)
- Type a CSS Selector and click "Show Tags"
- While any valid selector will highlight elements, the main selector used for click tracking is **[data-analytics-click]**

## To Do

- [x] Remove URL limitations so extension can be used anywhere
- [x] Unhide hidden items if highlighted
- [ ] Reset UI when user switches between windows/tabs
- [ ] Add Google Analytics to popup
