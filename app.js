require('dotenv').config();

const NodeMediaServer = require('node-media-server'),
    tmi = require("tmi.js"),
    OBSWebSocket = require('obs-websocket-js');

let userEndedStream = false;

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
    return obs.getSceneList();
}).then((sceneList) => {
    let sceneListNames = 'Available Scenes: ';
    for (let scene of sceneList) {
        sceneListNames += scene.name + ', ';
    }
    sceneListNames = sceneListNames.slice(0, -2);
    console.log(sceneListNames);
}).catch(err => {
    console.log(err);
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
    channels: ["#banzaibaby"]
};

const twitchClient = new tmi.client(twitchOptions);
twitchClient.connect();

// On RTMP connection to server
nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
    let toScene = 'IRL Stream';
    userEndedStream = false;

    obs.startStreaming().then(() => {
        console.log('STREAM STARTED');
        return obs.setCurrentScene(toScene);
    }).then(() => {
        console.log('Set current scene to ' + toScene);
    }).catch(err => {
        console.log('Error starting stream: ' + err);
    });
});

// On RTMP disconnect from server
nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);

    if (!userEndedStream) {
        console.log('RTMP connection lost without disconnect command');
        let toScene = 'Technical Difficulties';
        obs.setCurrentScene(toScene).then(() => {
            console.log('Set current scene to ' + toScene);
        }).catch(err => {
            console.log('Error changing scenes: ' + err);
        });
    }
});

// On Twitch message
twitchClient.on("chat", function (channel, user, message, self) {
    if (self || user.mod) {
        console.log(user.display-name + ': ' + message);
        // If the message is the switch scene command
        if (message.startsWith('!scene ')) {
            let toScene = message.slice(7);
            obs.setCurrentScene(toScene).then(() => {
                console.log('Set current scene to ' + toScene);
            }).catch(err => {
                console.log('Error changing scenes: ' + err);
            });
        // If the message is the end stream command
        } else if (message.startsWith('!disconnect')) {
            let streamStatus = obs.getStreamingStatus();
            streamStatus.then(function (err, data) {
                if (err) {
                    console.error('OBS Socket Error:', err);
                } else if (data.streaming) {
                    userEndedStream = true;
                    obs.stopStreaming().then(() => {
                        console.log('STREAM STOPPED');
                        return twitchClient.action('banzaibaby', 'Thanks for joining us. See you next stream!')
                    }).then(function(data) {
                            console.log('Goodbye message sent to #' + data);
                    }).catch(err => {
                        console.log('Error ending stream: ' + err);
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
});

// Catch all uncaught exceptions
obs.on('error', err => {
	console.error('OBS Socket Error:', err);
});