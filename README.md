# radio

 a self-hostable internet radio

## features

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

## requirements

- some PHP, i dunno
- [getID3](https://github.com/JamesHeinrich/getID3), for loading metadata from audio files (tracks, artists, etc)
- [ElevenLabs](https://elevenlabs.io/) API key
  - This is used to generate the DJ dialogue
  - ❗ AI voice IDs are currently hardcoded, so you'll need to change the code if you want to use a different voice ❗
- questionable morals

## how to use

1. clone the repo
2. add your music to the `audio` folder, in the format seen below
3. add a logo for the station in the same folder, in the format seen below
4. run the appropriate `.bat` file depending on your use case (see below)
   - This will automatically open a browser window to the correct address
5. enjoy!

### starting a server

There are three `.bat` files included in the repo:

- `start_local_server.bat` - starts a server localhost only
- `start_lan_server.bat` - starts a server accessible from other devices on the same network
- `start_remote_server.bat` - starts a server accessible from other devices on the internet

If you accidentally close the server window, you can restart it by running the appropriate OPEN `.bat` file.

## what does a station look like?

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

## .env

A .env file is required in the root directory of the project. It currently has the following variables:

- `XIAPIKEY` - the API key for [ElevenLabs](https://elevenlabs.io/)
  - If you don't have one, you can leave this blank, but the DJ dialogue will not work
- `LOCALIP` - the local IP address of the server
  - This is used for starting a LAN server to test on other devices on the same network
- `REMOTEIP` - the remote IP address of the server
  - This is used for starting a remote server to test on other devices on the internet
- `PORT` - the port that the server will run on

## todo

This is a list of things I want to add to the radio.  
They're in no particular order, and there's no guarantee that I'll actually do them.

- [X] Move AI DJ info to a JSON file
- [ ] Fix routing (currently non-functional after swapping to a /public folder)
- [ ] Improve Station switching
- [ ] Add a dynamic check for updates to:
  - [ ] stations
  - [ ] tracks
  - [ ] MOTD
  - [ ] DJ dialogue
- [ ] Last.fm integration
- [ ] Make animations coded rather than CSS (for consistency with the MOTD)
- [ ] probably a lot more, I don't know, I'm not a barber

## notes

### the server itself

The provided server is the [PHP built-in server](https://www.php.net/manual/en/features.commandline.webserver.php), which is not recommended for production use.  
You can use Apache or whatever, no guarantees it'll work cuz I haven't tested it (though the initial development was done with XAMPP, so it probably works unless I broke something).  
I only switched because I was filling up my C drive with songs.

### remote connection

For remote use, you'll need to set up port forwarding on your router.

If you're using a VPN, you'll need to set up split-tunneling or port forwarding on the VPN, depending on whatever.

## known issues

1. The router doesn't work properly. I don't know how it really works with defining a root directory, so I just left it as is.  
It basically means that you can access the radio from any URL starting with the main one, rather than from /radio or something. It's not a huge issue, it's just kinda gross.
2. The AI DJ dialogue can sometimes just not fully complete, and will just stop mid-sentence. I don't know why this happens, but it seems pretty rare.
3. Starting a LAN server and a localhost server are not the same thing, so you'll need to pick one or the other depending on what you're doing.
4. The Developer Console comes up with an error about .play() and .pause() interrupting each other, but it doesn't seem to affect anything, so I'm just gonna ignore it.
