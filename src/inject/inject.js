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

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'slackpack-popup') && (msg.subject === 'conversation.history')) {
    let clientBoot = conversationHistoryCall(msg.context.token, msg.context.url, msg.context.versionDataTs);
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

async function conversationHistoryCall(token, url, versionDataTs) {
  let bc = {
        'channel': 'GSVHPMCRY',
        'limit': 28,
        'ignore_replies': true,
        'include_pin_count': true,
        'inclusive': true,
        'no_user_profile': true,
        'token': token,
        '_x_reason': 'message-pane/requestHistory',
        '_x_mode': 'online',
        '_x_sonic': true,
      }

    // messages = []
    // lastTimestamp = None
    // while(True):
    //     response = pageableObject.history(
    //         channel = channelId,
    //         latest    = lastTimestamp,
    //         oldest    = 0,
    //         count     = pageSize
    //     ).body

    //     messages.extend(response['messages'])

    //     if (response['has_more'] == True):
    //         lastTimestamp = messages[-1]['ts'] # -1 means last element in a list
    //         sleep(1) # Respect the Slack API rate limit
    //     else:
    //         break

    // messages.sort(key = lambda message: message['ts'])
    // return messages


  let {d, c} = bodyGenerator(bc);
  const e = await fetch(url+'api/conversations.history?_x_id=f328c0e5-1590365880.025&_x_csid=I1a_7Mglub0&slack_route=T024F6RA7&_x_version_ts=1590192872&_x_gantry=true', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-type": `multipart/form-data; boundary=${c}`
    },
    body: d.join('\n')
  });
  return e.json()
}

// TODO
// getHistory(pageableObject, channelId, pageSize = 100):
// mkdir(directory):
// parseTimeStamp( timeStamp ):
// channelRename( oldRoomName, newRoomName ):
// writeMessageFile( fileName, messages ):
// parseMessages( roomDir, messages, roomType ):
// filterConversationsByName(channelsOrGroups, channelOrGroupNames):
// promptForPublicChannels(channels):
// fetchPublicChannels(channels):
// dumpChannelFile():
// filterDirectMessagesByUserNameOrId(dms, userNamesOrIds):
// promptForDirectMessages(dms):
// fetchDirectMessages(dms):
// promptForGroups(groups):
// fetchGroups(groups):
// getUserMap():
// dumpUserFile():
// doTestAuth():
// bootstrapKeyValues():
// selectConversations(allConversations, commandLineArg, filter, prompt):
// anyConversationsSpecified():
// dumpDummyChannel():
// finalize():

