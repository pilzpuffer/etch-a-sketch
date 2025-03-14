const sketchField = document.querySelector('#mett-a-sketch');
const leftArm = document.querySelector('#left-arm');
const rightArm = document.querySelector('#right-arm');
const battleStart = document.querySelector("#battle-start");
const allColors = ["red", "orange", "yellow", "green", "light-blue", "blue", "purple", "black", "grey"];

const mettBody = document.querySelector(".top-part");
const textBubble = document.querySelector("#text-bubble");

//seems to get laggy at 64
let fieldSize = 16;
let currentDrawingColor = allColors[7];
let isDrawing = false;
let isErasing = false;



for (let i = 0; i < fieldSize; i++) {
    let newRow = document.createElement('div');
    newRow.classList.add("newRow");
    
    sketchField.appendChild(newRow);

        for(let j = 0; j < fieldSize; j++) {
            let innerCells = document.createElement('div');
            innerCells.classList.add("innerCells");
            newRow.appendChild(innerCells);
        }

}

const allSketchFieldElements = document.querySelectorAll("div.innerCells");

    mettBody.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("innerCells")) {
            if (event.button === 0) {
                isDrawing = true;
                event.target.classList.add(currentDrawingColor);
                gameState["hasDrawing"] = true;
            } else if (event.button === 2) {
                isErasing = true;
                event.target.classList.remove(...allColors);

                for (const div of allSketchFieldElements) {
                    if ([...div.classList].some(className => allColors.includes(className))) {
                        gameState["hasDrawing"] = true;
                        break;
                    } else {
                        gameState["hasDrawing"] = false;
                    }
                }
            }
            
        }
    })

    window.addEventListener("mouseup", () => {
            isDrawing = false;
            isErasing = false;
    })

    sketchField.addEventListener("mouseover", (event) => {
        if (isDrawing) {
                event.target.classList.add(currentDrawingColor);
                gameState["hasDrawing"] = true;
        } else if (isErasing) {
                event.target.classList.remove(...allColors);

                for (const div of allSketchFieldElements) {
                    if ([...div.classList].some(className => allColors.includes(className))) {
                        gameState["hasDrawing"] = true;
                        break;
                    } else {
                        gameState["hasDrawing"] = false;
                    }
                }
        }
    })

    function getNumber(element){
        const initialCss = getComputedStyle(document.documentElement).getPropertyValue(element);
        let prepare = initialCss.slice(0, -1);
        let toNumber = parseFloat(prepare); 
        toNumber = Math.round(toNumber * 10) / 10;
        return toNumber;
    };
    
    function adjustValue(element, operation, amount){
    
        let properNumber = getNumber(element);
        
        let result;
         
        if (operation === "reduce") {
            result = Math.round((properNumber - amount)*10) / 10;
        } else if (operation === "increase") {
            result = Math.round((properNumber + amount)*10) / 10;
        } else {
            console.log("Invalid operation");
            return;
        }
    
        if(element === "--rotate-value" || element === "--skew-value") {
            return `${result}deg`
        }
        
        return `${result}%`;
        }
    
        wentUp = false;
    
        const arms = {
            leftY: {
                upperLimit: 6.5,
                get lowerLimit() {
                    return (this.upperLimit + 1);
                }
            },
    
            rightY: {
                upperLimit: -3,
                get lowerLimit() {
                    return (this.upperLimit + 1);
                }
            },
    
            leftX: {
                upperLimit: 27,
                lowerLimit: 15
            },
    
            rightX: {
                upperLimit: -18,
                lowerLimit: -11
            },
        }
       
    function moveArms(direction, moveSpeed) {
        document.documentElement.style.setProperty('--left-hand-position-Y', adjustValue('--left-hand-position-Y', direction, moveSpeed));
        document.documentElement.style.setProperty('--right-hand-position-Y', adjustValue('--right-hand-position-Y', direction, moveSpeed));
    }

    const armsMotion = function () {
        let leftPositionY = getNumber('--left-hand-position-Y');
        let rightPositionY = getNumber('--right-hand-position-Y');
        let moveSpeed = 0.1;
    
        if (!wentUp && leftPositionY >= arms["leftY"]["upperLimit"] && rightPositionY >= arms["rightY"]["upperLimit"]) {
            if (leftPositionY === arms["leftY"]["upperLimit"] && rightPositionY === arms["rightY"]["upperLimit"]) {
                wentUp = true;
            }
            moveArms("reduce", moveSpeed);
        } else if (wentUp && leftPositionY <= arms["leftY"]["lowerLimit"] && rightPositionY <= arms["rightY"]["lowerLimit"]){
            if (leftPositionY === arms["leftY"]["lowerLimit"] && rightPositionY === arms["rightY"]["lowerLimit"]) {
                wentUp = false;
            }
            moveArms("increase", moveSpeed);
        }
    }
    
    let jazzHands = setInterval(armsMotion, 40);
    let waved = true;

    const waveMotion = function() {
        if (waved) {
            rightArm.src = "./images/mett-sprite/arm-right-1.png";
            waved = !waved;
        } else {
            rightArm.src = "./images/mett-sprite/arm-right-2.png";
            waved = true;
        }
    }
    
    let handWave = setInterval(waveMotion, 280);
    
    //if changed, left and right skews should be the same number - but the right skew should always be negative
    const bodyWiggle = {
        left: {
            skew: 1,
            get rotate() {
                return -this.skew;
            }
        },
    
        right: {
            skew: -1,
            get rotate() {
                return -this.skew;
            }
        }
    }
    
    let wentLeft = false;
    
    
    
    //works best if the number can be divided by 5/10 - else the math kind of breaks since decimals don't end up adding into a whole number
    //if it would be decided that this needs to be adjusted - relevant code would need to be refactored to allow for some degree of
    //leeway. though that will potentially break relevant math bits even further
    let swingTimes = 5; 
    
    //left and skew are not selected for a particular reason - since the values in that object are basically the same, it doesn't really make a difference
    function swingAmountBody (swingTimes) {
        let result = Math.round(((bodyWiggle["left"]["skew"])/swingTimes)*100)/100; 
        return Math.abs(result);
    }
    
    function swingBody(direction, swingTimes) {
        document.documentElement.style.setProperty('--rotate-value', adjustValue('--rotate-value', direction, swingTimes));
        document.documentElement.style.setProperty('--skew-value', adjustValue('--skew-value', direction, -swingTimes));
    }

    const swingingMotion = function () {

        let rotation = getNumber('--rotate-value');
        let skew = getNumber('--skew-value');
        let bodySwing = swingAmountBody(swingTimes);
    
       
        if (!mettBody.classList.contains("body-wiggle") && !leftArm.classList.contains("correct-arm") && !rightArm.classList.contains("correct-arm")) {
            mettBody.classList.add("body-wiggle");
            leftArm.classList.add("correct-arm") ;
            rightArm.classList.add("correct-arm");
            document.documentElement.style.setProperty('--arm-scaling', 1.5);
        }
    
            if (!wentLeft && rotation >= bodyWiggle["left"]["rotate"] && skew <= bodyWiggle["left"]["skew"]) {
            if (rotation === bodyWiggle["left"]["rotate"] && skew === bodyWiggle["left"]["skew"]) {
                wentLeft = true;
            }
            swingBody("reduce", bodySwing);
            
        } else if (wentLeft && rotation <= bodyWiggle["right"]["rotate"] && skew >= bodyWiggle["right"]["skew"]) {
            if (rotation === bodyWiggle["right"]["rotate"] && skew === bodyWiggle["right"]["skew"]) {
                wentLeft = false;
            }
            swingBody("increase", bodySwing);
    
        }
    }

let sideSwing = setInterval(swingingMotion, 40);

const actionButtons = document.querySelectorAll(".action-button");
const textField = document.querySelector("#text-field");
const bubbleTextField = document.querySelector("#bubble-textfield")
const starSpace = document.querySelector("#star-space");
const buttonSelect = document.querySelector("#button-select");
const buttonConfirm = document.querySelector("#button-select-confirm");
buttonSelect.volume = sameVolume;
buttonConfirm.volume = sameVolume;

const playerButtonSelection = function(event) {
event.currentTarget.classList.add("button-highlight");
event.currentTarget.firstElementChild.innerHTML = `<img id="yellow-heart" src="./images/yellow-soul-sprite.png">`;
};

const symbols = {
    fight: "#",
    act: "$",
    item: "%",
    mercy: "&"
}

const gameState = {
    actionButtonClicked: false,
    menuOptionConfirmed: false,
    hasDrawing: false,
    checkOutTimes: 0,

    currentActiveActionButton: {
        fight: 0,
        act: 0,
        item: 0,
        mercy: 0
    }
}

const removeButtonFocus = function () {
    actionButtons.forEach((div) => {
        div.classList.remove("button-highlight");
        
        if (div.classList.contains("action-button")) {
            let currentButton = div.getAttribute("id").split("-")[0];
            div.firstElementChild.innerHTML = symbols[currentButton];
        }
    })
}

const typeWriterSound = document.querySelector("#textbox-typing");
const battleTheme = document.querySelector("#battle-theme")
typeWriterSound.volume = sameVolume - 0.1;

function randomize (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomIndex (arr) {
    return Math.floor(Math.random() * arr.length)
}

/*
flirt:
"You ask Mettaton if he believes in love at first sight. ‘Naturally, darling! That’s why I keep mirrors everywhere~’ [Flirt]"
"You confess you’ve never met a robot quite like him. ‘But of course! I’m one of a kind, dear~’ [Flirt]"
"You promise to always be his number-one fan. ‘How charming! But do try to stand out, dear~’ [Flirt]
"You wink and tell Mettaton he’s a perfect 10. ‘ONLY TEN?! How utterly tragic!’ [Flirt]" - typewriter, mettTalk

"You ask if he believes in fate. He spins dramatically. ‘Fate? No, no, darling — destiny! And mine is to shine!’ [Flirt]" - flavorText, mettTalk

"You strike a pose and wink. The lights seem to shine a little brighter! [Flirt]" - flavorText
"You call Mettaton the most glamorous machine in existence. He already knew that, but clearly appreciates this sentiment. [Flirt]"


INSULT:
nothing is drawn:
"You tell Mettaton his design is dated.  He twirls dismissively. ‘Vintage, dear! Timeless elegance - unlike that attitude.’ [Insult]"
"You declare Mettaton's screen is looking especially empty today. He scoffs at that. ‘A pristine canvas, darling! The true masterpiece is yet to come.’ [Insult]"
"You ask Mettaton if his screen is supposed to look that dull. He gasps, insulted by the notion. ‘DULL?! Impossible! Every pixel of mine radiates sophistication!’ [Insult]"

something is drawn:
"You tell him that you've improved his look. He flicks his wrist. "Nonsense! Perfection needs no adjustments!" [Insult]"
"You critique your masterpiece, saying it’s the perfect representation of him. ‘Ah! So you’ve captured my brilliance? How thoughtful!’ [Insult]"
"You frown, saying that something about Mettaton still doesn’t look great."Scandalous! Even art struggles to contain my beauty!" [Insult]"
"You snicker, calling your drawing a budget version of him. He twirls. "Oh, how adorable! Even a discount Mettaton outshines the rest~"  [Insult]"

stick:
"You throw the stick. It bounces off Mettaton’s screen with a loud clunk. He gasps—‘Darling, I am not a fetching machine!’"
"You throw the stick. It lands on top of Mettaton with a soft plonk. He sighs—‘Ah, a gift? How touching~ But try roses next time!’"
"You throw the stick. Mettaton dramatically dodges—‘Scandalous! Is this an attack or an avant-garde performance?!’"
"You toss the stick onto his screen. Somehow it stays there. He doesn’t react. ‘…Darling, I hope that wasn’t an attempt at modern art.’"

*/

const mettSound1 = document.querySelector("#speech-effect-1");
const mettSound2 = document.querySelector("#speech-effect-2");
const mettSound3 = document.querySelector("#speech-effect-3");
const mettSound4 = document.querySelector("#speech-effect-4");
const mettSound5 = document.querySelector("#speech-effect-5");
const mettSound6 = document.querySelector("#speech-effect-6");
const mettSound7 = document.querySelector("#speech-effect-7");
const mettSound8 = document.querySelector("#speech-effect-8");
const mettSound9 = document.querySelector("#speech-effect-9");

const allMettSounds = [mettSound1, mettSound2, mettSound3, mettSound4, mettSound5, mettSound6, mettSound7, mettSound8, mettSound9];
allMettSounds.forEach(sound => sound.volume = sameVolume - 0.1);

//mettaton's words are output word-by-word instead of letter-by-letter - so a separate function will be needed for that + there will be a different mechanism for playing music
const typeWriter = function (location, phrase) {
    return new Promise((resolve) => {

    let phraseDivided = phrase.split(" ");
    let lettersDivided =[...phraseDivided.join(" ")];
    let i = 0;

    const wordByLetterOutput = setInterval(function() {

        if (i === lettersDivided.length) {
            clearInterval(wordByLetterOutput)

            resolve();
        } else {
            location.textContent += `${lettersDivided[i]}`;
            i++;      
        }
    }, 35)

    const musicEffects = setInterval(function() {

        if (i === lettersDivided.length) {
            clearInterval(musicEffects)
        } else {
            typeWriterSound.play();
            typeWriterSound.currentTime = 0;
        }
    }, 50)
});
}

const mettStick = [
    ["Darling, I am not a fetching machine!"], 
    ["Ah, a gift? How touching.", "But try roses next time!"], 
    ["Scandalous!", "Is this an attack or an avant-garde performance?!"], 
    ["…Darling, I hope that wasn’t an attempt at modern art."]
];

const stickText = [
    ["You throw the stick.","It bounces off Mettaton’s screen with a loud clunk."], 
    ["You throw the stick.", "It lands on top of Mettaton with a soft plonk."], 
    ["You throw the stick.", "Mettaton dodges, dramatically."], 
    ["You toss the stick onto Mettaton's screen.", "Somehow it just stays there. He doesn’t react, but he is not impressed by you now."]
];

const checkOut = 
[
    [`METTATON 8 ATK 999 DEF`, `His metal body renders him invulnerable to attack.`],
    [`METTATON 8 ATK 999 DEF`, `Yes, this still didn't change.`]
];

const mettCheckNone = [
    ["I see you've checked again!", "And oh — would you look at that? Nothing’s changed!"],
    ["Ah, a critic returning for a second glance?", "You’ll find the masterpiece is already perfect."],
    ["Repetition is the key to success!", "Except here.", "Here, it’s just a waste of time."],
    ["Oh, checking twice? How thorough!", "But the perfection remains unchanged."]
]

const mettCheckDrawn = [
    ["Checking again? Marvelous!", "Appreciate your own work, darling!", "Such bold choices… truly."],
    ["Checking again? What’s wrong, dear?", "Second thoughts about your artistic masterpiece?"],
    ["Ah, still looking? Marvelous!", "A true artist should always reevaluate their work...", "...or regret it."]
]


allText = {
    flavor: {
        stick: stickText,
        check: checkOut,
    },
    mettaton: {
        stick: mettStick,
        check: {
            mettCheckNone: mettCheckNone,
            mettCheckDrawn: mettCheckDrawn
        },
    },
}



const mettTalking = function (phrase) {
    return new Promise(async (resolve) => {
        let i = 0; 
        textBubble.classList.remove("gone");

        async function displayNextPhrase() {
            if (i >= phrase.length) {
                resolve();
                window.removeEventListener("click", displayNextPhrase);
                textBubble.classList.add("gone");
                return
            }

            let phraseDivided = phrase[i].split(" ");
            let j = 0;

            bubbleTextField.textContent = "";

            for (j; j < phraseDivided.length; j++) {
                bubbleTextField.textContent += phraseDivided[j] + " ";

                let randomSound = randomize(allMettSounds);
                randomSound.play(); //sound plays whenever a word shows

                await new Promise((resolve) => setTimeout(resolve, 100)); //wait before a new word
            }  

            i++; //move to next phrase
            window.addEventListener("click", displayNextPhrase);
        }

        await displayNextPhrase();
    })
}

            

const clearTextField = function () {
    textField.replaceChildren();
    gameState["actionButtonClicked"] = false;
    starSpace.classList.remove("invisible");

    removeButtonFocus();
}

let createMenuOption = function(containerName, providedText, actionApplied) {
    let heartSpace = document.createElement("div");
    let star = document.createElement("div");
    let optionName = document.createElement("div");

    containerName.classList.add("menu-element");
    heartSpace.classList.add("heart-space");
    star.classList.add("star");
    optionName.classList.add("option-name");

    star.textContent = "*";
    optionName.textContent = providedText;

    containerName.appendChild(heartSpace);
    containerName.appendChild(star);
    containerName.appendChild(optionName);

    textField.appendChild(containerName);

    containerName.addEventListener("mouseover", () => {
        buttonSelect.play();
        heartSpace.innerHTML = `<img id="yellow-heart" src="./images/yellow-soul-sprite.png">`;
    })

    containerName.addEventListener("mouseout", () => {
        heartSpace.innerHTML = "";
    })

    containerName.addEventListener("click", () => {
        buttonConfirm.play();
        actionApplied();
    }) 
}


battleStart.addEventListener("ended", function() {
    textBubble.classList.add("gone");
    const allCells = document.querySelectorAll(".innerCells");

const clearSketchField = function() {
    allCells.forEach((div) => {
        div.classList.remove(...allColors);
    })
    gameState["hasDrawing"] = false;
    clearTextField();
    buttonConfirm.play();
}

const handleMouseOver = function (event) {
    playerButtonSelection(event);
    buttonSelect.play();
}

const hideYellowHeart = function (event) {
    event.currentTarget.firstElementChild.innerHTML = `<img id="stand-in-for-yellow-heart" src="./images/red-soul-hidden.png">`;
}

let quietTimes = 0; //add to gamestate object later to clean things up
let musicOn = true;
let stayStill = 0;
let animationOn = true;
const allAudio = document.querySelectorAll("audio")

const successfulSelect = function() {
    clearTextField();
    buttonConfirm.play();
}

const musicQuiet = function () {
    if (quietTimes === 0) {
        battleTheme.pause();
        musicOn = false;
    } else if (quietTimes >= 1) {
        allAudio.forEach(audio => audio.volume = 0);
        sameVolume = 0;
        mettTalking("that's as quiet as things CAN be.."); //for testing, will need to change phrases in the future updates
    }

    quietTimes++;
    successfulSelect();
}

const musicBack = function () {
    if (!musicOn) {
        battleTheme.play()
        sameVolume = 0.2;
        quietTimes = 0;

        allAudio.forEach(audio => audio.volume = 0.2);
        battleTheme.volume = 0.1;
        typeWriterSound.volume = 0.1
        allMettSounds.forEach(sound => sound.volume = sameVolume - 0.1);

        musicOn = true;
        successfulSelect();
    } 
}

const stopMoving = function () {
    if (stayStill === 0) {
        clearInterval(sideSwing);
        
        document.documentElement.style.setProperty('--rotate-value', "0deg");
        document.documentElement.style.setProperty('--skew-value', "0deg");

        animationOn = false;
    } else if (stayStill >= 1) {
        clearInterval(handWave)
        clearInterval(jazzHands)
    }

    stayStill++;
 
    successfulSelect();
}

const restartMoving = function () {
    if (!animationOn) {
        sideSwing = setInterval(swingingMotion, 40);

        if (stayStill >= 1) {
            handWave = setInterval(waveMotion, 280)
            jazzHands = setInterval(armsMotion, 40);
        }
        
        animationOn = true;
        stayStill = 0;

        successfulSelect();
    }
}

const flavorText = function(lines) {
    return new Promise((resolve) => {
    
    let textLineOne = lines[0];
    let textLineTwo = lines[1];
    
    let lineOne = document.createElement("div");
    let lineTwo = document.createElement("div");

    let multiLine = document.createElement("div");
    multiLine.classList.add("multi-line-text");

    multiLine.appendChild(lineOne);
    multiLine.appendChild(lineTwo);

    textField.appendChild(multiLine);
        
    starSpace.textContent = `*
    *`

    const cleanUp = function() {
        starSpace.textContent = `*`;
        multiLine.remove();
        window.removeEventListener("click", cleanUp);
        resolve();
    }
    
    const firstLine = async () => {
        await typeWriter(lineOne, textLineOne);
        }

        if (lines.length === 2) { 
            const secondLine = async () => {
                await firstLine();
                await typeWriter(lineTwo, textLineTwo);
            }

            secondLine().then(() => {
                window.addEventListener("click", cleanUp);
            });

            } else if (lines.length === 1) {
                starSpace.textContent = `*`
                firstLine.then(() => {
                    window.addEventListener("click", cleanUp); 
                });
            }
})
}

const drawnOrNotConversation = async function (keyOne, keyTwo, topic, checkToIncrement) {

    let correctKey;

    if (gameState["hasDrawing"] === true) {
        correctKey = keyOne;
    } else {
        correctKey = keyTwo;
    }

    let selectedIndex = randomIndex(allText["mettaton"][topic][correctKey]);

const flavorLine = async () => {
    if (gameState[checkToIncrement] === 0) {
        await flavorText(allText["flavor"][topic][0]);
    } else {
        await flavorText(allText["flavor"][topic][1]);
    }
}

if (gameState[checkToIncrement] === 0) {
    await flavorLine()
} else {
    const mettResponding = async() => {
        await flavorLine();
        await mettTalking(allText["mettaton"][topic][correctKey][selectedIndex]);
    }
    mettResponding();
}

gameState[checkToIncrement]++;
}


const checkOut = async function() {
    successfulSelect();
    drawnOrNotConversation("mettCheckDrawn", "mettCheckNone", "check", "checkOutTimes")
};

// const flirt = function() {
//     successfulSelect();


// }

const stick = function() {
    successfulSelect();

    let selectedIndex = randomIndex(allText["flavor"]["stick"]);

    flavorText(allText["flavor"]["stick"][selectedIndex]).then(() => {
        mettTalking(allText["mettaton"]["stick"][selectedIndex]);
    });
}

const hideAndShow = function (functionOne, functionTwo, checkOne, checkTwo, checkedValue, comparator) { //comparator should be used like (a, b) => a (insert the needed check, like >= or === or what else) b)  example: (a, b) => a < b
    if (!checkOne && comparator(checkTwo, checkedValue)) {
        functionOne.classList.add("gone");
    } else {
        functionOne.classList.remove("gone");
    }

    functionTwo.classList.toggle("gone", checkOne) //if true, adds the gone class - if false, removes it
}
 
    actionButtons.forEach((div) => {
    
        div.addEventListener("mouseover", (event) => {
            if (gameState["actionButtonClicked"] === false && !event.currentTarget.classList.contains("button-highlight")) {
                handleMouseOver(event);
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight")) {
                handleMouseOver(event);
            }
        })

        div.addEventListener("click", (event) => {
            let currentButton = event.currentTarget.getAttribute("id").split("-")[0];

            if (gameState["actionButtonClicked"] === false) {

                buttonConfirm.play();

                hideYellowHeart(event);
                gameState["actionButtonClicked"] = true;
                gameState["currentActiveActionButton"][`${currentButton}`]+=1;
                    
                textField.textContent = "";
                starSpace.classList.add("invisible");
                    
                if (currentButton === "fight") {
                        //change the density of the drawing field
                        //should be a "hit" minigame similiar to one used in undertale for the fight action
                } else if (currentButton === "act") {
                        //sound
                        let stopMusic = document.createElement("div");
                        let restartMusic = document.createElement("div");

                        createMenuOption(stopMusic, "Quiet", musicQuiet);
                        createMenuOption(restartMusic, "Music", musicBack)

                        hideAndShow(stopMusic, restartMusic, musicOn, sameVolume, 0, (a, b) => a === b);

                        //movement
                        let stopWiggle = document.createElement("div");
                        let restartWiggle = document.createElement("div"); 

                        createMenuOption(stopWiggle, "Freeze", stopMoving); 
                        createMenuOption(restartWiggle, "Dance", restartMoving);

                        hideAndShow(stopWiggle, restartWiggle, animationOn, stayStill, 2, (a, b) => a >= b)

                        let check = document.createElement("div"); //will need to look into adding an extra "star" to the star section to the left of the textfield to fit undertale look
                        let flirt = document.createElement("div");
                        let insult = document.createElement("div");
                        let rate = document.createElement("div"); //ask mettaton to rate the drawing (need some function to check the colors of cells, determine which color is most prevalent -> show a line based on that + maybe depending on the drawing tool)
                        
                        //rate will be the act function that will complete this game - MTT will ask if this drawing is final, player will need to confirm
                        //after that, mettaton will "appraise" the drawing
                        //he will comment on the most used color, maybe there can be additional comments depending on the most prevalent color and on the amount of colored-in squares
                        //and then the drawing will be rated randomly. yeah. maybe I can add some extra checks, like, if the drawing contains more than a few colors, the amount of squares colored in + numbers can be deducted based on user's behavior
                        //like, insults would deduct points, but flirts will increase them
                        //once rated, it will be possible to fully spare MTT (his name will become yellow) - and the game will end!!!!
                        //if the rating will be lower than 8, MTT will initially threaten the player that he will kill them, but at the end will just tell that there's the show is on an ad break as there were not enough viewers - so he will have to save killing the player
                        //for the grand finale
                        //if the rating is somewhere around 1-3, MTT will be appalled at the player's lack of artistry - and tell them that they're too pathetic/not inspiring enough to be killed. 
                        //rainbow-colored drawing would automatically grant 5 points and the rest will depend on player's actions and the power of random
                        // there should be a separate check if too many points were deducted due to the player's bad behavior, then he will calculate their drawing score separately, but note that the player is an awful person 
                        
                        createMenuOption(check, "Check", checkOut);
                        // createMenuOption(flirt, "Flirt", flirting);
    
                        //+ check function if there are more than 6 elements on screen - in that case, they need to be transferred to the next page (will also be used in the items section) + need to do smth for justify-content to 

                } else if (currentButton === "item") {
                    //will need to add a rainbow pen, pencil, box of markers (colors for allColors array will be used there) + maybe some funny items? like a stick
                    let stickThrow = document.createElement("div");
                    createMenuOption(stickThrow, "Stick", stick);

                } else if (currentButton === "mercy") {
                    let spareOption = document.createElement("div");
                    createMenuOption(spareOption, "Mettaton", clearSketchField);
                }   
                    
            } else if (gameState["actionButtonClicked"] === true && gameState["currentActiveActionButton"][`${currentButton}`] >= 1) {
                clearTextField();
                buttonConfirm.play();
                gameState["currentActiveActionButton"][`${currentButton}`] = 0;

                buttonConfirm.addEventListener("ended", typeWriter("Previous content was erased because you clicked on an action button again")); //added for testing purposes
                mettTalking("chickened out, ey?");
            }
        })
            

        div.addEventListener("mouseout", (event) => {
            if (gameState["actionButtonClicked"] === false) {
                event.currentTarget.classList.remove("button-highlight");
            
                let currentSymbol = event.currentTarget.getAttribute("id").split("-")[0];
                event.currentTarget.firstElementChild.innerHTML = symbols[currentSymbol];
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight")) {
                hideYellowHeart(event);
            }
        });
});
})
