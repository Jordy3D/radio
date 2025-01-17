# radio

a self-hostable internet radio

## table of contents

<div align="center">

|  |
|:---:|
| [features](#features-) \| [requirements](#requirements-) \| [how to use](#how-to-use-) \| [what does a station look like?](#what-does-a-station-look-like-) \| [.env](#env-) \| [motd](#motd-)  
[todo](#todo-) \| [notes](#notes-) \| [known issues](#known-issues-) |

</div>

## features [▴](#table-of-contents)

- Play music from a local folder
- Multiple station support
  - Switch between stations by clicking the spinner
- A rather nice UI
- A volume slider, unlike a certain other radio
- Web Media Session API support
  - This means you can control the radio from your keyboard or media keys
  - Also displays the current track and station in the media controls
- AI DJ announcer
  - Uses ElevenLabs to generate the dialogue
- Spaghetti code

## requirements [▴](#table-of-contents)

### software

- some PHP, i dunno
- tee, for logging
  - Either from cygwin, git, [tee](https://github.com/dEajL3kA/tee-win32/), whatever

### packages

- [getID3](https://github.com/JamesHeinrich/getID3), for loading metadata from audio files (tracks, artists, etc)
  - put this in the `vendor` folder
  - if installing via composer, the "project root" is the `public` folder
  - for clarity, the structure should look like:

```txt
public
└── vendor
    └── getid3 (the one you download)
        ├── demos
        ├── getid3
        ¦
```

### other

- [ElevenLabs](https://elevenlabs.io/) API key, to generate the DJ dialogue
- questionable morals

## how to use [▴](#table-of-contents)

1. clone the repo
1. fill out the [`.env` file] ([see below](https://github.com/Jordy3D/radio#env))
1. add your music to the `audio` folder, in the format [seen below](https://github.com/Jordy3D/radio#structure)
1. add a logo for the station in the same folder, in the format [seen below](https://github.com/Jordy3D/radio#structure)
1. run the appropriate `.bat` file depending on your use case ([see below](https://github.com/Jordy3D/radio#starting-a-server))
   - This will automatically open a browser window to the correct address
1. enjoy!

### starting a server

There are three `.bat` files included in the repo:

- `start_local_server.bat` - starts a server localhost only
- `start_lan_server.bat` - starts a server accessible from other devices on the same network
- `start_remote_server.bat` - starts a server accessible from other devices on the internet

If you accidentally close the server window, you can restart it by running the appropriate OPEN `.bat` file.

## what does a station look like? [▴](#table-of-contents)

### structure

A station has the following structure:

```txt
Your Station
├── logo.png
├── details.json
├── Song 1.mp3
├── Song 2.mp3
¦
└── Song N.mp3
```

### files

#### logo

Ideally your logo should be a square image.  
I haven't tested it with non-square ones so they might look weird.  
All of mine are 400x400, which I only chose because it was a preset in the image editor I was using.

#### songs

Songs should have metadata embedded into them, otherwise they will not show up as expected.  
I have only tested MP3 and FLAC files, but it should prolly work with other formats too, as long as their id3 tags are set up correctly.

#### details.json

This file is not strictly necessary, unless you want to use the AI DJ dialogue.  
The `details.json` file contains the following:

```json
{
    "stationName": "Your Station",
    "djName": "DJ Name",
    "djId": "ElevenLabs Voice ID",
    "djVolumeBoost": "1",
    "djLines": []
}
```

- `stationName` is the name of the station, only in the JSON for identification purposes
- `djName` is the name of the DJ, useful for keeping track of which voice is which
- `djId` is the ElevenLabs voice ID, which is used to generate the DJ dialogue
- `djVolumeBoost` is a multiplier for the volume of the DJ dialogue
  - This is useful if the DJ is too quiet or too loud compared to the music of the station
- `djLines` is an array of lines that the DJ will say
  - Currently, the following tags are able to be replaced with the relevant information:
    - `<STATION>`
    - `<PREVSONG>`
    - `<PREVARTIST>`
    - `<NEXTSONG>`
    - `<NEXTARTIST>`

## .env [▴](#table-of-contents)

A .env file is required in the root directory of the project. It looks like this:

```py
XIAPIKEY="YOUR_API_KEY"
LOCALIP="YOUR_LOCAL_IP"
REMOTEIP="YOUR_REMOTE_IP"
PORT=8054
```

- `XIAPIKEY` - the API key for [ElevenLabs](https://elevenlabs.io/)
  - If you don't have one, you can leave this blank, but the DJ dialogue will not work
- `LOCALIP` - the local IP address of the server
  - This is used for starting a LAN server to test on other devices on the same network
- `REMOTEIP` - the remote IP address of the server
  - This is used for starting a remote server to test on other devices on the internet
- `PORT` - the port that the server will run on

## motd [▴](#table-of-contents)

You can set "MOTD"s or splashes in the file called `motd.txt` in the `public` folder.  
The file is read as one message per line, and will cycle through them. Blank lines are ignored.

If you wish to write notes about groups of messages or comment or something, you can use `;` to comment out a line.

### modifiers

#### effects

*note: you can't currently combine effects.*  

You can add effects to the MOTD by using the following syntax:

```txt
<effect>message</effect>
```

The currently supported effects are:

- `rainbow` - scrolls a rainbow across the text
- `wiggle` - makes the text wiggle
- `glitch` - makes the text appear glitchy
- `discord` - adds a profile picture and small Discord-themed pill body
  - the "profile picture" is set as discord.png in the `img` folder

#### variables

You can also add variables to the MOTD by using the following syntax:

```txt
<VAR>
```

The currently supported variables are:

- `STATION` - the name of the current station
- `TIME` - the current time

## todo [▴](#table-of-contents)

This is a list of things I want to add to the radio.  
They're in no particular order, and there's no guarantee that I'll actually do them.

- [X] Move AI DJ info to a JSON file
- [ ] Fix routing (currently non-functional after swapping to a /public folder)
- [X] Improve Station switching
- [ ] Add a dynamic check for updates to:
  - [ ] stations
  - [ ] tracks
  - [ ] MOTD
  - [ ] DJ dialogue
- [ ] Last.fm integration
- [ ] Make animations coded rather than CSS (for consistency with the MOTD)
- probably a lot more...

## notes [▴](#table-of-contents)

### the server itself

The provided server is the [PHP built-in server](https://www.php.net/manual/en/features.commandline.webserver.php), which is not recommended for production use.  
You can use Apache or whatever, no guarantees it'll work cuz I haven't tested it (though the initial development was done with XAMPP, so it probably works unless I broke something).  
I only switched because I was filling up my C drive with songs.

### remote connection

For remote use, you'll need to set up port forwarding on your router.

If you're using a VPN, you'll need to set up split-tunneling or port forwarding on the VPN, depending on whatever.

## known issues [▴](#table-of-contents)

1. The router doesn't work properly. I don't know how it really works with defining a root directory, so I just left it as is.  
It basically means that you can access the radio from any URL starting with the main one, rather than from /radio or something. It's not a huge issue, it's just kinda gross.
2. The AI DJ dialogue can sometimes just not fully complete, and will just stop mid-sentence. I don't know why this happens, but it seems pretty rare.
3. Starting a LAN server and a localhost server are not the same thing, so you'll need to pick one or the other depending on what you're doing.
4. The Developer Console comes up with an error about .play() and .pause() interrupting each other, but it doesn't seem to affect anything, so I'm just gonna ignore it.
