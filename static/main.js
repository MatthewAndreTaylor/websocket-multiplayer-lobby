// Setup a new connection
const socket = new WebSocket(`ws://${location.host}/echo`);

function generateUUID() {
    let uuid = "";
    const possible = "abcdef0123456789";
    for (let i = 0; i < 32; i++) {
        uuid += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return uuid;
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

let playerId;
let playerRef;
let players = {};
let playerElements = {};
const gameContainer = document.querySelector(".game-container");
const nameInput = document.querySelector("#player-name");

function handleArrowPress(deltaX, deltaY) {
    players[playerId].x = players[playerId].x + deltaX;
    players[playerId].y = players[playerId].y + deltaY;
    if (deltaX === 1) {
        players[playerId].direction = "right";
    }
    else if (deltaX === -1) {
      players[playerId].direction = "left";
    }
    const message = {
        type: 'playerUpdate',
        value: players[playerId]
    };
    socket.send(JSON.stringify(message));
}

socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log(data);

    switch (data.type) {
        case 'playersUpdate':
            players = data.value || {}
            Object.keys(players).forEach((key) => {
                const characterState = players[key];
                if (key in playerElements) {
                    let el = playerElements[key];
                    el.querySelector(".Character_name").innerText = characterState.name;
                    el.setAttribute("data-color", characterState.color);
                    el.setAttribute("data-direction", characterState.direction);
                    const left = 16 * characterState.x + "px";
                    const top = 16 * characterState.y + "px";
                    el.style.transform = `translate3d(${left}, ${top}, 0)`;
                } else {
                    const characterElement = document.createElement("div");
                    characterElement.classList.add("Character", "grid-cell");
                    characterElement.innerHTML = `
                    <div class="Character_shadow grid-cell"></div>
                    <div class="Character_sprite grid-cell"></div>
                    <div class="Character_name-container">
                        <span class="Character_name">guest</span>
                    </div>
                    <div class="Character_you-arrow"></div>`;
                    playerElements[characterState.id] = characterElement;
                    characterElement.setAttribute("data-color", characterState.color);
                    characterElement.setAttribute("data-direction", characterState.direction);
                    const left = 16 * characterState.x + "px";
                    const top = 16 * characterState.y + "px";
                    characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
                    if (characterState.id === playerId) {
                      characterElement.classList.add("you");
                    }
                    gameContainer.appendChild(characterElement);
                }
            });
            break
        case 'playerRemoved':
            const key = data.id;
            gameContainer.removeChild(playerElements[key]);
            delete playerElements[key];
            break
    }
});

socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened:", event);
    playerId = generateUUID();
    const message = {
      type: 'playerUpdate',
      value: {
        id: playerId,
        name: 'guest',
        direction: "right",
        color: randomChoice(playerColors),
        x: 0,
        y: 0
      }
    };
    socket.send(JSON.stringify(message));
});

socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event);
    const message = {
      type: 'playerRemoved',
      id: playerId
    };
    socket.send(JSON.stringify(message));
});



nameInput.addEventListener("change", (e) => {
  const newName = e.target.value || "guest";
  nameInput.value = newName;
  const updated_player = players[playerId];
  updated_player.name = newName

  const message = {
    type: 'playerUpdate',
    value: updated_player
  };
  socket.send(JSON.stringify(message));
});

new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));
new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));


