<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bane//Radio</title>
    <link rel="icon" href="favicon.ico">

    <link rel="stylesheet" href="css/style.css">

    <!-- Open Graph meta tags -->
    <meta property="og:title" content="radio">
    <meta property="og:description" content="Does this work? Who knows!">
    <meta property="og:image" content="https://jordy3d.github.io/files/logo.png">
    <!-- <meta property="og:url" content="https://jordy3d.github.io/dont/notfollowup"> -->
    <meta property="og:type" content="website">
</head>

<body>
    <?php
    function conlog($data)
    {
        echo "<script>console.log('$data');</script>";
    }
    ?>

    <div class="motd">
        <?php require_once "php/motd.php"; ?>
        <script src="js/motd.js"></script>
    </div>

    <div class="baneSplash">
        <img src="img/splash.gif" alt="Splash Image">

        <div class="clicktostart" hidden>
            <h1>Click to start</h1>
        </div>
    </div>

    <div class="spinner-container">
        <div class="spinner">
            <img src="img/logo.png" alt="Spinner image" onerror="this.src='img/logo.png';this.onerror='';">
        </div>
    </div>

    <!-- audio players -->
    <audio id="masterAudio" controls>
        <source src="" type="audio/mpeg">
    </audio>
    <audio id="djAudio" controls>
        <source src="" type="audio/mpeg">
    </audio>

    <div class="songList" hidden>
        <h1>Song List</h1>

        <!-- TODO: Remove the spawning of HTML in loadSongs -->
        <?php require_once "php/loadSongs.php"; ?>
    </div>

    <div class="control-bar">
        <button class="play" id="playToggle" onclick="playToggle()">▶</button>
        <button class="next" id="skipButton" onclick="playNextSong(true)">⏭</button>

        <div class="playing">
            <span class="title"></span>
            <span class="artist"></span>
        </div>

        <div class="progress">
            <div class="progress-bar"></div>
        </div>

        <div class="volume">
            <input type="range" min="0" max="100" value="75" class="slider" id="volumeSlider" oninput="updateVolume()">
        </div>
    </div>

    <script src="js/script.js"></script>
    <script src="js/splash.js"></script>
    <script src="js/dj.js"></script>
</body>

</html>