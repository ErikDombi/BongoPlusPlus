function getBrowser() {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    } else {
        return "Edge";
    }
}

function saveSettings(){
    console.log("Saving Settings...");
    chrome.storage.sync.set(
        {
            "autoConfidence": autoConfidenceField.value,
            "manualConfidence": manualConfidenceField.value
        }, function() {console.log("Saved Settings!")});
}

function loadSettings() {
    console.log("Loading Settings...");
    chrome.storage.sync.get(['autoConfidence', 'manualConfidence'], function (obj) {
        let shouldSave = false;
        if(obj.autoConfidence == undefined) {
            obj.autoConfidence = 20;
            shouldSave = true;
        }

        if(obj.manualConfidence == undefined){
            obj.manualConfidence = 8;
            shouldSave = true;
        }

        autoConfidenceField.value = obj.autoConfidence;
        manualConfidenceField.value = obj.manualConfidence;

        console.log("Loaded Settings!");

        if(shouldSave)
            saveSettingsChrome();
    });
}

let settingFields = document.getElementsByClassName("setting-input");
for(i = 0; i < settingFields.length; i++){
    settingFields[i].addEventListener('input', saveSettings);
}

let autoConfidenceField = document.getElementById("autoConfidence");
let manualConfidenceField = document.getElementById("manualConfidence");

loadSettings();