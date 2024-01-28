
const motd = document.querySelector(".motd");

motd.addEventListener("click", updateMotd);

function animEnd(e) {
    if (e) e.stopPropagation();
    if (e.target !== document.querySelector(".notamarquee")) return;

    updateMotd();
}

function parseMotd(rawMotd) {
    let motd = rawMotd;

    // replace <STATION> with station name
    motd = motd.replace("<STATION>", station.name);
    // replace <TIME> with current time in the format HH:MM
    motd = motd.replace("<TIME>", new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    return motd;
}

function updateMotd(index=null) {
    // set motd text to random motd
    if (index === null) index = Math.floor(Math.random() * (motds.length - 1) + 1);
    let newMotd = motds[index];
    newMotd = parseMotd(newMotd);

    motd.innerHTML = `<span class="notamarquee">${newMotd}</span>`;
    let notamarquee = document.querySelector(".notamarquee");

    // halt notamarquee animation
    let animation = notamarquee.style.animation;
    notamarquee.style.animation = "none";
    
    // update motd when notamarquee animation ends
    notamarquee.addEventListener("animationiteration", animEnd);
    
    // restart notamarquee animation after 10 seconds
    setTimeout(() => {
        notamarquee.removeAttribute("style");
    }, 1000);

    // TODO: replace percentage animation with a constant speed animation
}