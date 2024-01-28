// when the spinner is clicked

spinner.addEventListener("click", function() {
    // display all the stations around the spinner
    displayStations();
});


function displayStations()
{
    // if the spinner is already orbiting, destroy the stations
    if (spinner.classList.contains("orbiting")) {
        destroyStations();
        return;
    }

    // get the station count
    var stationCount = stations.length;
    console.log("stationCount: " + stationCount);

    var rotDeg = 360 / stationCount; 
    console.log("rotDeg: " + rotDeg);

    // create orbital container
    var orbital = document.createElement("div");
    orbital.className = "orbital";
    spinner.parentNode.appendChild(orbital);

    // place all the stations around the spinner
    for (var i = 0; i < stationCount; i++) {
        var station = stations[i];
        
        // create a new station div
        var stationDiv = document.createElement("div");
        stationDiv.className = "station-orbital";

        // set the station div's position
        var stationDivStyle = stationDiv.style;
        stationDivStyle.position = "absolute";
        stationDivStyle.left = "50%";
        stationDivStyle.top = "50%";
        stationDivStyle.transform = "translate(-50%, -50%) rotate(" + (i * rotDeg) + "deg)";

        // create new station image container
        var stationImgContainer = document.createElement("div");
        stationImgContainer.className = "station-image-container";
        stationImgContainer.style.transform = "rotate(" + (-i * rotDeg) + "deg)";
        stationDiv.appendChild(stationImgContainer);

        // create a new station image
        var stationImg = document.createElement("img");
        stationImg.className = "station-image";
        stationImg.src = `audio/${station.name}/logo.png`;
        stationImg.alt = station.name;

        // place the station image inside the station div
        stationImgContainer.appendChild(stationImg);
        stationDiv.appendChild(stationImgContainer);

        // place the station div inside the orbital container
        orbital.appendChild(stationDiv);

        // add a click listener to the station div
        stationDiv.addEventListener("click", function() {
            // get the station name
            var stationName = this.querySelector(".station-image").alt;

            selectStation(stationName);
            destroyStations();
        });
    }

    // add "orbiting" class to the spinner
    spinner.classList.add("orbiting");
}

function destroyStations()
{
    // remove all the station divs
    var stationDivs = document.getElementsByClassName("station-orbital");
    while (stationDivs.length > 0)
        stationDivs[0].parentNode.removeChild(stationDivs[0]);

    // remove "orbiting" class from the spinner
    spinner.classList.remove("orbiting");
}