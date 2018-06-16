require('dotenv').config();

const NodeMediaServer = require('node-media-server'),
    tmi = require("tmi.js"),
    OBSWebSocket = require('obs-websocket-js');

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
});

// On RTMP connection to server
nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

// On Twitch message
client.on("chat", function (channel, user, message, self) {
    if (self || user.mod) {
        console.log(user.display-name + ': ' + message);
        if (message.startsWith('!scene ')) {
            let toScene = message.slice(7);
        } else if (message.startsWith('!disconnect')) {
            let streamStatus = obs.getStreamingStatus();
            streamStatus.then(function (err, data) {
                if (err) {
                    console.error('OBS Socket Error:', err);
                } else if (data.streaming) {
                    obs.stopStreaming();
                }
            });
        }
    }
});

// Catch all uncaught exceptions
obs.on('error', err => {
	console.error('OBS Socket Error:', err);
});