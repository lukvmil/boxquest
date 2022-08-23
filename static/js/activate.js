const params = new URLSearchParams(window.location.search);
const questInput = document.getElementById("quest-input");
const guideInput = document.getElementById("guide-input");
const publicToggle = document.getElementById("public-toggle");
const validationMessage = document.getElementById("validation-message")
const loadingIcon = document.getElementById("loading-icon");

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

function postActivate() {
    let data = new FormData();
    data.append('public', publicToggle.checked);
    data.append('quest', questInput.value);
    data.append('guide', guideInput.value);
    data.append('box_key', sessionStorage.getItem('box_key'));

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
    let questValid = validateItem(questInput.value, questInput);
    let guideValid = validateItem(guideInput.value, guideInput);

    validationMessage.removeAttribute("hidden");

    if (questValid && guideValid) {
        validationMessage.classList.remove("text-danger");
        validationMessage.classList.add("text-success");
        validationMessage.innerText = "Looks good!";
        loadingIcon.removeAttribute("hidden");
        postActivate();
    } else {
        validationMessage.classList.remove("text-success");
        validationMessage.classList.add("text-danger");
        validationMessage.innerText = "Make sure you complete all items!";
    }
}