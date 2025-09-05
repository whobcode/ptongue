import * as browser from "webextension-polyfill";

/**
 * Listens for messages from the background script.
 * When a message with the action "getSelectedText" is received,
 * it gets the selected text from the window and sends it to the side panel.
 *
 * @param {any} message - The message received from the background script.
 */
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "getSelectedText") {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      browser.runtime.sendMessage({
        action: "updateElementText",
        text: selectedText,
      });
    }
  }
});
