// Wait for Bongo Window to load
setTimeout(function () {
    // Get "taskbar" below video stream
    let leftTaskbar = document.getElementsByClassName("left--Z1rLKlO")[0];

    // Create the container that holds the volume slider
    let VolumeContainer = document.createElement("div");
    VolumeContainer.id = "v-container";
    VolumeContainer.classList.add("container--1hUthh");

    let VolumeSpan = document.createElement("span");
    VolumeSpan.style.margin = "auto";
    VolumeSpan.style.color = "white";
    VolumeSpan.innerText = "Volume";

    let VolumeIndictator = document.createElement("span");
    VolumeIndictator.style.margin = "auto";
    VolumeIndictator.style.color = "white";
    VolumeIndictator.innerText = "100%";

    let VolumeSlider = document.createElement("input");
    VolumeSlider.type = "range";
    VolumeSlider.min = "0";
    VolumeSlider.max = "1";
    VolumeSlider.value = "1";
    VolumeSlider.step = "0.01";
    VolumeSlider.addEventListener("input", function() {
        // Get audio element
        document.getElementsByTagName("audio")[0].volume = VolumeSlider.value;
        let dispString = Math.round((VolumeSlider.value * 100)) + "%";
        VolumeIndictator.innerText = dispString;
    });


    VolumeContainer.appendChild(VolumeSpan);
    VolumeContainer.appendChild(VolumeSlider);
    VolumeContainer.appendChild(VolumeIndictator);
    if(leftTaskbar != undefined)
        leftTaskbar.appendChild(VolumeContainer);
}, 2000);