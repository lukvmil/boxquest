const params = new URLSearchParams(location.search);
const addEntryButton = document.getElementById("add-entry");
const entryDisplay = document.getElementById("entry-display");
const entryBody = document.getElementById("entry-body");
const entryTimestamp = document.getElementById("entry-timestamp");
const entryLocation = document.getElementById("entry-location");
const entryImages = document.getElementById("entry-images");
const entryControls = document.getElementById("entryControls");
const entryCarousel= new bootstrap.Carousel(entryControls);
const entryCount = document.getElementById("entry-count");
const questText = document.getElementById("quest-text");
const guideText = document.getElementById("guide-text");
const introModal = new bootstrap.Modal(document.getElementById('intro-modal'));
const reportModal = new bootstrap.Modal(document.getElementById('report-modal'));
const reportSuccessModal = new bootstrap.Modal(document.getElementById('report-success-modal'));
const reportQuestRadio = document.getElementById("report-quest-radio");
const reportEntryRadio = document.getElementById("report-entry-radio");
const reportMessage = document.getElementById("report-message");
const reportValidationMessage = document.getElementById("report-validation-message");
const emailModal = new bootstrap.Modal(document.getElementById("email-modal"));
const emailInput = document.getElementById("email-input");
const emailValidationMessage = document.getElementById("email-validation-message");
const emailSuccessModal = new bootstrap.Modal(document.getElementById('email-success-modal'));

const loadProximity = 1;

let boxData;
let pointSource;
let lineSource;
let markerLayer;
let lineLayer;
let activeEntryId;
let mapSelect;

const coords = []
const entryList = []


function generateCarouselItems(count) {
    function createCarouselItem() {
        let img = document.createElement('img');
        img.className = 'd-block w-100 card-img-bottom active';
        let div = document.createElement('div');
        div.className = "carousel-item";
        div.appendChild(img);
        return div;
    }

    let firstItem = document.getElementById('initial-entry-image')
    for (let i = 0; i < count - 1; i++) {
        entryImages.insertBefore(createCarouselItem(), firstItem);
    }
}

function loadEntryImage(id) {
    let entryImage = entryImages.children[id];
    if (entryImage.loaded) {return}
    entryImage.children[0].src = `/api/img/${entryList[id].image}`;
    entryImage.loaded = true;
}

function loadProximateImages(id) {
    let proximateImages = [id];
    let max = entryList.length - 1;
    let min = 0;
    let currentId = id;

    for (let i = 1; i <= loadProximity; i++) {
        let nextId = currentId - 1;
        if (nextId < min) {nextId = max;}
        currentId = nextId;
        proximateImages.push(currentId);
    }

    currentId = id;

    for (let i = 1; i <= loadProximity; i++) {
        let nextId = currentId + 1;
        if (nextId > max) {nextId = min;}
        currentId = nextId;
        proximateImages.push(currentId);
    }

    proximateImages.forEach(id => loadEntryImage(id));
}

function setActiveEntry(id, from) {
    if (from == "map") {
        entryCarousel.to(id);
    }

    if (from == "carousel") {
        mapSelect.getFeatures().clear();
        mapSelect.getFeatures().push(pointFeatures[id]);
    }

    loadProximateImages(id);

    activeEntryId = id;
    e = entryList[activeEntryId];
    if (!e) {return}
    entryBody.innerText = e.message;
    entryTimestamp.innerText = new Date(e.timestamp).toLocaleString();
    entryLocation.innerText = e.location_str;
    entryCount.innerText = `#${id+1}/${entryList.length}`;
}


if (params.has("k")) {
    let box_key = params.get("k");
    sessionStorage.setItem("box_key", box_key);
    fetch(`/api/get_id?key=${box_key}`)
        .then(resp => resp.json())
        .then(data => {
            let knownBoxes = new Set(JSON.parse(localStorage.getItem("knownBoxes")));
            if (knownBoxes) {
                knownBoxes.add(data.id);
            } else {
                knownBoxes = [data.id];
            }
            localStorage.setItem("knownBoxes", JSON.stringify(Array.from(knownBoxes)));
            location.replace(`${location.pathname}?id=${data.id}`, '');
        })
}

if (params.has("id")) {
    let box_id = params.get("id");
    fetch(`/api/box/${box_id}`)
        .then(resp => resp.status == 200 ? resp.json() : null)
        .then(box => {
            if (!box.active && sessionStorage.getItem('box_key')) {
                location.href = '/box/activate' + location.search;
            }
            boxData = box;
            questText.innerText = box.quest;
            guideText.innerText = box.guide;
        });

    fetch(`/api/box/${box_id}/entries`)
        .then(resp => resp.status == 200 ? resp.json() : null)
        .then(entries => {
            if (!entries || !entries.length) {return;}
            entryDisplay.removeAttribute('hidden');
            console.log(`Loaded ${entries.length} entries`)
            generateCarouselItems(entries.length);
            entries.forEach((e, i) => {
                entryList.push(e);
                coords.push(e.location.reverse());
            });
            loadProximateImages(entries.length - 1);
            if (entries.length) {
                loadLines();
                loadPoints();
            }
            setActiveEntry(entries.length - 1, "carousel");
        });
}

if (sessionStorage.getItem("box_key")) {
    let box_key = sessionStorage.getItem("box_key");
    fetch(`/api/get_id?key=${box_key}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.id == params.get('id')) {
                addEntryButton.removeAttribute("hidden");
            }
        });
}

if (!localStorage.getItem("returning_user")) {
    introModal.show();
}

if (!localStorage.getItem("asked_email") && params.get("redirect")) {
    localStorage.setItem("asked_email", true);
    emailModal.show();
}

entryControls.addEventListener("slide.bs.carousel", event => {
    setActiveEntry(event.to, "carousel");
})

function validateItem(condition, element) {
    if (condition) {const guideText = document.getElementById("guide-text");

        element.classList.remove("border-danger");
        element.classList.add("border-success");
        return true;
    } else {
        element.classList.remove("border-success");
        element.classList.add("border-danger");
        return false;
    }
}

function postReport() {
    let data = new FormData();
    data.append('type', reportQuestRadio.checked ? 'quest' : 'entry');
    data.append('reason', reportMessage.value);
    data.append('entry_id', entryList[activeEntryId].id);

    let box_id = params.get('id');

    fetch(`/api/box/${box_id}/report`, {
        method: 'POST',
        body: data
    })
    .then(resp => resp.status == 200 ? resp.json() : null)
    .then(data => {
        reportModal.hide();
        reportSuccessModal.show();
    })
}

function submitReport() {
    let messageValid = validateItem(reportMessage.value, reportMessage);

    reportValidationMessage.removeAttribute("hidden");

    if (messageValid) {
        reportValidationMessage.classList.remove("text-danger");
        reportValidationMessage.classList.add("text-success");
        reportValidationMessage.innerText = "Looks good!";
        postReport();
    } else {
        reportValidationMessage.classList.remove("text-success");
        reportValidationMessage.classList.add("text-danger");
        reportValidationMessage.innerText = "Make sure you complete all items!";
    }
}

function postEmail() {
    let data = new FormData();
    data.append('email', emailInput.value);

    let box_id = params.get('id');

    fetch(`/api/email`, {
        method: 'POST',
        body: data
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.success) {
            emailModal.hide();
            emailSuccessModal.show();
        } else {

        }
    })
}

function submitEmail() {
    let data = new FormData();
    data.append('email', emailInput.value);

    let box_id = params.get('id');

    fetch(`/api/email`, {
        method: 'POST',
        body: data
    })
    .then(resp => resp.json())
    .then(data => {
        emailValidationMessage.removeAttribute("hidden");
        if (data.success) {
            emailValidationMessage.classList.remove("text-danger");
            emailValidationMessage.classList.add("text-success");
            emailValidationMessage.innerText = "Looks good!";
            emailModal.hide();
            emailSuccessModal.show();
        } else {
            emailValidationMessage.classList.remove("text-success");
            emailValidationMessage.classList.add("text-danger");
            emailValidationMessage.innerText = "Please enter a valid email address";
        }
    });
}

let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-95, 37]),
        zoom: 3
    })

});

const markerStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#fff',
        }),
        stroke: new ol.style.Stroke({
            color: '#212529',
            width: 4,
        }),
    }),
});

const selectedStyle = [
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#fff'
            }),
            stroke: new ol.style.Stroke({
                color: '#212529',
                width: 4
            })
        })
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 4,
            fill: new ol.style.Fill({
                color: '#000',
            })
        })
    })
]

const lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: "#212529",
        width: 4
    })
});

const lineFeatures = [];
const pointFeatures = [];

function loadPoints() {
    let count = 0;
    coords.forEach(c => {
        pointFeatures.push(
            new ol.Feature({
                geometry: new ol.geom.Point(
                    ol.proj.fromLonLat(c)
                ),
                name: count
            })
        );
        count += 1;
    });
    pointSource = new ol.source.Vector({ features: pointFeatures });
    map.getView().fit(pointSource.getExtent(), {padding: [100, 100, 100, 100], maxZoom: 14});
    markerLayer = new ol.layer.Vector({
        source: pointSource,
        style: markerStyle
    });

    map.addLayer(markerLayer);
    mapSelect = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: [markerLayer],
        style: selectedStyle
    });

    map.addInteraction(mapSelect);

    mapSelect.on('select', e => {
        let features = e.target.getFeatures().getArray()
        if (features.length) {
            let name = features[0].get('name')
            setActiveEntry(name, "map");
        }
    });
}



function loadLines() {
    for (let i = 0; i < coords.length - 1; i++) {
        lineFeatures.push(
            new ol.Feature({
                geometry: new ol.geom.LineString([
                    ol.proj.fromLonLat(coords[i]),
                    ol.proj.fromLonLat(coords[i + 1])
                ]),
            })
        );
    }
    lineSource = new ol.source.Vector({ features: lineFeatures });
    lineLayer = new ol.layer.Vector({
        source: lineSource,
        style: lineStyle
    });
    map.addLayer(lineLayer);
}

