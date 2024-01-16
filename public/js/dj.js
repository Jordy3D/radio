// DJ Info
var defaultDJLines =
    [
        "This is <STATION>, and you were just listening to <PREVSONG>, by <PREVARTIST>. Coming up next is another track; <NEXTSONG>.",
        "You're listening to <STATION>, and that was <PREVARTIST> with <PREVSONG>. Coming up next is <NEXTSONG>, <BY> <NEXTARTIST>.",
        "That was <PREVSONG>, by <PREVARTIST>. You're listening to <STATION>, and coming up next is <NEXTSONG>.",
    ]

class StationDJ {
    constructor(stationName, djName, djId, djLines, djVolumeBoost) {
        this.stationName = stationName;
        this.djName = djName;
        this.djId = djId;
        this.djLines = djLines;
        this.djVolumeBoost = djVolumeBoost;
    }
}

// Load DJs
var stationDJs = [];
loadDJs();
function loadDJs() {
    // Helper function to load details.json for a station
    function loadDetails(station) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", `audio/${station.name}/details.json`);
            xhr.send();

            xhr.onload = () => {
                if (xhr.status == 200) {
                    if (debug) console.log(`Loaded details.json for ${station.name}`);
                    var details = JSON.parse(xhr.responseText);
                    resolve({ details });
                } else {
                    reject(`Error ${xhr.status}: ${xhr.statusText}`);
                }
            };
        });
    }

    // Iterate through stations sequentially
    (async () => {
        for (var i = 0; i < stations.length; i++) {
            var station = stations[i];
            var stationName = station.name;

            if (!station.details) continue;
            if (debug) console.log(`Loading DJ for ${stationName}`);

            try {
                // Wait for the details.json to be loaded for the current station
                const { details } = await loadDetails(station);

                // Update station details
                let djStationName = stationName;
                let djName = details.djName;
                let djId = details.djId;
                let djLines = details.djLines;
                let djVolumeBoost = details.djVolumeBoost;

                // Add default lines to djLines
                for (var j = 0; j < defaultDJLines.length; j++)
                    djLines.push(defaultDJLines[j]);

                var stationDJ = new StationDJ(djStationName, djName, djId, djLines, djVolumeBoost);

                if (debug) console.log(stationDJ);
                stationDJs.push(stationDJ);
            } catch (error) {
                console.log(error);
            }
        }

        if (debug) console.log(stationDJs);
    })();
}

var currentStationDJ = null;

// Event Listeners

djAudio.addEventListener("play", () => {
    updatePlayingDetails("", "DJ", station.name);
    setPageMeta(`${station.name} - DJ`);

    masterAudio.pause();
    skipButton.disabled = true;

    if (debug) console.log(`Playing audio with a boost of ${currentStationDJ.djVolumeBoost}`)
    djAudio.volume = masterAudio.volume * currentStationDJ.djVolumeBoost;
});

djAudio.addEventListener("ended", () => {
    skipButton.disabled = false;
    masterAudio.play();
    updatePlayingDetails(localStorage.getItem("songId"));
});

// Functions

function parseDJLine(lines) {
    var songId = localStorage.getItem("songId");

    const prevSong = songs.find(song => song.id === songId);
    const prevSongIndex = playlist.indexOf(songId);

    const nextSongIndex = playlist[prevSongIndex + 1];
    const nextSong = songs.find(song => song.id === nextSongIndex);

    var djLine = lines[Math.floor(Math.random() * lines.length)];
    djLine = djLine.replace("<STATION>", station.name);
    djLine = djLine.replace("<PREVSONG>", prevSong.name);
    djLine = djLine.replace("<PREVARTIST>", prevSong.artist);
    djLine = djLine.replace("<NEXTSONG>", nextSong.name);
    djLine = djLine.replace("<NEXTARTIST>", nextSong.artist);

    if (prevSong.artist === nextSong.artist)
        djLine = djLine.replace("<BY>", "also by");
    else
        djLine = djLine.replace("<BY>", "by");

    if (debug) console.log(djLine);

    return djLine;
}

function generateDJLine() {
    var currentStation = station.name;

    // get station DJ
    let stationDJ = stationDJs.find(stationDJ => stationDJ.stationName === currentStation);

    if (stationDJ.djId === null)
        return;

    currentStationDJ = stationDJ;

    var djId = stationDJ.djId;
    var djLine = parseDJLine(stationDJ.djLines);

    var unixTimestamp = Math.round((new Date()).getTime() / 1000);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `php/genvoice.php?text=${djLine}&voiceId=${djId}&timestamp=${unixTimestamp}`);
    xhr.send();

    xhr.onload = () => {
        if (xhr.status == 200) {
            var fileName = `gen/${unixTimestamp}-voice.mp3`

            djAudio.src = fileName;
            djAudio.play();
        }
        else {
            console.log(`Error ${xhr.status}: ${xhr.responseText}`);
            djAudio.dispatchEvent(new Event("ended"));
        }
    }

    xhr.onerror = () => {
        console.log("Request failed");
        djAudio.dispatchEvent(new Event("ended"));
    }
}