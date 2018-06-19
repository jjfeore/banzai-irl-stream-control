require('dotenv').config();

const crypto = require('crypto'),
    readlineSync = require('readline-sync');

// Encrypt a string with the MD5 hash
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

// Question and Answer
console.log('Use this tool to automatically generate the encrypted URL you will connect to with your mobile RTMP streaming app.\r\nIn order to generate an encrypted URL, you must first provide an expiration date for this encryption.\r\nIf you don\'t wish to repeat this process in the near future, please set a date several years in the future.');
let toHash = process.env.RTMPPASS;
let expDate = readlineSync.question('Date (Format: YYYY/MM/DD): ');
expDate = Math.floor(new Date(expDate).getTime() / 1000);

toHash = `/live/stream-${expDate}-${toHash}`;
toHash = md5(toHash);

console.log('Your encrypted URL is:\r\nrtmp://YOUR_PC_IP_ADDRESS:1935/live/stream?sign=' + expDate + '-' + toHash);