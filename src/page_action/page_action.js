const setBoot = data => {
  console.log(data);
  channels = data.channels
  mpims = data.mpims

  for (let i = 0; i < channels.length; i++) {
    document.getElementById('debugger').innerHTML += channels[i].name + "<br>";
  }  
  
  document.getElementById('debugger').innerHTML += "<br>";

  for (let i = 0; i < mpims.length; i++) {
    document.getElementById('debugger').innerHTML += mpims[i].name + "<br>";
  }  

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
      tabs[0].id,
      {
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
  });
};

window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
         from: 'slackpack-popup', 
         subject: 'localstorage'
      },
      showStatus
    );
  });
});

