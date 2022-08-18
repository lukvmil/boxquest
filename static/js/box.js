const params = new URLSearchParams(location.search);
const addEntryButton = document.getElementById("add-entry");
const entryBody = document.getElementById("entry-body");
const entryTimestamp = document.getElementById("entry-timestamp");
const entryLocation = document.getElementById("entry-location");
const entryImages = document.getElementById("entry-images");
const entryControls = document.getElementById("entryControls");
const entryCarousel= new bootstrap.Carousel(entryControls);

const loadProximity = 1;

let boxData;
let pointSource;
let lineSource;
let markerLayer;
let dotLayer;
let lineLayer;
let activeEntryId;

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

    }

    loadProximateImages(id);

    activeEntryId = id;
    e = entryList[activeEntryId];
    if (!e) {return}
    entryBody.innerText = e.message;
    entryTimestamp.innerText = new Date(e.timestamp).toLocaleString();
    entryLocation.innerText = e.location_str;
    // entryImage.setAttribute("src", `api/img/${e.image}`);
}


if (params.has("k")) {
    let box_key = params.get("k");
    sessionStorage.setItem("box_key", box_key);
    fetch(`/api/get_id?key=${box_key}`)
        .then(resp => resp.json())
        .then(data => {
            location.replace(`${location.pathname}?id=${data.id}`, '');
        })
}
if (params.has("id")) {
    let box_id = params.get("id");
    fetch(`/api/box/${box_id}`)
        .then(resp => resp.status == 200 ? resp.json() : null)
        .then(box => {
            boxData = box;
            if (!box.active && sessionStorage.getItem('box_key')) {
                location.href = '/box/activate' + location.search;
            }
        });

    fetch(`/api/box/${box_id}/entries`)
        .then(resp => resp.status == 200 ? resp.json() : null)
        .then(entries => {
            if (!entries || !entries.length) {return;}
            console.log(`Loaded ${entries.length} entries`)
            generateCarouselItems(entries.length);
            entries.forEach((e, i) => {
                entryList.push(e);
                coords.push(e.location.reverse());
            });
            loadProximateImages(entries.length - 1);
            setActiveEntry(entries.length - 1);
            if (entries.length) {
                loadLines();
                loadPoints();
            }
        });
}

if (sessionStorage.getItem("box_key")) {
    addEntryButton.removeAttribute("hidden");
}

entryControls.addEventListener("slide.bs.carousel", event => {
    console.log("Carousel select: " + event.to);
    setActiveEntry(event.to);
})


let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-95, 37]),
        zoom: 3,
        maxZoom: 16
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

const dotStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: '#000',
        })
    })
});

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

    dotLayer = new ol.layer.Vector({
        source: pointSource,
        style: dotStyle
    });
    map.addLayer(markerLayer);
    // map.addLayer(dotLayer);
    let select = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: [markerLayer],
        style: dotStyle
    });

    map.addInteraction(select);

    select.on('select', e => {
        let features = e.target.getFeatures().getArray()
        if (features.length) {
            let name = features[0].get('name')
            console.log("Map select: " + name);
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

