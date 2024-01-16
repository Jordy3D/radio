
const motd = document.querySelector(".motd");

motd.addEventListener("click", () => { updateMotd(); });

function animEnd(e) {
    if (e) e.stopPropagation();
    if (e.target !== document.querySelector(".notamarquee")) return;

    // update motd when notamarquee animation ends
    updateMotd();
}

function updateMotd(index=null) {
    // set motd text to random motd
    if (index === null) index = Math.floor(Math.random() * (motds.length - 1) + 1);
    let newMotd = motds[index];

    motd.innerHTML = `<span class="notamarquee">${newMotd}</span>`;
    let notamarquee = document.querySelector(".notamarquee");

    // halt notamarquee animation
    let animation = notamarquee.style.animation;
    notamarquee.style.animation = "none";
    
    // update motd when notamarquee animation ends
    notamarquee.addEventListener("animationiteration", animEnd);

    // restart notamarquee animation after 10 seconds
    setTimeout(() => {
        notamarquee.style.animation = animation;
    }, 1000);

    // TODO: replace percentage animation with a constant speed animation
}