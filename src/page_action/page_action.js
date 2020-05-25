const setBoot = data => {
  console.log(data);
  channels = data.channels
  mpims = data.mpims
  document.getElementById('debugger').innerHTML += "<h2>Channels and PMs</h2><br>";

  for (let i = 0; i < channels.length; i++) {
    document.getElementById('debugger').innerHTML += channels[i].name + "<br>";
  }

  document.getElementById('debugger').innerHTML += "<br>";

  for (let i = 0; i < mpims.length; i++) {
    document.getElementById('debugger').innerHTML += mpims[i].name + "<br>";
  }
};

const setConversationHistory = data => {
  console.log(data);
  let messages = data.messages;
  document.getElementById('debugger').innerHTML += "<h2>Sample Conversation</h2><br>";
  for (let i = 0; i < messages.length; i++) {
    document.getElementById('debugger').innerHTML += messages[i].text + "<br>";
  }

  // var blob = new Blob(["array of", " parts of ", "text file"], {type: "text/plain"});
  // var url = URL.createObjectURL(blob);
  // chrome.downloads.download({
  //   url: url // The object URL can be used as download URL
  //   //...
  // });  
};

const showStatus = ls => {
  let activeTeam = ls.teams[ls.activeTeam]
  let token = activeTeam.token;
  let url = activeTeam.url
  let versionDataTs = activeTeam.versionDataTs
  document.getElementById('debugger').innerHTML += "<strong>" + ls.activeTeam + "</strong><br>";
  document.getElementById('debugger').innerHTML += token + "<br>";
  document.getElementById('debugger').innerHTML += "<br>";

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: 'slackpack-popup',
        subject: 'boot',
        context: {
          token,
          url,
          versionDataTs,
        },
      },
      setBoot
    );
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: 'slackpack-popup',
        subject: 'conversation.history',
        context: {
          token,
          url,
          versionDataTs,
        },
      },
      setConversationHistory
    );
  });
};


window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id, {
        from: 'slackpack-popup',
        subject: 'localstorage'
      },
      showStatus
    );
  });
});