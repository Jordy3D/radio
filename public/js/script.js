// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║   
// ██║██║╚██╗██║██║   ██║   
// ██║██║ ╚████║██║   ██║   
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   

// consts
const masterAudio = document.getElementById("masterAudio");
const djAudio = document.getElementById("djAudio");
const debug = false;
const djEnabled = true;

// set dj values to natural or localhost values
var isLocal = window.location.hostname === "localhost";
const djChance = (isLocal ? 0.3 : 0.1);
const djOnSkip = (isLocal ? true : false);
const djVolumeBoost = 2;

// control bar elements
const progressBar = document.querySelector(".progress-bar");
const volumeSlider = document.getElementById("volumeSlider");
const playButton = document.getElementById("playToggle");
const skipButton = document.getElementById("skipButton");

// misc elements
const spinner = document.querySelector(".spinner");

// global vars
var loaded = false;
var station = null;
var songs = null;

var playlist = [];
var inPlaylist = true;

// list all found station names
if (debug) {
    console.log("stations found:");
    stations.forEach(station => console.log(station.name));
}

// set songs array to the first station in stations
station = stations[0];
songs = station.songs;

let stationList = "";
stations.forEach(station => stationList += `\n${station.name}`);
if (debug) console.log(`Stations found: ${stationList}`);

loadSavedData();

function loadSavedData() {
    // set volume slider value to stored volume
    setVolume(localStorage.getItem("volume") ?? 75);

    // set station to stored station
    selectStation(localStorage.getItem("station") ?? stations[0].name);
}


// event listeners

// update progress bar on time update or new song
masterAudio.addEventListener("timeupdate", updateProgress);
masterAudio.addEventListener("play", updateProgress);
masterAudio.addEventListener("ended", () => {
    if (inPlaylist)
        playNextSong();
    else
        playRandomSong();
});

// spinner
spinner.addEventListener("click", () => {
    nextStation();
});
spinner.addEventListener("auxclick", (e) => {
    if (e.button === 1)
        spinner.classList.toggle("top");
});

//  █████╗ ██╗   ██╗██████╗ ██╗ ██████╗ 
// ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
// ███████║██║   ██║██║  ██║██║██║   ██║
// ██╔══██║██║   ██║██║  ██║██║██║   ██║
// ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
// ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 

// station
function loadStation(stationName) {
    if (debug) console.log(`loading station ${stationName}`);

    // update station and songs
    station = stations.find(station => station.name === stationName);
    songs = station.songs;

    // update spinner image to album/logo
    updateSpinnerImage(station);

    // save station name in local storage
    localStorage.setItem("station", stationName);
}

function nextStation() {
    const currentStationIndex = stations.indexOf(station);

    if (currentStationIndex === stations.length - 1)    // wrap around to first station
        station = stations[0];
    else
        station = stations[currentStationIndex + 1];

    selectStation(station.name);
}

function selectStation(stationName) {
    if (debug) console.log(`selecting station ${stationName}`);

    loadStation(stationName);

    // create and start playlist
    createPlaylist();
    startPlaylist();
}

function playSong(songId) {
    // get song from songs array
    const song = songs.find(song => song.id === songId);
    let songfile = song.file;

    if (debug) console.log(`playing ${song.name} - ${song.album}`);

    // encode special characters (so far, only # has been found to cause issues)
    songfile = songfile.replaceAll("#", "%23");

    // set and play song
    masterAudio.src = songfile;
    masterAudio.play();

    // set metadata
    setPageMeta(`${song.name} - ${song.artist}`);
    updateMediaSession(songId);

    // update control bar
    updatePlayButtonIcon();
    updatePlayingDetails(songId);
}

function playNextSong(skipButton = false) {
    const currentSongIndex = playlist.indexOf(localStorage.getItem("songId"));
    // get next song in playlist
    var nextSong = playlist[currentSongIndex + 1];

    if (skipButton)                                     // if skip button was pressed,
        if (debug) console.log("skipping song");        // log that the song was skipped

    if (currentSongIndex === playlist.length - 1) {     // if last song in playlist
        if (inPlaylist)                                 // then if in playlist,
            createPlaylist();                           // create new playlist
        else                                            // otherwise,
            playRandomSong();                           // play random song

        nextSong = playlist[0];                         // set next song to first song in playlist
    }

    // if this is not the first or last song in the playlist, and DJ is enabled
    if (currentSongIndex !== -1 && currentSongIndex !== playlist.length - 1 && djEnabled)
    {
        if (!skipButton || djOnSkip)        // if skip wasn't pressed or skips are allowed
            if (Math.random() < djChance)   // 10% chance to generate a DJ line
                generateDJLine();
    }
    playSong(nextSong);
    
    localStorage.setItem("songId", nextSong);
}

function playRandomSong() {
    // get random song
    const randomSong = songs[Math.floor(Math.random() * songs.length)];

    while (randomSong.id === localStorage.getItem("songId")) {
        // if random song is the same as the last song, get a new random song
        randomSong = songs[Math.floor(Math.random() * songs.length)];
    }

    playSong(randomSong.id);

    localStorage.setItem("songId", randomSong.id);
}

// control bar
function playToggle() {
    masterAudio.paused ? masterAudio.play() : masterAudio.pause();
    updatePlayButtonIcon();
}

function updatePlayButtonIcon() {
    // if master audio is paused, set play button to play icon
    playButton.innerText = masterAudio.paused ? "▶" : "⏸";
    playButton.classList.toggle("play");
    playButton.classList.toggle("pause");
}

function updatePlayingDetails(songId="", title = "", artist = "") {
    if (songId !== "")
    {
        // get song from songs array
        const song = songs.find(song => song.id === songId);
        title = song.name;
        artist = song.artist;
    }

    // set playing details to song name and artist
    document.querySelector(".playing .title").innerText = title ?? "TITLE";
    document.querySelector(".playing .artist").innerText = artist ?? "ARTIST";
}

function updateProgress() {
    const progress = (masterAudio.currentTime / masterAudio.duration) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateVolume() {
    let volume = volumeSlider.value;
    volume = (volume * volume) / 10000; // volume slider is exponential (x^2 / 10000

    masterAudio.volume = volume;
    djAudio.volume = volume;
    localStorage.setItem("volume", volumeSlider.value);
}

function setVolume(sliderValue) {
    volume = (sliderValue * sliderValue) / 10000; // volume slider is exponential (x^2 / 10000

    volumeSlider.value = sliderValue;
    masterAudio.volume = volume;
    djAudio.volume = volume;
}

// playlist
function createPlaylist() {
    playlist = songs.map(song => song.id);
    playlist.sort(() => Math.random() - 0.5);

    let playListList = "";
    for (let i = 0; i < playlist.length; i++) {
        const song = songs.find(song => song.id === playlist[i]);
        playListList += `\n${song.name} - ${song.artist}`;
    }

    if (debug) console.log(playListList);
}

function startPlaylist() {
    if (!loaded) return;

    createPlaylist();
    playSong(playlist[0]);

    localStorage.setItem("songId", playlist[0]);
}

// ███╗   ███╗███████╗████████╗ █████╗ 
// ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗
// ██╔████╔██║█████╗     ██║   ███████║
// ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║
// ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║
// ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝

function updateSpinnerImage() {
    document.querySelector(".spinner img").src = `audio/${station.logo}`
}

function setPageMeta(title = "", icon = "") {
    // set page title to current song name 
    document.title = title;

    // set page favicon to current song album
    let pageIcon = document.querySelector("link[rel='icon']");
    if (pageIcon) {
        pageIcon.href = `audio/${station.logo}`;
        pageIcon.type = "image/png";
    }
}

function updateMediaSession(songId) {
    // get song from songs array
    const song = songs.find(song => song.id === songId);

    // set media session metadata
    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: `Bane//Radio - ${station.name}`,
        artwork: [{
            src: `audio/${station.logo}`,
            sizes: '512x512',
            type: 'image/png'
        }]
    });
}