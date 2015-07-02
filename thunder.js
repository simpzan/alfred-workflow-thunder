#!/usr/bin/env osascript -l JavaScript

ObjC.import("AppKit");

const activateApp = function(appName, appID) {
  const getRunningApp = function(appID) {
    const apps = $.NSRunningApplication.runningApplicationsWithBundleIdentifier(appID);
    if (apps.count === "0") return null;  // app.count return string type.
    return apps.objectAtIndex(0);
  };

  const app = getRunningApp(appID);
  if (app) {
    app.activateWithOptions(1 << 1);
  } else {
    $.NSWorkspace.sharedWorkspace.launchApplication(appName);
    delay(0.8); // wait for app initialization.
  }
};

const openAddDownloadDialog = function(urlToDownload) {
  const nc = $.NSDistributedNotificationCenter.defaultCenter;
  const notificationName = "XLNewTaskNotification";
  const senderAppID = "com.xunlei.thunderplugin";
  const dict = {"url" : urlToDownload};
  nc.postNotificationNameObjectUserInfo(notificationName, senderAppID, dict);
}

const getDownloadUrl = function(argv) {
  const getClipboardContent = function() {
    const app = Application('System Events');
    app.includeStandardAdditions = true;
    const result = app.theClipboard();
    console.log("clipboard content: [" + result + "]");
    return result;
  };
  const isValidUrl = function(url) {
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return urlRegex.test(url);
  };

  if (argv.length > 0) {
    const arg = argv[0];
    if (isValidUrl(arg))  return arg;
  }

  const content = getClipboardContent().trim();
  if (isValidUrl(content))  return content;

  return null;
}

const run = function(argv) {
  const urlToDownload = getDownloadUrl(argv);
  if (urlToDownload === null) return;

  activateApp("Thunder", "com.xunlei.Thunder");
  openAddDownloadDialog(urlToDownload);
}
