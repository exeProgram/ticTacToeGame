// References
/// <reference path="ui.ts"/>



let crossClicked = [];
let circleClicked = [];

var elementsVarV2 = document.getElementsByClassName("uninteracted-button");

var playerTurn:number = 1;
var player2Turn:number = 0;
var turn:number = 1;

var p1symb = "circle";
var p2symb = "cross";

let turnsElapsedTotal = 0;
let turnsElapsedCurrent= 0;

let AIMode = true;

let gameOngoing = true;

var player1win = false;
var player2win = false;

let winningConditions:Array<any> = [
    [1,2,3],
    [3,2,1],
    [2,5,8],
    [8,5,2],
    [3,6,9],
    [9,3,6],
    [7,4,1],
    [4,5,6],
    [6,5,4],
    [7,8,9],
    [9,8,7],
    [1,5,9],
    [9,5,1],
    [3,5,7],
    [7,5,3],
]

// NOTES

// AI NEEDS BEEFING IN ORDER TO DETECT WHEN THE OTHER PLAYER IS ABOUT TO WIN

let possiblePlacements = 9;
let occupiedPlacements:any = [];

    
function lockBoxes(){
    for(var i = 0; i < elementsVarV2.length; i++){
        var grabBox = elementsVarV2[i] as HTMLButtonElement;
        grabBox.disabled = true;
    }
}

function unlockBoxes(){
    for(var i = 0; i < elementsVarV2.length; i++){
        var grabBox = elementsVarV2[i] as HTMLButtonElement;
        if(grabBox.classList.contains("uninteracted-button")){
            grabBox.disabled = false;
        }
    }
}

var winningRule:any = [];


function winCheck(){

    if(gameOngoing === true){
        for(var i = 0; i < winningConditions.length; i++){
            var count = 0;
            for(var v=0; v < winningConditions[i].length; v++){
                var findBox = document.getElementById("b_"+winningConditions[i][v]);
                if(findBox.classList.contains("circle-button")){
                    count++;
                    if(count === 3){
                        winningRule = i;
                        // console.log(`%c ${winningRule} `, `Winning Rule`);
                        if(p1symb == "circle"){
                            player1win = true;
                            setTimeout(`endGame("1")`,1000);
                            gameOngoing = false;
                        }else{
                            player2win = true;
                            setTimeout(`endGame("2")`,1000);
                            gameOngoing = false;
                        }
                        pWin();
                    }
                }
            }
        }
    
        for(var i = 0; i < winningConditions.length; i++){
            var count = 0;
            for(var v=0; v < winningConditions[i].length; v++){
                var findBox = document.getElementById("b_"+winningConditions[i][v]);
                if(findBox.classList.contains("cross-button")){
                    count++;
                    if(count === 3){
                        winningRule = i;
                        // console.log(`%c ${winningRule} ', Winning Rule`);
                        if(p1symb == "cross"){
                            player1win = true;
                            setTimeout(`endGame("1")`,1000);
                            gameOngoing = false;
                        }else{
                            player2win = true;
                            setTimeout(`endGame("2")`,1000);
                            gameOngoing = false;
                        }
                        pWin();
                    }
                }
            }
        }
        console.log(occupiedPlacements.length)

        if(occupiedPlacements.length === 9 && player1win === false && player2win === false){
            gameOngoing = false;
            // console.log("No Winner");
            statsWinsUpdate(0,0,1)
            setTimeout(`endGame("3")`,1000);
            
        }

    }

}


function pWin(){
    gameOngoing = false;
    // console.log(`%c Received ${winningRule}`,`color:green`)
    if(player1win === true){
        console.log(`%c Player 1 Win`,'color: orange');
    }else if(player2win === true){
        console.log(`%c Player 2 Win`,'color: orange');
    }


    for(var i = 1; i <= possiblePlacements; i++){
        var combined = "b_"+i
        var grabElement = document.getElementById(combined);
        if(winningConditions[winningRule].includes(i)){
            grabElement.classList.replace("circle-button","circle-win");
            grabElement.classList.replace("cross-button","cross-win");
        }else{
            grabElement.style.opacity = "0.3";
            grabElement.classList.replace("uninteracted-button","dead-button");
        }
    }
}

function singePlayerChanger(){
    unlockBoxes();
}

function turnChange(){
    if(gameOngoing === true){
        turnsElapsedTotal++;
        turnsElapsedCurrent++;
        statsUpdate();

        winCheck();

        if(AIMode === false){
            setTimeout(singePlayerChanger, 500)
        }

        if(turn === 0){
            turn = 1;
        }else if(turn === 1){
            turn = 0;
        }


        if(turn == player2Turn && AIMode === true){
            computerPlacement();
        }

    }
}

function buttonClicked(numberClicked){
    if(gameOngoing === true){
        let numberConverted = parseInt(numberClicked);
        if(occupiedPlacements.includes(numberConverted)){

        }else{
            if(turn === playerTurn){
                var findSquare = document.getElementById("b_"+numberConverted) as HTMLInputElement;

                if(p1symb === "circle"){
                    findSquare.classList.replace("uninteracted-button","circle-button");
                    findSquare.disabled = true;
                    circleClicked.push(parseInt(numberClicked));
                    occupiedPlacements.push(parseInt(numberClicked));

                }else{
                    findSquare.classList.replace("uninteracted-button","cross-button");
                    findSquare.disabled = true;
                    crossClicked.push(parseInt(numberClicked));
                    occupiedPlacements.push(parseInt(numberClicked));
                }

            }else if(turn === player2Turn && AIMode === false){

                var findSquare = document.getElementById("b_"+numberConverted) as HTMLInputElement;

                if(p2symb === "circle"){
                    findSquare.classList.replace("uninteracted-button","circle-button");
                    findSquare.disabled = true;
                    circleClicked.push(parseInt(numberClicked));
                    occupiedPlacements.push(parseInt(numberClicked));

                }else{
                    findSquare.classList.replace("uninteracted-button","cross-button");
                    findSquare.disabled = true;
                    crossClicked.push(parseInt(numberClicked));
                    occupiedPlacements.push(parseInt(numberClicked));
                }
            }else{
                console.log("Not Players Turn");
            }
            lockBoxes();
            setTimeout(turnChange,600);
        }
    }
}


var boxCounter:number = 0;
var blankArray:any = [];
var findingPlacements = null;

function autoPlacements() {
    var findPossibleBoxes = findPossibleAutoPlacements() as HTMLInputElement;
    console.log(findPossibleBoxes)
    // console.log(data1);
    // console.log(data2)
    var maxDataCounter = 0;
    if(findPossibleBoxes !== null && findPossibleBoxes !== undefined){
        if(p2symb === "circle"){
            findPossibleBoxes.classList.replace("uninteracted-button","circle-button");
        }else{
            findPossibleBoxes.classList.replace("uninteracted-button","cross-button");
        }
        return true;
    }else{
        return null;
    }
}

function checkWinArray2(args){
    for(var i = 0; i < args.length; i++){
        var findBox = document.getElementById("b_"+args[i]);
        if(findBox.classList.contains("uninteracted-button")){
            var boxNum = findBox.id;
            var splitBox = boxNum.split("b_");
            occupiedPlacements.push(splitBox[1]);
            return findBox
        }
    }
}

var alreadyUsedArray = false;

function checkWinArray(args){
    var unintButtons= 0;
    var otherButtons = 0;
    for(var i = 0; i < args.length; i++){
        var checkItem = document.getElementById("b_"+args[i]);
        if(checkItem.classList.contains("uninteracted-button")){
            unintButtons++;
        }else if(checkItem.classList.contains(p1symb+"-button")){
            otherButtons++;
            if(otherButtons === 2){
                console.log("%c Win check needed","color: BLUE");
                return checkWinArray2(args);
            }
        }
    }
    return null;
}

function findPossibleAutoPlacements() {
    for(var i = 0; i < winningConditions.length; i++){
        var winAmount = checkWinArray(winningConditions[i])
        if(winAmount === null || winAmount === undefined){

        }else{
            console.log(winAmount);
            return winAmount;
        }

    }
    return null;
}

function computerPlacement(){
    if(gameOngoing === true){
        if(turn === player2Turn){
            lockBoxes();
            var findAuto = autoPlacements();
            console.log(`%c ${findAuto}`,`color: red;font-size-18px`)
            if(findAuto === null){
                var randomNumber:number = 0;
                var randomNumber = Math.floor((Math.random() * possiblePlacements) + 1);
                var computerChoice = randomNumber;
                if (occupiedPlacements.includes(randomNumber) === true) {
                    if(occupiedPlacements.length != 9){
                        // console.log("Returning")
                        computerPlacement();
                        return;
                    }
                }else{
                    var selectBox = document.getElementById("b_"+computerChoice) as HTMLInputElement;
                    if(p2symb === "circle"){
                        selectBox.classList.replace("uninteracted-button","circle-button");
                        occupiedPlacements.push(computerChoice);
                        selectBox.disabled = true;
                    }else{
                        selectBox.classList.replace("uninteracted-button","cross-button");
                        occupiedPlacements.push(computerChoice);
                        selectBox.disabled = true;
                    }
                    turnChange();
                    setTimeout(unlockBoxes, 500);
                    // console.log(computerChoice);
                }
            }else{
                turnChange();
                setTimeout(unlockBoxes, 500);
            }
        }
    }
}
computerPlacement();

function resetPlacements(){
    var doc1:any = document.querySelectorAll(".cross-button");
    var doc2:any = document.querySelectorAll(".circle-button");
    var doc3:any = document.querySelectorAll(".cross-win");
    var doc4:any = document.querySelectorAll(".circle-win");
    var doc5:any = document.querySelectorAll(".dead-button");

    doc1.forEach(function(e){
        e.className = 'uninteracted-button';
        e.disabled = false;
        e.style.opacity = "1";
    });

    doc2.forEach(function(e){
        e.className = 'uninteracted-button';
        e.disabled = false;
        e.style.opacity = "1";
    });

    doc3.forEach(function(e){
        e.className = 'uninteracted-button';
        e.disabled = false;
        e.style.opacity = "1";
    });

    doc4.forEach(function(e){
        e.className = 'uninteracted-button';
        e.disabled = false;
        e.style.opacity = "1";
    });

    doc5.forEach(function(e){
        e.className = 'uninteracted-button';
        e.disabled = false;
        e.style.opacity = "1";
    });


}

async function startGame(){
    await resetPlacements();
    turnsElapsedCurrent = 0;
    statsUpdate();
    gameOngoing = true;
    player1win = false;
    player2win = false;
    occupiedPlacements = [];
    turn = 1;
    
};


