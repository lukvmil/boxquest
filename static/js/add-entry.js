const imageInput = document.getElementById("image-input");
const imageDisplay = document.getElementById("image-display");
const imageContainer = document.getElementById("image-container")
const textInput = document.getElementById("text-input");
const coordinateDisplay = document.getElementById("coordinate-display")
const validationMessage = document.getElementById("validation-message");
const submitButton = document.getElementById("submit-button");
const loadingIcon = document.getElementById("loading-icon");
const params = new URLSearchParams(window.location.search);
const locationErrorModal = new bootstrap.Modal(document.getElementById('location-error'))

let raw_geoloc;
let geoloc;

coordinateDisplay.value = "";

function triggerUpload() {
    imageInput.click();
}

function loadImage() {
    imageDisplay.src = URL.createObjectURL(imageInput.files[0]);
}

function requestLocation() {
    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationFail);
}

function handleLocationSuccess(loc) {
    raw_geoloc = {
        "latitude": loc.coords.latitude,
        "longitude": loc.coords.longitude,
        "timestamp": loc.timestamp
    }

    handlePrecision(true);
}

function roundTo(number, places) {
    factor = 10 ** places;
    return Math.round(number * factor) / factor;
}

function handlePrecision(enabled) {
    let lon, lat;

    if (enabled) {
        lon = roundTo(raw_geoloc.longitude, 5);
        lat = roundTo(raw_geoloc.latitude, 5);
    } else {
        lon = roundTo(raw_geoloc.longitude, 2) + Math.floor(Math.random() * 10) / 10 ** 3;
        lat = roundTo(raw_geoloc.latitude, 2) + Math.floor(Math.random() * 10) / 10 ** 3;
    }

    geoloc = {
        "latitude": lat,
        "longitude": lon,
        "timestamp": raw_geoloc.timestamp
    }

    coordinateDisplay.value = `${lat}, ${lon}`;
}

function handleLocationFail(error) {
    error.code;
    error.message;

    locationErrorModal.show();
}

function validateItem(condition, element) {
    if (condition) {
        element.classList.remove("border-danger");
        element.classList.add("border-success");
        return true;
    } else {
        element.classList.remove("border-success");
        element.classList.add("border-danger");
        return false;
    }
}

function postEntry() {
    let data = new FormData();
    data.append('file', imageInput.files[0]);
    data.append('geoloc', JSON.stringify(geoloc));
    data.append('message', textInput.value);
    data.append('box_key', sessionStorage.getItem("box_key"));

    let box_id = params.get("id");

    console.log(geoloc);

    console.log("submitted...")

    fetch(`/api/box/${box_id}/entry`, {
        method: 'POST',
        body: data
    })
        .then(resp => resp.status == 200 ? resp.json : null)
        .then(data => {
            console.log(data);
            sessionStorage.setItem("box_key", null);
            location.href = `/box?id=${box_id}`;
        })
}

function submitEntry() {
    let imageValid = validateItem(geoloc, coordinateDisplay);
    let locationValid = validateItem(textInput.value, textInput);
    let messageValid = validateItem(imageInput.files[0], imageContainer);

    validationMessage.removeAttribute("hidden");

    if (imageValid && locationValid && messageValid) {
        validationMessage.classList.remove("text-danger");
        validationMessage.classList.add("text-success");
        validationMessage.innerText = "Looks good!";
        loadingIcon.removeAttribute("hidden");
        postEntry();
    } else {
        validationMessage.classList.remove("text-success");
        validationMessage.classList.add("text-danger");
        validationMessage.innerText = "Make sure you complete all items!";
    }
}

if (imageInput.files[0]) {
    loadImage();
}