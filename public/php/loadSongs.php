<?php
    require_once("vendor/getID3/getid3/getid3.php");

    class Station
    {
        public $name;
        public $songs;
        public $logo;
        public $details;

        function __construct($name, $songs)
        {
            $this->name = $name;
            $this->songs = $songs;

            // set logo to logo.png in station folder if it exists
            if (file_exists("audio/$name/logo.png"))
                $this->logo = "$name/logo.png";
            else
                $this->logo = "../img/logo.png";

            // set details to details.json in station folder if it exists
            if (file_exists("audio/$name/details.json"))
                $this->details = true;
            else
                $this->details = false;
        }
    }

    // define class for audio containing name, album, file
    class Song
    {
        public $name;
        public $album;
        public $artist;
        public $file;
        public $id;

        function __construct($name, $album, $file)
        {
            $this->name = $name;
            $this->album = $album;
            $this->file = $file;
            $this->artist = "UNKNOWN";
            $this->id = uniqid();

            $this->fetchDetails();
        }

        function fetchDetails()
        {
            // get details from file metadata using getID3
            $getID3 = new getID3;
            // if file is an mp3
            if (pathinfo($this->file, PATHINFO_EXTENSION) === "mp3")
            {
                $fileInfo = $getID3->analyze($this->file);
                $details = $fileInfo['tags']['id3v2'];
            }
            // if file is a flac
            elseif (pathinfo($this->file, PATHINFO_EXTENSION) === "flac")
            {
                $getID3->option_md5_data = true;
                $getID3->option_md5_data_source = true;
                $getID3->encoding = 'UTF-8';
                $getID3->Analyze($this->file);
                $fileInfo = $getID3->analyze($this->file);
                $details = $fileInfo['tags']['vorbiscomment'];
            }
            // $fileInfo = $getID3->analyze($this->file);
            // $details = $fileInfo['tags']['id3v2'];

            // print every key in fileinfo
            // foreach ($fileInfo as $key => $value) {
            // conlog($key);
            // }

            $this->name = $details['title'][0];
            $this->album = $details['album'][0];
            $this->artist = $details['artist'][0];
        }

        function createAudioControls()
        {
            // create play button that will add the song to the master audio
            echo <<<CONTROLS
            <div class="audio">
                <div class="audio-details">
                    <p class="name">$this->name</p>
                    <p class="album">$this->album</p>
                </div>
                <div class="play" onclick="playSong('$this->id')">▶</div>
            </div>
            CONTROLS;
        }
    }

    // list all the folders in audio/
    $dir = "audio/";
    $folders = scandir($dir);

    $stations = array();


    $songFormats = array("mp3", "wav", "ogg", "m4a", "flac");

    // for each folder in folders
    foreach ($folders as $folder) {
        // if the folder is "test", skip it
        if ($folder === "test")
            continue;

        // if not a folder, skip it
        $path = "audio/$folder";
        $pathIsDir = is_dir($path);

        if (!$pathIsDir)
            continue;
        
        // if folder is not . or ..
        if ($folder !== "." && $folder !== "..") {
            // list all audio files in audio/$folder/

            $dir = "audio/$folder/";
            $audio_files = scandir($dir);
            $audio_files = array_diff($audio_files, array('.', '..'));

            $songs = array();

            foreach ($audio_files as $file) {
                // if the file is an audio file
                if (!in_array(pathinfo($file, PATHINFO_EXTENSION), $songFormats))
                    continue;

                // name is file name without extension
                // album is folder the file is in
                // file is the file path
                $name = pathinfo($file, PATHINFO_FILENAME);
                $album = basename(dirname($dir . $file));
                $file = $dir . $file;

                // create new audio object
                $audio = new Song($name, $album, $file);

                // add to array of songs
                array_push($songs, $audio);

                // create audio controls
                $audio->createAudioControls();
            }

            // add station to stations array
            array_push($stations, new Station($folder, $songs));
        }
    }

    // convert stations array to json
    $stations_json = json_encode($stations);

    // create javascript variable with stations json
    echo "<script>
        const stations = $stations_json;
    </script>";

    // remove the hidden attribute from .clicktostart
    echo <<<LOADED
    <script>
        setAsLoaded();
    </script>;
    LOADED;
