const questCount = document.getElementById("quest-count");
const entryCount = document.getElementById("entry-count");
const savedQuests = document.getElementById("saved-quests");
const savedQuestList = document.getElementById("saved-quest-list");
const publicQuestList = document.getElementById("public-quest-list");
const questItemTemplate = document.getElementById("quest-item-template");

function createQuestItem(box) {
    let questItem = questItemTemplate.cloneNode(true);
    questItem.children[0].innerText = box.quest;
    questItem.children[1].innerText = box.id;
    questItem.href = `/box?id=${box.id}`
    questItem.classList.remove('visually-hidden');
    return questItem;
}

fetch('/api/stats')
    .then(resp => resp.json())
    .then(data => {
        questCount.innerText = data.active_quests;
        entryCount.innerText = data.entries;
    });

let knownBoxes = JSON.parse(localStorage.getItem("knownBoxes"));
if (knownBoxes) {
    knownBoxes.forEach(box_id => {
        console.log(box_id);
        fetch(`/api/box/${box_id}`)
            .then(resp => resp.status == 200 ? resp.json() : null)
            .then(box => {
                console.log(box);
                if (box && box.active) {
                    savedQuestList.appendChild(createQuestItem(box));
                    savedQuests.removeAttribute('hidden');
                }
            });
    })
}

fetch('/api/box/public')
    .then(resp => resp.json())
    .then(publicBoxes => {
        if (publicBoxes.length) {
            publicBoxes.forEach(box_id => {
                fetch(`/api/box/${box_id}`)
                    .then(resp => resp.status == 200 ? resp.json() : null)
                    .then(box => {
                        console.log(box);
                        if (box.active) {
                            publicQuestList.appendChild(createQuestItem(box));
                        }
                    });
            })
        }
    })