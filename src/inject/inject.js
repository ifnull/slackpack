chrome.extension.sendMessage({}, function(response) {
	let readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			console.log("Hello. This message was sent from scripts/inject.js");
		}
	}, 10);
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'slackpack-popup') && (msg.subject === 'localstorage')) {
	let ls = JSON.parse(localStorage.getItem('localConfig_v2'));
	ls.activeTeam = location.href.match(/https:\/\/app.slack.com\/client\/(T[A-Z0-9]+).*/)[1];
    response(ls);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'slackpack-popup') && (msg.subject === 'boot')) {
  	let clientBoot = clientBootCall(msg.context.token, msg.context.url, msg.context.versionDataTs);
	clientBoot.then(function(result) {
		console.log(result);
		response(result);
	}, function(err) {
		console.log(err);
		response(false);
	});
	return true;
  }
});

async function clientBootCall(token, url, versionDataTs) {
  let c = `----WebKitFormBoundary${Math.random().toString(36).substr(-8)}${Math.random().toString(36).substr(-8)}`,
  	  d = [];
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="token"`), 
  d.push(``), 
  d.push(token), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="only_self_subteams"`), 
  d.push(``), 
  d.push(1), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="flannel_api_ver"`), 
  d.push(``), 
  d.push(4), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="include_min_version_bump_check"`), 
  d.push(``), 
  d.push(1), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="version_ts"`), 
  d.push(``), 
  d.push(versionDataTs), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="_x_reason"`), 
  d.push(``), 
  d.push(`deferred-data`), 
  d.push(`--${c}`), 
  d.push(`Content-Disposition: form-data; name="_x_sonic"`), 
  d.push(``), 
  d.push(true), 
  d.push(`--${c}--`);
  const e = await fetch(url+'api/client.boot?_x_id=noversion-1590265954.489&_x_version_ts=noversion&_x_gantry=true', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-type": `multipart/form-data; boundary=${c}`
    },
    body: d.join('\n')
  });
  return e.json()
}