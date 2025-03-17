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
    flavorTextShown: false,
    mettTextShown: false,

    checkOutTimes: 0,
    flirtTimes: 0,
    performTimes: 0,
    insultTimes: 0,

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



const checkOut = [
    [`METTATON 8 ATK 999 DEF`, `His metal body renders him invulnerable to attack.`],
    [`METTATON 8 ATK 999 DEF`, `Yes, this still didn't change.`]
];

const mettCheckNone = [
    ["I see you've checked again!", "And oh — would you look at that? Nothing’s changed!"],
    ["Ah, a critic returning for a second glance?", "You’ll find the masterpiece is already perfect."],
    ["Repetition is the key to success!", "Except here.", "Here, it’s just a waste of time."],
    ["Oh, checking twice? How thorough!", "But the perfection remains unchanged."]
];

const mettCheckDrawn = [
    ["Back for another check? Marvelous!", "Appreciate your own work, darling!", "Such bold choices… truly."],
    ["Oh, you're checking it again? What’s wrong, dear?", "Second thoughts about your artistic masterpiece?"],
    ["Ah, still looking?", "A true artist should always reevaluate their work...", "...or regret it."]
];

const flavorPerformNone = [
    ["You insist you’re merely building suspense."], 
    ["You claim your masterpiece is invisible — a true avant-garde statement."],
    ['You dramatically insist that true art exists in the mind.'],
    ['You claim your empty canvas represents the boundless potential of the universe.'],
    ["You say you're still summoning the artistic spirits."],
    ['You dramatically gesture at the blank canvas, declaring it a statement on silence and restraint.'],
    ['You declare the blank space represents the beauty of nothingness.'],
    ['You say that every stroke must be perfect — and so you hesitate.'],
    ['You dramatically wave your hands over the canvas, insisting the spirits are guiding your hand.'],
];

const mettPerformNone = [
    ["Ah, the tension!","But darling, a crescendo means nothing without a note to build on!"],
    ['Oh, how daring! But let’s see if you can push the medium just a little further!'],
    ['Ah, yes - The Concept Of Art! Now, let’s see you manifest it!'],
    ['Oh! How profound!', 'But darling, the judges might call it lazy!'],
    ['Ah, delegation - a true director’s instinct!', 'But darling, this is a solo performance, so no outsourcing your genius!'],
    ['Oh! A bold move! But darling, an empty stage is only thrilling if something eventually happens!'],
    ['Oh, the elegance of the unseen! But sweetheart, let’s make sure they don’t mistake it for an artistic oversight!'],
    ['Perfection takes time, dear, but so does a show! Let’s not keep the audience waiting!'],
    ['Ah, so the spirits are your collaborators? How avant-garde!', 'But darling, this is your moment — no ghostwriting!'],
];

const flavorPerformDrawn = [
    ['You frame your creation with your hands and call it a masterpiece.'],
    ['You dramatically unveil your work like a magician revealing a trick.'],
    ['You bow, expecting applause.'],
    ['You step back, admiring your creation with a knowing smirk.'],
    ['You pose dramatically beside your drawing, as if you yourself also belong in a museum.'],
    ['You dramatically point to a single stroke, insisting it holds deep meaning.'],
    ['You claim your work is a love letter to expression itself!'],
    ['You stand proudly beside your art, hands on hips, nodding.'],
    ['You smirk and say that this piece will only get fully understood in 50 years.']
];

const mettPerformDrawn = [
    ['Oh! Such confidence! Now, let’s see if the critics agree!'],
    ['Gasp! Such showmanship! But will the art itself hold up to the drama?'],
    ['Oh, taking a bow already? But darling, we must leave them breathless first!'],
    ['Confidence, fabulous! But does it deserve the spotlight? Let’s see!'],
    ['Ah, living sculpture! But darling, let’s not make the audience wonder which piece they came to see!'],
    ['Ah, the essence of restraint! But dear, even a whisper must be part of a grand conversation!'],
    ['Oh, how passionate! But darling, let’s ensure it reads as poetry, not just scribbles!'],
    ['Oh, the confidence! But dear, does the art share your stage presence?'],
    ['Oh, a true visionary! But darling, why not dazzle the public now?']
];

const flavorPerformTooMuch = [
    ["test"],
    ["test"]
]

const mettPerformTooMuch = [
    ["test"],
    ["test"]
]

const flavorFlirtNone = [
    ['You declare that Mettaton is already the ultimate work of art.'],
    ['You lean in and call Mettaton the Ultimate Muse.'],
    ['You tell Mettaton that his beauty has rendered you incapable of holding a pen.'],
    ["You compliment Mettaton's dazzling charisma."],
    ['You declare your undying admiration for Mettaton.'],
    ['You ask Mettaton if he believes in love at first sight.'],
    ["You promise to always be Mettaton's number-one fan."],
    ['You confess you’ve never met a robot quite like Mettaton.'],
    ['You strike a pose and wink.', 'The lights seem to shine a little brighter!']
];

const mettFlirtNone = [
    ['Oh, darling! Such exquisite taste!', 'But I do want to see your artistic genius, too!'],
    ['A muse with no masterpiece?', 'Darling, this is artistic blasphemy!'],
    ['Ah! A tragic curse! But fear not, dear — I accept verbal tributes, too!'],
    ['Flattery will get you everywhere, darling!', 'But do keep going — my ego demands it!'],
    ['Of course you do, dear! But let’s really sell it — tears, music, confetti!'],
    ['Naturally, darling!', 'That’s why I keep mirrors everywhere.'],
    ['How charming! But do try to stand out, dear.'],
    ['But of course! I’m one of a kind, dear.'],
    ['']
];

const flavorFlirtDrawn = [
    ["You sigh, saying even your best work can't capture Mettaton's perfection."],
    ['You ask Mettaton if he’d autograph your artwork.'],
    ['You ask if he’d consider modeling for your next piece.'],
    ['You tell Mettaton your art was inspired by his beauty.'],
    ['You trace a heart around your drawing and wink.'],
    ['You wink and tell Mettaton he’s a perfect 10.'],
    ['You tell Mettaton he must be the brightest star in the Underground.'],
    ['You dramatically clutch your chest and declare you’ve fallen for him.'],
    ['You call Mettaton the most glamorous machine in existence.', 'He already knew that, but clearly appreciates this sentiment.']
];

const mettFlirtDrawn = [
    ['Oh, sweetheart, nothing could — but I do adore a devoted artist!'],
    ['Darling, my mere presence is the signature of excellence.'],
    ["Why, of course!", "But be warned, dear — no portrait could ever outshine the original."],
    ['Oh, darling, inspiration was inevitable!', ' But can your art truly contain my brilliance?'],
    ['Oh, how sweet!', 'But darling, where’s the grand show? ', 'The fireworks?', 'The thunderous applause I so richly deserve?'],
    ['ONLY TEN?!', 'How utterly tragic!'],
    ['Naturally, darling! But do say it louder — the cameras are rolling!'],
    ['Ah! A tragic, star-crossed romance!', 'Quick, someone cue the sweeping orchestral score!'],
    ['']
];

const flavorFlirtTooMuch = [
    ["test"],
    ["test"]
]

const mettFlirtTooMuch = [
    ["test"],
    ["test"]
]

const flavorInsultNone = [
    ["You tell Mettaton his design is dated.", "He twirls dismissively in response."],
    ["You declare Mettaton's screen is looking especially empty today."],
    ["You tell Mettaton that maybe he should tone it down a bit."],
    ["You say to Mettaton that he is a bit of a one-trick pony."],
    ["You suggest Mettaton could use a little humility for once."]
];
const mettInsultNone = [
    ["Vintage, dear! Timeless elegance - unlike that attitude."],
    ["A pristine canvas, darling!", "The true masterpiece is yet to come."],
    ["Tone it down?", "Oh, darling, I’m a symphony, not a lullaby.", "You wouldn’t understand true brilliance if it slapped you in the face."],
    ["One trick? Darling, every move I make is a masterpiece.", "I’d hate to see you try to do anything that isn’t utterly forgettable."],
    ["Please, darling, I’m not here to blend in with the background.", "You’re confusing me with someone else."]
];

const flavorInsultDrawn = [
    ["You tell Mettaton that you've improved his look."],
    ["You critique your masterpiece, saying it’s the perfect representation of Mettaton."],
    ["You snicker, calling your drawing a budget version of Mettaton."],
    ["You tell Mettaton he’s a little overhyped for your taste."]
];

const mettInsultDrawn = [
    ["Nonsense! Perfection needs no adjustments!"],
    ["Ah! So you’ve captured my brilliance? How thoughtful!"],
    ["Oh, how adorable! Even a discount Mettaton outshines the rest."],
    ["Sweetheart, I’m the only thing worth talking about!", "So I'd say I'm not hyped enough.", "Your taste is clearly as out of date as your opinions."]
];

//will be used on 3rd time Insult option is used
const flavorInsultTooMuch = [
    ["You throw out an insult that cuts through the air.", "The sound team quickly blurs the words with a loud, abrupt beep."],
    ["You push further, your words becoming sharper.", "Mettaton’s dazzling screen flickers, just a hint of irritation seeping through his cool composure."],
    ["You get bolder, throwing insults that make even the production team uneasy."],
    ["Your insults have gone too far, and the crew looks nervous.", "Mettaton’s usually vibrant shine seems to dull for a split second."],
    ["You call Mettaton something unthinkable.", "The production crew frantically cuts to a commercial break, but it’s too late."]
];
const mettInsultTooMuch = [
    ["Oh, darling, you’re really digging yourself a hole, aren’t you?", "Keep this up, and I may stop gracing you with my attention."],
    ["You’re testing my patience, aren’t you?", "Keep going, and I’ll have no sympathy left for you.", "Rudeness isn’t wit, darling — it’s a death sentence."],
    ["You’re really pushing it, darling", "If you’re not careful, you’ll find yourself in a much worse position than you realize.", "Not everyone takes insults lightly."],
    ["You’ve crossed a line now, darling.", "One more word, and you’ll regret ever uttering my name.", "You’ve lost the privilege of my attention."],
    ["That’s it.", "You’ve earned yourself a one-way ticket out of here.", " You want to keep insulting me?", "Well, let’s see how much you enjoy your final act."]
];


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




allText = {
    flavor: {
        stick: stickText,
        check: checkOut,
        flirt: {
            none: flavorFlirtNone,
            drawn:flavorFlirtDrawn,
            tooMuch: flavorFlirtTooMuch
        },
        perform: {
            none: flavorPerformNone,
            drawn: flavorPerformDrawn,
            tooMuch: flavorPerformTooMuch
        },
        insult: {
            none: flavorInsultNone,
            drawn: flavorInsultDrawn,
            tooMuch: flavorInsultTooMuch
        }
    },
    mettaton: {
        stick: mettStick,
        check: {
            none: mettCheckNone,
            drawn: mettCheckDrawn
        },
        flirt: {
            none: mettFlirtNone,
            drawn: mettFlirtDrawn,
            tooMuch: mettFlirtTooMuch
        },
        perform: {
            none: mettPerformNone,
            drawn: mettPerformDrawn,
            tooMuch: mettPerformTooMuch
        },
        insult: {
            none: mettInsultNone,
            drawn: mettInsultDrawn,
            tooMuch: mettInsultTooMuch
        }
    },
}

const mettTalking = function (phrase) {
    if (!phrase || (phrase.length === 1 && phrase[0] === "")) { 
        return Promise.resolve(); 
    } 

    return new Promise(async (resolve) => {
        let i = 0; 
        textBubble.classList.remove("gone");
        gameState["mettTextShown"] = true;

        async function displayNextPhrase() {
            if (i >= phrase.length) {
                setTimeout(removeBubble, 50);
                return;
            }

            let phraseDivided = phrase[i].split(" ");
            bubbleTextField.textContent = "";

            for (let word of phraseDivided) {
                bubbleTextField.textContent += word + " ";

                let randomSound = randomize(allMettSounds);
                randomSound.play(); // Play sound on each word

                await new Promise((resolve) => setTimeout(resolve, 100)); // Delay before next word
            }

            i++; // Move to next phrase
            window.addEventListener("click", displayNextPhrase, { once: true });
        }

        function removeBubble() {
                textBubble.classList.add("gone");
                bubbleTextField.textContent = "";
                resolve();
                gameState["mettTextShown"] = false;
                return;
        }

        await displayNextPhrase();
    });
};

            

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
    heartSpace.innerHTML = "<img id='stand-in-for-yellow-heart' src='./images/red-soul-hidden.png'></img>";
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
    gameState["flavorTextShown"] = true;
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
    

    const cleanUp = function() {
        starSpace.textContent = `*`;
        multiLine.remove();
        window.removeEventListener("click", cleanUp);
        gameState["flavorTextShown"] = false;
        resolve();
    }
    
    const firstLine = async () => {
        await typeWriter(lineOne, textLineOne);
        }

        if (lines.length === 2) { 
            starSpace.textContent = `*
            *`
            const secondLine = async () => {
                await firstLine();
                await typeWriter(lineTwo, textLineTwo);
            }

            secondLine().then(() => {
                window.addEventListener("click", cleanUp);
            });

            } else if (lines.length === 1) {
                starSpace.textContent = `*`
                firstLine().then(() => {
                    window.addEventListener("click", cleanUp); 
                });
            }
})
}

const checkConversation = async function (topic, checkToIncrement) {

    let correctKey;

    if (gameState["hasDrawing"] === true) {
        correctKey = "drawn";
    } else {
        correctKey = "none";
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

const defaultConversation = async function (topic, checkToIncrement) {

    let correctKey;

    if (gameState["hasDrawing"] === true) {
        correctKey = "drawn";
    } else {
        correctKey = "none";
    }

    let selectedIndex = randomIndex(allText["mettaton"][topic][correctKey]);

    const flavorLine = async () => {
        if (gameState[checkToIncrement] < 2) {
            await flavorText(allText["flavor"][topic][correctKey][selectedIndex]);
        } else {
            await flavorText(allText["flavor"][topic]["tooMuch"][0]); //will need to go line-by-line instead of random
        }
    }

    const mettLine = async () => {
        if (gameState[checkToIncrement] < 2) {
            await mettTalking(allText["mettaton"][topic][correctKey][selectedIndex]);
        } else {
            await mettTalking(allText["mettaton"][topic]["tooMuch"][0]);
        }
    }
    
    const conversation = async () => {
        await flavorLine();
        await mettLine();
    }
        
    conversation().then(() => gameState[checkToIncrement]++);
}


const checkOut = async function() {
    successfulSelect();
    checkConversation("check", "checkOutTimes");
};

const flirting = function() {
    successfulSelect();
    defaultConversation("flirt", "flirtTimes");
}

const performing = function() {
    successfulSelect();
    defaultConversation("perform", "performTimes");
}

const insulting = function() {
    successfulSelect();
    defaultConversation("insult", "insultTimes");
}

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
            if (gameState["actionButtonClicked"] === false && !event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                handleMouseOver(event);
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                handleMouseOver(event);
            }
        })

        div.addEventListener("click", (event) => {
            let currentButton = event.currentTarget.getAttribute("id").split("-")[0];

            if (gameState["actionButtonClicked"] === false && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {

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

                        //dialogue
                        let check = document.createElement("div"); //will need to look into adding an extra "star" to the star section to the left of the textfield to fit undertale look
                        let flirt = document.createElement("div");
                        let insult = document.createElement("div");
                        let perform = document.createElement("div");

                        //endgame
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
                        createMenuOption(flirt, "Flirt", flirting);
                        createMenuOption(perform, "Perform", performing);
                        createMenuOption(insult, "Insult", insulting);
    
                        //+ check function if there are more than 6 elements on screen - in that case, they need to be transferred to the next page (will also be used in the items section) + need to do smth for justify-content to 

                } else if (currentButton === "item") {
                    //will need to add a rainbow pen, pencil, box of markers (colors for allColors array will be used there) + maybe some funny items? like a stick
                    let stickThrow = document.createElement("div");
                    createMenuOption(stickThrow, "Stick", stick);

                } else if (currentButton === "mercy") {
                    let spareOption = document.createElement("div");
                    createMenuOption(spareOption, "Mettaton", clearSketchField);
                }   
                    
            } else if (gameState["actionButtonClicked"] === true && gameState["currentActiveActionButton"][`${currentButton}`] >= 1 && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                clearTextField();
                buttonConfirm.play();
                gameState["currentActiveActionButton"][`${currentButton}`] = 0;

                buttonConfirm.addEventListener("ended", typeWriter("Previous content was erased because you clicked on an action button again")); //added for testing purposes
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
