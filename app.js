require('dotenv').config();

const NodeMediaServer = require('node-media-server'),
    tmi = require("tmi.js");

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

let twitchClient = new tmi.client(twitchOptions);
twitchClient.connect();