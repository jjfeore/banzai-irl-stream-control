# BanzaiBaby's IRL Stream Control

### What can I do with this?
After helping [BanzaiBaby](https://www.twitch.tv/banzaibaby) run dozens of IRL streams from her cellphone, I began to realize that all the existing mobile streaming applications lacked certain essential features. They were incompatible with low latency mode (it causes a TON of buffering), whenever they disconnected for a second your stream ends, they had no ability to integrate with existing OBS scenes/overlays, and you were stuck with just one scene (What do you do if you have to go to the bathroom? Just end the stream?).

I made this simple app to address all those problems. It supports the following functionalities:

* **Auto Start:** Detect an incoming connect and start OBS using that connection.
* **Scenes/Overlays:** Build your scenes in OBS and use them just like you normally would.
* **Disconnect Protection:** If you lose connection accidentally, your stream doesn't end. It just goes to another scene.
* **Scene Switching:** You and your mods can switch OBS scenes directly through chat.
* **Low Latency Mode:** If you can normally use Low Latency Mode on Twitch, you can now do it while mobile as well.

### Commands
All commands issued to this app are done via Twitch chat. The IRL Stream Control currently accepts commands from both the streamer and their moderators. The following commands are currently supported:


| **Command** | **Description** |
|---|---|
|!scene SCENENAME|Switch to another OBS scene. For example, '!scene BRB'.|
|!scenelist|Whispers the mod who enters the command a full list of available OBS scenes.|
|!disconnect|Ends the stream.|

### Setting Things Up
Not sugar coating things at all: Unless you are a software engineer, setup will likely be difficult and time-consuming. I have written these instructions in a step-by-step systematic way so that anyone can follow along, but expect to spend at least an hour getting things ready. If you have followed all these instructions accurately, and you are still unable to get things working, please visit [BanzaiBaby's stream](https://www.twitch.tv/banzaibaby) or [her Discord](https://discordapp.com/invite/banzaibaby) and ask for assistance there.

*TO BE COMPLETED LATER*
