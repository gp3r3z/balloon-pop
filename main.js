let startButton = document.getElementById("start-button");
let inflateButton = document.getElementById("inflate-button");
let balloonElement = document.getElementById("balloon");
//#region Game Logic and Data

let gameLength = 10000; // ms 
let clockId = 0 ; 
let timeRemaining = 0 ; 



let clickCount = 0;
let height = 120;
let width = 100;
let inflationRate = 20;
let maxSize = 300;
let highestPopCount = 0 ; 
let currentPopCount = 0;
let currentPlayer = {};
let currentColor = "red";
let possibleColors = ["red", "green", "blue", "purple"];

function startGame() {
  

    document.getElementById("main-controls").classList.add('hidden');
    document.getElementById("game-controls").classList.remove('hidden');

    document.getElementById("scoreboard").classList.add('hidden');


    console.log("Game Start");
    startClock();
    setTimeout(stopGame, gameLength);

}


function startClock(){
    timeRemaining = gameLength ; 
drawClock()
  clockId =   setInterval(drawClock, 1000);
    
}

function stopClock(){

    clearInterval(clockId);
}

function drawClock(){
    let countdownElem = document.getElementById('countdown');
    countdownElem.innerText = (timeRemaining /1000).toString(); 
    timeRemaining -= 1000 // go down 1 ms 


}

function inflate() {
    clickCount++;
    height += inflationRate;
    width += inflationRate;
   checkBalloonPop();
   draw();
 
    
    
}

function checkBalloonPop(){
 
    if (height >= maxSize) {
        console.log("POPPED");
        balloonElement.classList.remove(currentColor);
        getRandomColor();
        balloonElement.classList.add(currentColor);

        document.getElementById("pop-sound").play();

        currentPopCount++;
        height = 40;
        width = 0;
        clickCount = 0;

        console.log("current data " + currentPopCount, height, width);
    }
}

function getRandomColor(){
   let i = Math.floor(Math.random() * possibleColors.length);
   currentColor = possibleColors[i];
}

function draw() {
  
    let clickCountElement = document.getElementById("click-count");
    let popCountElement = document.getElementById("pop-count");
    let highestPopCountElement = document.getElementById('high-pop-count');
    let playerNameElem = document.getElementById('player-name');


    balloonElement.style.height = height + "px";
    balloonElement.style.width = width + "px";


    clickCountElement.innerText = clickCount.toString();
    popCountElement.innerText = currentPopCount.toString();
    highestPopCountElement.innerText = currentPlayer.topScore.toString();
    playerNameElem.innerText = currentPlayer.name ; 
    
}


function stopGame () {
    console.log("Game is Over");
    document.getElementById("main-controls").classList.remove('hidden');
    document.getElementById("game-controls").classList.add('hidden');
    document.getElementById("game-controls").classList.add('hidden');

    clickCount = 0 
    height = 120 
    width = 100 



    if(currentPopCount > currentPlayer.topScore){
        currentPlayer.topScore = currentPopCount;
        console.log("new high score");
        savePlayers()
    }

    currentPopCount = 0 
    stopClock()
    draw()
    drawScoreboard()

}

// #endregion



let players = []
loadPlayers()


function setPlayer(event){

    event.preventDefault();
    let form = event.target;
    let playerName = form.playerName.value;

     currentPlayer =  players.find(player => player.name == playerName);

if(!currentPlayer){
    currentPlayer = { name: playerName, topScore: 0 }
    players.push(currentPlayer) 
    savePlayers()
}

    form.reset();
    document.getElementById("game").classList.remove("hidden")
    form.classList.add("hidden")
    draw()
    drawScoreboard()
 
}

function changePlayer(){
    document.getElementById("player-form").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden")
}


function savePlayers(){
    window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers(){

//accessing array from local storage
    let playersData = JSON.parse(window.localStorage.getItem("players"))


    // if no player data then use empty array else use local storage
    if(!playersData){
        players = []
    }else{
        players = playersData
    }
}

function drawScoreboard(){
    let template = "";

    players.sort((p1, p2)=> p2.topScore - p1.topScore)

    players.forEach(player => {
        template += `
        <div class="d-flex space-between">
        <span>
          <i class="fa fa-user"></i>
          ${player.name}
        </span>
      <span>Score: ${player.topScore}</span>
  </div>
  `
    })

    document.getElementById("players").innerHTML = template 
}
//add score board when JS is loaded
drawScoreboard()
