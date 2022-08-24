const params = new URLSearchParams(window.location.search);
const questInput = document.getElementById("quest-input");
const guideInput = document.getElementById("guide-input");
const publicToggle = document.getElementById("public-toggle");
const validationMessage = document.getElementById("validation-message")
const loadingIcon = document.getElementById("loading-icon");
const exampleQuestList = document.getElementById("example-quest-list");
const exampleItemTemplate = document.getElementById("example-item-template");

const exampleQuests = [
    {
        "quest": "Send this tag around the world",
        "guide": "Take a picture (or selfie) of where you are, write how you feel about that place, and pass this tag on to a traveller. Try to keep it moving in the same direction!"
    },
    {
        "quest": "Do a good deed and pass it on",
        "guide": "Take a selfie and tell us how the previous person you helped you out. Then, do a good deed for someone else and give them this card so they can pay it foward!"
    },
    {
        "quest": "Under the same moon",
        "guide": "Take a picture of the moon the night you recieve this tag (or the night sky if it's a new moon). Reflect on our shared experience and connection to the moon. When you feel the time is right, pass this card on to someone else."
    },
    {
        "quest": "Trash clean up",
        "guide": "Head to a local park or wildlife area and spend some time picking up garbage. Once you're done, take a picture of all the trash you gathered and write down the name of the area and how long it took."
    },
    {
        "quest": "Get a selfie with Vitalik Buterin",
        "guide": "If you don't know Vitalik, take a selfie by yourself and pass this on to someone who might have a better chance. Eventually we'll get to him!"
    },
    {
        "quest": "Curated restaraunt list",
        "guide": "Wait to add an entry until you are at your favorite restaraunt, take a picture of the dish you ordered and write any recommendations for future visitors."
    }
]

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

function loadQuest(id) {
    questInput.value = exampleQuests[id].quest;
    guideInput.value = exampleQuests[id].guide;
}

exampleQuests.forEach((example, i) => {
    let exampleQuest = exampleItemTemplate.cloneNode(true);
    exampleQuest.innerText = example.quest;
    exampleQuest.onclick = function() {loadQuest(i);};
    exampleQuest.classList.remove('visually-hidden');
    exampleQuestList.appendChild(exampleQuest);
})