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

function bodyGenerator(bc){
  let d = [],
      c = `----WebKitFormBoundary${Math.random().toString(36).substr(-8)}${Math.random().toString(36).substr(-8)}`;

  for (const key in bc) {
    d.push(`--${c}`);
    d.push(`Content-Disposition: form-data; name="${key}"`);
    d.push(``);
    d.push(bc[key]);
  }

  d.push(`--${c}--`);

  return {d, c}
}

async function clientBootCall(token, url, versionDataTs) {
  let bc = {
        'token': token,
        'only_self_subteams': 1,
        'flannel_api_ver': 4,
        'include_min_version_bump_check': 1,
        'version_ts': versionDataTs,
        '_x_reason': 'deferred-data',
        '_x_sonic': true
      }

  let {d, c} = bodyGenerator(bc)

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