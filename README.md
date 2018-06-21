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
|!scenelist|Provides a full list of the available scenes in OBS.|
|!togglemute|Mute/unmute the default audio source.|
|!togglemute SOURCE NAME|Mute/unmute the specified audio source.|
|!disconnect|Ends the stream.|

### Setting Things Up
Not sugar coating things at all: Unless you are a software engineer, setup will likely be difficult and time-consuming. I have written these instructions in a step-by-step systematic way so that anyone can follow along, but expect to spend at least an hour getting things ready. If you have followed all these instructions accurately, and you are still unable to get things working, please visit [BanzaiBaby's stream](https://www.twitch.tv/banzaibaby) or [her Discord](https://discordapp.com/invite/banzaibaby) and ask for assistance there.

###### *Note:* The following instructions are written for Windows, but this program is also Linux compatible.


**Step 1: Download and Install Required Software**

In order to run this program, you will need to download and install [Node.js](https://nodejs.org/en/download/), [Git for Windows](https://gitforwindows.org/), and the [OBS WebSocket plugin](https://obsproject.com/forum/resources/obs-websocket-remote-control-of-obs-studio-made-easy.466/) for OBS. If you are unfamiliar with Node and Bash, you should install these programs using just the default, pre-checked options. The OBS plugin should also work with default installation options, provided you installed OBS to the default directory.

**Step 2: Setup the OBS WebSocket Plugin**

*TO BE COMPLETED LATER*

**Step 3: Setup your new OBS scenes**

*TO BE COMPLETED LATER*

**Step 4: Download and configure the source code**

If you are unfamiliar with the Bash console, this step will be particularly confusing. Follow the provided instructions carefully. In case you are concerned, I have included an explanation of what the provided commands are doing. Complete these steps in the order listed below.

- Start by opening Git Bash. The easiest way to do this is by typing 'Bash' into the search box by the Start Menu, and selecting the Git Bash program. If you installed Git Bash with the default options, you should also be able to select it from the Start Menu directly.

- Type **```cd ~/Desktop```** into the Bash console and hit Enter. This will change directory (cd) into the Desktop folder.

- Type **```git clone https://github.com/jjfeore/banzai-irl-stream-control.git```** into the Bash console and hit Enter. This will download this code repository from Github, and clone it onto your machine.

- Type **```cd banzai-irl-stream-control```** into the Bash console and hit Enter. The previous command should have created a new folder called 'banzai-irl-stream-control' on your Desktop. This will change the console's directory to that one.

- Type **```npm install```** into the Bash console and hit Enter. This will use the Node Package Manager (npm) to automatically install all the source code dependencies that this program requires to function. You can review these dependencies in the package.json file.

- Type **```cp exampleenv.txt .env```** into the Bash console and hit Enter. This will make of copy of the 'exampleenv.txt' file name '.env' in the same directory. The '.env' file is used to configure this application for your computer.

- Type **```notepad .env```** into the Bash console and hit Enter. This will open the '.env' file you just created in Notepad.

- Minimize (don't close) the Git Bash window and move on to the next step.

**Step 5: Configure your .env file**

Fill in the '.env' file using the instructions provided in the file. Make sure to save this file when you are finished editing it.

**Step 6: Configure Port Forwarding for your Router**

If you are not connected to the Internet through a router or network, you can skip this step. Otherwise, I cannot provide detailed steps for this process because it is different for each router. You will need to inspect your router for its model number (e.g. Netgear AC1750) and then Google for how to setup port forwarding for that router.

You need to configure your router so that port 1935 is forwarded to whichever computer you use to host OBS. You may also need to assign that computer a static IP address on your network (this is accomplished in your router settings as well). This is necessary to allow your computer to receive a direct connection from your mobile IRL setup/cellphone.

**Step 7: Get encrypted RTMP URL**

Re-open the Git Bash window that you previously minimized and enter **```node passgenerator.js```** into the console. This will run a simple script that will generate an RTMP URL for you. You will need to enter an expiration date for this URL in the form of YYYY/MM/DD. This expiration date can be as far into the future as you please.

The script will generate a URL in the form of 'rtmp://YOUR_PC_IP_ADDRESS:1935/live/stream?sign=XXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXX'. Save this URL for later, and minimize the Git Bash window again.

**Step 8: Find your IP address**

Google for 'my ip address' and copy the value it gives you as 'Your public IP address'. Replace the portion in the RTMP URL that says 'YOUR_PC_IP_ADDRESS' with this public IP address. The completed RTMP URL should look something like 'rtmp://123.45.67.890:1935/live/stream?sign=1735718400-78a717b8c39caa56979f8c880b45e67a'.

**Step 9: Download and setup an RTMP mobile streaming app**

*TO BE COMPLETED LATER*

**Step 10: Start first IRL stream with the software**

*TO BE COMPLETED LATER*