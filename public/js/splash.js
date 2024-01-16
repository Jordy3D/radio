
var baneSplash = document.querySelector(".baneSplash");

baneSplash.addEventListener("click", () => {
    if (debug) console.log("fade out bane splash");

    baneSplash.style.opacity = 1;
    baneSplash.style.pointerEvents = "none";

    let curOpacity = parseFloat(baneSplash.style.opacity);
    var fadeOut = setInterval(() => {
        baneSplash.style.opacity = curOpacity;
        curOpacity = curOpacity - 0.01;

        if (curOpacity <= 0) {
            clearInterval(fadeOut);
            baneSplash.hidden = true;
            baneSplash.remove();

            loaded = true;
            startPlaylist();

            updateMotd(0); // set motd to first motd in motds array

            // play random song on page load
            // playRandomSong();
        }
    }, 10);
});