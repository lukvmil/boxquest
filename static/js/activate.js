const params = new URLSearchParams(window.location.search);
const questInput = document.getElementById("quest-input");
const guideInput = document.getElementById("guide-input");
const publicToggle = document.getElementById("public-toggle");

function postActivate() {
    let data = new FormData();
    data.append('public', publicToggle.checked);
    data.append('quest', questInput.value);
    data.append('guide', guideInput.value);
    data.append('box_key', sessionStorage.getItem('box_key'));

    console.log(data);

    let box_id = params.get('id');

    fetch(`/api/box/${box_id}`, {
        method: 'POST',
        body: data
    })
    .then(resp => resp.status == 200 ? resp.json() : null)
    .then(data => {
        console.log(data);
        location.href = `/box?id=${box_id}`
    })
}

function submitActivate() {
    
}