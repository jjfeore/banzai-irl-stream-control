require('dotenv').config();

const NodeMediaServer = require('node-media-server'),
    tmi = require('tmi.js'),
    OBSWebSocket = require('obs-websocket-js');

let userEndedStream = false,
    currScene = '';

// Configure Node media server
const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
//   auth: {
//     play: true,
//     publish: true,
//     secret: process.env.RTMPPASS
//   }
};
 
let nms = new NodeMediaServer(nmsConfig);
nms.run();

// Configure OBS websocket
const obs = new OBSWebSocket();
obs.connect({
    address: 'localhost:4444',
    password: process.env.OBSWSPASS
}).then(() => {
    console.log(`Connected to OBS via Websocket`);
}).catch(err => {
    console.log('Error on OBS Websocket connect: ' + err);
});

// Configure Twitch chat client
const twitchOptions = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: process.env.TWITCHUSER,
        password: process.env.TWITCHPASS
    },
    channels: ['#' + process.env.TWITCHUSER]
};

const twitchClient = new tmi.client(twitchOptions);
twitchClient.connect();

// On RTMP connection to server
nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
    let toScene = process.env.IRLSCENE;
    userEndedStream = false;

    obs.getStreamingStatus().then(function (data) {
        if (data.streaming) {
            setNewScene(toScene);
        } else {
            startNewStream(toScene);
        }
    });
});

// On RTMP disconnect from server
nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
    if ((currScene == 'IRL') && !userEndedStream) {
        console.log('RTMP connection lost without disconnect command');
        setNewScene(process.env.TECHSCENE);
    }
});

// On Twitch message
twitchClient.on('chat', function (channel, user, message, self) {
    if (self || (user.mod && process.env.ALLOWMOD == 1) || (user.badges && user.badges.broadcasters && user.badges.broadcasters == '1') || user.username == twitchClient.getUsername()) {
        console.log('Parsing message from self or mod');
        // If the message is the switch scene command
        if (message.toLowerCase().startsWith('!scene ')) {
            ignoreTechScene = true;
            setNewScene(message.slice(7));
        // If the message is the end stream command
        } else if (message.toLowerCase().startsWith('!disconnect')) {
            let streamStatus = obs.getStreamingStatus();
            streamStatus.then(function (data) {
                if (data.streaming) {
                    userEndedStream = true;
                    obs.stopStreaming().then(() => {
                        console.log('STREAM STOPPED');
                        return twitchClient.say(process.env.TWITCHUSER, 'Thanks for joining us. See you next stream!')
                    }).then(function(data) {
                            console.log('Goodbye message sent to #' + data);
                    }).catch(err => {
                        console.log('Error ending stream: ' + err);
                    });
                }
            }).catch(err => {
                console.log('Error checking stream status: ' + err);
            });
        // If the message is a scene list request
        } else if (message.toLowerCase().startsWith('!scenelist')) {
            obs.getSceneList().then((sceneList) => {
                let sceneListNames = 'Available Scenes: ';
                for (let scene of sceneList.scenes) {
                    sceneListNames += `'${scene.name}', `;
                }
                sceneListNames = sceneListNames.slice(0, -2);
                twitchClient.say(process.env.TWITCHUSER, sceneListNames).then(function(data) {
                    console.log(`Sent available scene list to #"${data}"`);
                }).catch(function(err) {
                    console.log('Error sending scene list: ' + err);
                });
            }).catch(err => {
                console.log('Error checking stream status: ' + err);
            });
        // If the message is a request to turn on/off an audio source
        } else if (message.toLowerCase().startsWith('!togglemute')) {
            let audioSource = message.length > 12 ? message.slice(12) : process.env.DEFAULTAUDIO;
            obs.toggleMute({'source' : audioSource}).then(() => {
                console.log(`${audioSource} volume toggled`);
            }).catch(err => {
                console.log('Error checking stream status: ' + err);
            });
        }
    }
});

// Set new scene
function setNewScene(toScene) {
    currScene = toScene;
    obs.setCurrentScene({'scene-name': toScene}).then(() => {
        console.log('Set current scene to ' + toScene);
    }).catch(err => {
        console.log('Error changing scenes: ' + err);
    });
}

// Start the stream and set the scene to the IRL start scene
function startNewStream(sceneName) {
    obs.startStreaming().then(() => {
        console.log('STREAM STARTED');
        setNewScene(sceneName);
    }).catch(err => {
        console.log('Error starting stream: ' + err);
    });
}

// Catch all uncaught exceptions
obs.on('error', err => {
	console.error('OBS Socket Error: ', err);
});