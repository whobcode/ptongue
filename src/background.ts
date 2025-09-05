import * as browser from "webextension-polyfill";

/**
 * Creates a context menu item for the extension.
 * The context menu item is only shown when there is a text selection.
 */
browser.contextMenus.create({
  id: "parseltongue-selection",
  title: "Send to Parseltongue",
  contexts: ["selection"],
});

/**
 * Listens for clicks on the context menu item.
 * When the item is clicked, it opens the side panel and sends a message to the content script
 * to get the selected text.
 *
 * @param {browser.contextMenus.OnClickData} info - The click data.
 * @param {browser.tabs.Tab | undefined} tab - The tab where the click occurred.
 */
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "parseltongue-selection") {
    await browser.sidePanel.open({ windowId: tab?.windowId });
    browser.tabs.sendMessage(tab?.id ?? 0, {
      action: "getSelectedText",
    });
  }
});
