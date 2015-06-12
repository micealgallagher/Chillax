chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
      "frame" : "none",
      "bounds": {
      "width": 400,
      "height": 310
    },
  });

  chrome.app.window.onClosed.addListener(function() {
      console.log('Closing...boss');
  });

});