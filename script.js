const sketchField = document.querySelector('#mett-a-sketch');
const leftArm = document.querySelector('#left-arm');
const rightArm = document.querySelector('#right-arm');

const battleStart = document.querySelector("#battle-start");
const romanceTheme = document.querySelector("#flirt-route");
romanceTheme.volume = sameVolume - 0.1;

const allColors = ["red", "orange", "yellow", "green", "lightBlue", "blue", "purple", "black", "grey"];

const mettBody = document.querySelector(".top-part");
const textBubble = document.querySelector("#text-bubble");

let allNumbers = []; //colors for the rainbowPen function

    for (let i = 1; i <= 255; i++) {
        allNumbers.push(i);
    }

function randomize (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const randomRGB = () => `rgb(${randomize(allNumbers)}, ${randomize(allNumbers)}, ${randomize(allNumbers)})`;

function applyRainbowPen(event) {
    event.target.style.backgroundColor = randomRGB();
}

const applyEtchPen = (event) => {
    const initialColor = `rgba(0, 0, 0, 0.1)`;

    const getColor = getComputedStyle(event.target).getPropertyValue("background");
    const getCurrentAlphaValue = parseFloat(getColor.split(",")[3]);
    
    if (getCurrentAlphaValue >= 0.9) {
        return; // Stop execution if alpha is already 0.99
    }

    if (getCurrentAlphaValue >= 0.1 && getCurrentAlphaValue <= 0.9) {
        const newAlphaValue = Math.round((getCurrentAlphaValue + 0.1) * 10) / 10;
        event.target.style.background = `rgba(0, 0, 0, ${newAlphaValue})`;
    } else {
        event.target.style.background = initialColor;
    }

}

const erase = function (event) {
    event.target.className = "innerCells";
    event.target.style.backgroundColor = "";
    event.target.removeAttribute("style");
}

const applyMarker = (event) => {
    erase(event);
    event.target.classList.add(gameState["currentDrawingColor"]);
}


const flirtRoute = function() {
    const petals = {
        max_amount: 120,
        max_size: 16,
        max_speed: 2
    };

    if (gameState["routeStages"]["flirtRouteStage"] === 4) {
        leftArm.src = "./images/mett-sprite/arm-left-rose.png";
        battleTheme.pause();
        romanceTheme.play();

        let petalsBackground = document.querySelector("#petals-canvas");
        const leftSideWidth = window.innerWidth * 0.2;

        // **If the canvas does not exist, create it**
        if (!petalsBackground) {
            petalsBackground = document.createElement("canvas");
            petalsBackground.style.position = "fixed";
            petalsBackground.style.top = "0";
            petalsBackground.style.transform = `translateX(${leftSideWidth}px)`; // Transform for better layer handling
            petalsBackground.style.pointerEvents = "none";
            petalsBackground.style.zIndex = "-1";
            document.body.appendChild(petalsBackground);
        }

        const ctx = petalsBackground.getContext("2d");
        if (!ctx) {
            console.error("Canvas context could not be retrieved.");
            return;
        }

        function updateCanvasSize() {
            if (!mettBody) {
                console.error("Mettaton's body not found.");
                return;
            }

            petalsBackground.width = mettBody.clientWidth;
            petalsBackground.height = mettBody.clientHeight;
        }

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        const petalColors = ["#e5414d", "#bc1d30", "#ec6060"];

        function createPetal() {
            return {
                x: Math.random() * petalsBackground.width,
                y: Math.random() * petalsBackground.height,
                size: Math.random() * petals.max_size + 2,
                speed: Math.random() * petals.max_speed + 0.5,
                sway: Math.random() * 2 - 1,
                angle: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                color: petalColors[Math.floor(Math.random() * petalColors.length)],
                timeOffset: Math.random() * Math.PI * 2
            };
        }

        const petalsShown = Array.from({ length: petals.max_amount }, createPetal);

        function drawPetal(petal) {
            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate((petal.angle * Math.PI) / 180);
            ctx.fillStyle = petal.color;
        
            ctx.beginPath();
            ctx.moveTo(0, 0);
        
            ctx.bezierCurveTo(
                -petal.size * 0.5, -petal.size * 0.3,
                -petal.size * 0.6, -petal.size * 0.8,
                0, -petal.size
            );
            
            ctx.bezierCurveTo(
                petal.size * 0.6, -petal.size * 0.8,
                petal.size * 0.5, -petal.size * 0.3,
                0, 0
            );
        
            ctx.fill();
            ctx.restore();
        }

        function updatePetal(petal) {
            petal.y += petal.speed;
            petal.x += Math.sin(petal.timeOffset + petal.y * 0.02) * 1.5;
            petal.angle += petal.rotationSpeed;

            if (petal.y > petalsBackground.height) {
                Object.assign(petal, createPetal());
                petal.y = -petal.size;
            }
        }

        function animate() {
            if (!gameState["isAnimating"]) {
                petalsBackground.remove();
                return;
            }
            ctx.clearRect(0, 0, petalsBackground.width, petalsBackground.height);
            petalsShown.forEach(petal => {
                updatePetal(petal);
                drawPetal(petal);
            });

            requestAnimationFrame(animate);
        }

        // **Delay animation slightly to ensure positioning is correct**
        setTimeout(() => {
            animate();
        }, 50);
    }

        if (gameState["routeFinished"]['flirt'] === true) {
            setTimeout(function() {
                leftArm.src = "./images/mett-sprite/arm-left.png";
                romanceTheme.pause();
                battleTheme.play();
                gameState["isAnimating"] = false;
            }, 150)    
        }
};


const insultRoute = function() {

}

const performRoute = function() {

}

const gameState = {
    //drawing
    isDrawing: false,
    isErasing: false,
    hasDrawing: false,
    fieldSize: 16, //gets kinda laggy at 64 when animation is enabled
    currentDrawingColor: allColors[7],
    drawTool: {
        marker: true,
        etchPen: false,
        rainbowPen: false
    },

    //text
    flavorTextShown: false,
    mettTextShown: false,

    //dialogue variables
    checkOutTimes: 0,
    flirtTimes: 0,
    performTimes: 0,
    insultTimes: 0,
    routeStages: {
        flirtRouteStage: 0,
        performRouteStage: 0,
        insultRouteStage: 0,
    },
    routeFunctions: {
        flirt: flirtRoute,
        perform: insultRoute,
        insult: performRoute
    },
    routeFinished: {
        flirt: false,
        perform: false,
        insult: false
    },

    //for animation/sound tracking
    quietTimes: 0,
    stayStill: 0,
    musicOn: true,
    animationOn: true,
    isAnimating: true,
    waved: true,
    wentLeft: false,

    //button state
    actionButtonClicked: false,
    menuOptionConfirmed: false,
    pageNavigationOn: false,
    currentActiveActionButton: {
        fight: 0,
        act: 0,
        item: 0,
        mercy: 0
    },
    symbols: {
        fight: "#",
        act: "$",
        item: "%",
        mercy: "&"
    }
}

for (let i = 0; i < gameState["fieldSize"]; i++) {
    let newRow = document.createElement('div');
    newRow.classList.add("newRow");
    
    sketchField.appendChild(newRow);

        for(let j = 0; j < gameState["fieldSize"]; j++) {
            let innerCells = document.createElement('div');
            innerCells.classList.add("innerCells");
            newRow.appendChild(innerCells);
        }

}

const allSketchFieldElements = document.querySelectorAll("div.innerCells");

    mettBody.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("innerCells")) {
            if (event.button === 0) {
                gameState["isDrawing"] = true;
                event.target.classList.add(gameState["currentDrawingColor"]);
                gameState["hasDrawing"] = true;
                if (gameState["drawTool"]["marker"]) {
                    applyMarker(event);
                } else if (gameState["drawTool"]["etchPen"]) {
                    applyEtchPen(event);
                } else if (gameState["drawTool"]["rainbowPen"]) {
                    applyRainbowPen(event);
                }
            } else if (event.button === 2) {
                gameState["isErasing"] = true;
                erase(event);

                const mainTextColor = getComputedStyle(document.documentElement).getPropertyValue("--main-text-color").trim();
                for (const div of allSketchFieldElements) {
                    const backgroundColor = getComputedStyle(div).getPropertyValue("background-color").trim();
        
                    // Check if the background is neither transparent nor the main text color
                    if (backgroundColor !== mainTextColor && backgroundColor !== "transparent" && backgroundColor !== "") {
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
        gameState["isDrawing"] = false;
        gameState["isErasing"] = false;
    })

    sketchField.addEventListener("mouseover", (event) => {
        if (gameState["isDrawing"]) {
                event.target.classList.add(gameState["currentDrawingColor"]);
                gameState["hasDrawing"] = true;

                if (gameState["drawTool"]["marker"]) {
                    applyMarker(event);
                } else if (gameState["drawTool"]["etchPen"]) {
                    applyEtchPen(event);
                } else if (gameState["drawTool"]["rainbowPen"]) {
                    applyRainbowPen(event);
                }
        } else if (gameState["isErasing"]) {
             erase(event);

                const mainTextColor = getComputedStyle(document.documentElement).getPropertyValue("--main-text-color").trim();
                for (const div of allSketchFieldElements) {
                    const backgroundColor = getComputedStyle(div).getPropertyValue("background-color").trim();
                    // Check if the background is neither transparent nor the main text color
                    if (backgroundColor !== mainTextColor && backgroundColor !== "transparent" && backgroundColor !== "") {
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

    const waveMotion = function() {
        if (gameState["waved"]) {
            rightArm.src = "./images/mett-sprite/arm-right-1.png";
            gameState["waved"] = !gameState["waved"];
        } else {
            rightArm.src = "./images/mett-sprite/arm-right-2.png";
            gameState["waved"] = true;
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
    
            if (!gameState["wentLeft"] && rotation >= bodyWiggle["left"]["rotate"] && skew <= bodyWiggle["left"]["skew"]) {
            if (rotation === bodyWiggle["left"]["rotate"] && skew === bodyWiggle["left"]["skew"]) {
                gameState["wentLeft"] = true;
            }
            swingBody("reduce", bodySwing);
            
        } else if (gameState["wentLeft"] && rotation <= bodyWiggle["right"]["rotate"] && skew >= bodyWiggle["right"]["skew"]) {
            if (rotation === bodyWiggle["right"]["rotate"] && skew === bodyWiggle["right"]["skew"]) {
                gameState["wentLeft"] = false;
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

const removeButtonFocus = function () {
    actionButtons.forEach((div) => {
        div.classList.remove("button-highlight");
        
        if (div.classList.contains("action-button")) {
            let currentButton = div.getAttribute("id").split("-")[0];
            div.firstElementChild.innerHTML = gameState["symbols"][currentButton];
        }
    })
}

const typeWriterSound = document.querySelector("#textbox-typing");
const battleTheme = document.querySelector("#battle-theme")
typeWriterSound.volume = sameVolume - 0.1;

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

const flavorQuietOnce = [
    ["You ask for something to plug your ears.", "The production team immediately provides earplugs labeled 'FOR OVERLY SENSITIVE ARTISTS'."],
    ["You declare that true visionaries need silence.", "A rogue stagehand immediately hands you a beret and sunglasses."],
    ["You cover your ears dramatically.", "A sympathetic audience member tosses you a pair of earmuffs. They’re sequined."]
];

const flavorQuietTwice = [
    ["You motion for total silence, gesturing dramatically.", "The production team, now visibly sweating, scrambles to comply."],
    ["You insist that true artistry needs complete focus.", "The sound technician buries their face in their hands."],
    ["You call for a dramatic pause, silencing everything.", "The audience leans in, breath held."],
    ["You gesture for complete silence.", "And for once, even the ever-present stage lights flicker uncertainly."]

];

const flavorQuietDisabled = [
    ["You flick the switch back on.", "Suddenly, a triumphant orchestral swell fills the air. Confetti inexplicably falls from above."],
    ["You concede that the experience could use some sound.", "The stage lights brighten approvingly."],
    ["You cautiously restore the soundtrack.", "The studio exhales collectively."],
    ["You reluctantly restore the sound for 'artistic compromise'.", "A jazzy flourish plays as if to welcome you back."]
]

const mettQuietOnce = [
    ["Oh, sweetheart, did I overwhelm your delicate artiste sensibilities?", "I do have that effect on people!"],
    ["A masterpiece demands silence, I see!", "Well, I’ll just sit here reveling in your silence...", "...until the time comes to applaud your brilliance."],
    ["Oh, darling, suffering for art’s sake has never looked so glamorous!", "But don’t worry, I’ll gracefully endure your silence."]
];

const mettQuietTwice = [
    ["Oh, so it’s that kind of performance!", "A pantomime, a mystery, a whispered secret… Delightful!"],
    ["Darling, if you needed peace, you could have just asked!", "But fine — let’s see if your talent is loud enough without the fanfare."],
    ["Oh, the tension! The drama!", "I do love an artist who understands the power of anticipation!"],
    ["Oh, craving that old Hollywood charm, are we?", "A silent film? A tragedy!", "But worry not — I always have a monologue ready!"]

];

const mettQuietDisabled = [
    ["A dramatic return!", "A scene worthy of me!", "Oh, darling, you do have taste!"],
    ["Oh, how relieved I am!", "Silence is one thing, but a star without sound? Unthinkable!"],
    ["A wise move!", "Art without ambiance is like a performance without applause! Which is to say, quite tragic!"],
    ["See? Much better!", "Now, let’s make some noise, darling!"]
]

const flavorStopOnce = [
    [""],
    [""],
    [""]
];

const flavorStopTwice = [
    [""],
    [""],
    [""]

];

const flavorStopDisabled = [
    [""],
    [""],
    [""]
]

const mettStopOnce = [
    [""],
    [""],
    [""]
];

const mettStopTwice = [
    [""],
    [""],
    [""]

];

const mettStopDisabled = [
    [""],
    [""],
    [""]
]

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
    ["test2"],
    ["flavorThree"],
    ["flavorFour"],
    ["flavorFive"]
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
    ["flavorOne"],
    ["flavorTwo"],
    ["flavorThree"],
    ["flavorFour"],
    ["flavorFive"]
]

const mettFlirtTooMuch = [
    ["mettOne"],
    ["mettTwo"],
    ["mettThree"],
    ["mettFour"],
    ["mettFive"]
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
        sound: {
            firstChange: flavorQuietOnce,
            secondChange: flavorQuietTwice,
            changeToDefault: flavorQuietDisabled
        },
        motion: {
            firstChange: flavorStopOnce,
            secondChange: flavorStopTwice,
            changeToDefault: flavorStopDisabled
        },
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
        sound: {
            firstChange: mettQuietOnce,
            secondChange: mettQuietTwice,
            changeToDefault: mettQuietDisabled
        },
        motion: {
            firstChange: mettStopOnce,
            secondChange: mettStopTwice,
            changeToDefault: mettStopDisabled
        },
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

let createMenuOption = function(objectName, containerName, providedText, actionApplied) {
    let menuElement = objectName[containerName].data; //to get the div info
    menuElement.setAttribute("id", objectName[containerName].id)

    let heartSpace = document.createElement("div");
    let star = document.createElement("div");
    let optionName = document.createElement("div"); 

    menuElement.classList.add("menu-element");
    heartSpace.classList.add("heart-space");
    star.classList.add("star");
    optionName.classList.add("option-name");

    star.textContent = "*";
    heartSpace.innerHTML = "<img id='stand-in-for-yellow-heart' src='./images/red-soul-hidden.png'></img>";
    optionName.textContent = providedText;

    menuElement.appendChild(heartSpace);
    menuElement.appendChild(star);
    menuElement.appendChild(optionName);

    textField.appendChild(menuElement);

    menuElement.addEventListener("mouseover", () => {
        buttonSelect.play();
        heartSpace.innerHTML = `<img id="yellow-heart" src="./images/yellow-soul-sprite.png">`;
    })

    menuElement.addEventListener("mouseout", () => {
        heartSpace.innerHTML = "<img id='stand-in-for-yellow-heart' src='./images/red-soul-hidden.png'></img>";
    })

    menuElement.addEventListener("click", () => {
        buttonConfirm.play();
        actionApplied();
    }) 
}

const pageNavigation = document.querySelector("#page-navigation");

battleStart.addEventListener("ended", function() {
    textBubble.classList.add("gone");
    pageNavigation.classList.add("gone");

    const allCells = document.querySelectorAll(".innerCells");

const clearSketchField = function() {
    allCells.forEach((div) => {
        div.className = "innerCells";
        div.style.backgroundColor = "";
        div.removeAttribute("style");
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

//add to gamestate object later to clean things up
const allAudio = document.querySelectorAll("audio")

const successfulSelect = function() {
    clearTextField();
    buttonConfirm.play();
}

const musicQuiet = function () {
    if (gameState["quietTimes"] === 0) {
        battleTheme.pause();
        gameState["musicOn"] = false;
    } else if (gameState["quietTimes"] >= 1) {
        allAudio.forEach(audio => audio.volume = 0);
        sameVolume = 0;
    }

    successfulSelect();
    twoStepConversation("sound", "quietTimes"); 
}

const musicBack = function () {
    if (!gameState["musicOn"]) {
        battleTheme.play()
        sameVolume = 0.2;

        allAudio.forEach(audio => audio.volume = 0.2);
        battleTheme.volume = 0.1;
        typeWriterSound.volume = 0.1
        allMettSounds.forEach(sound => sound.volume = sameVolume - 0.1);

        
        successfulSelect();
        restoreDefaults("sound", "musicOn", "quietTimes");
    } 
}

const stopMoving = function () {
    if (gameState["stayStill"] === 0) {
        clearInterval(sideSwing);
        
        document.documentElement.style.setProperty('--rotate-value', "0deg");
        document.documentElement.style.setProperty('--skew-value', "0deg");

        gameState["animationOn"] = false;
    } else if (gameState["stayStill"] >= 1) {
        clearInterval(handWave)
        clearInterval(jazzHands)
    }

    gameState["stayStill"]++;
 
    successfulSelect();
}

const restartMoving = function () {
    if (!gameState["animationOn"]) {
        sideSwing = setInterval(swingingMotion, 40);

        if (gameState["stayStill"] >= 1) {
            handWave = setInterval(waveMotion, 280)
            jazzHands = setInterval(armsMotion, 40);
        }
        
        gameState["animationOn"] = true;
        gameState["stayStill"] = 0;

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

//at the moment, this pattern is used only for checkOut option
const checkConversation = async function (topic, checkToIncrement) { 
    successfulSelect();
    let correctKey = gameState["hasDrawing"] ? "drawn" : "none";
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

//used for music/animation handling
const twoStepConversation = async function (topic, checkToIncrement) {
    successfulSelect();
    let selectedIndex = randomIndex(allText["mettaton"][topic]['firstChange']);
    

    const flavorLine = async () => {
        if (gameState[checkToIncrement] === 0) {
            await flavorText(allText["flavor"][topic]['firstChange'][selectedIndex]);
        } else {
            await flavorText(allText["flavor"][topic]['secondChange'][selectedIndex]);
        }
        
    }

    const mettResponding = async() => {
        await flavorLine();

        if (gameState[checkToIncrement] === 0) {
            await mettTalking(allText["mettaton"][topic]['firstChange'][selectedIndex]);
        } else {
            await mettTalking(allText["mettaton"][topic]['secondChange'][selectedIndex]);
        }
        
    }
    
    mettResponding().then(() => gameState[checkToIncrement]++);
}

//used for music/animation handling
const restoreDefaults = async function(topic, checkToDefaultOne, checkToDefaultTwo) {
    successfulSelect();
    let selectedIndex = randomIndex(allText["mettaton"][topic]['firstChange']);
    

    const flavorLine = async () => {
        await flavorText(allText["flavor"][topic]['changeToDefault'][selectedIndex]);
    }

    const mettResponding = async() => {
        await flavorLine();
        await mettTalking(allText["mettaton"][topic]['changeToDefault'][selectedIndex]);
    }
  
    mettResponding().then(() => {
        gameState[checkToDefaultOne] = true;
        gameState[checkToDefaultTwo] = 0;
    });
}


const defaultConversation = async function (topic, checkToIncrement) {
    successfulSelect();
    let correctKey = gameState["hasDrawing"] ? "drawn" : "none";
    let selectedIndex = randomIndex(allText["mettaton"][topic][correctKey]);

    if (gameState[checkToIncrement] < 2) {
        await flavorText(allText["flavor"][topic][correctKey][selectedIndex]);
        await mettTalking(allText["mettaton"][topic][correctKey][selectedIndex]).then(() => gameState[checkToIncrement]++);
        
    } else {
        let tooMuchFlavor = allText["flavor"][topic]["tooMuch"];
        let tooMuchMett = allText["mettaton"][topic]["tooMuch"];
        let routeFunction = gameState["routeFunctions"][`${topic}`];

        await routeFunction();

        await flavorText(tooMuchFlavor[gameState["routeStages"][`${topic}RouteStage`]]);
        if (gameState["routeStages"][`${topic}RouteStage`] >= 4) {
            await mettTalking(tooMuchMett[gameState["routeStages"][`${topic}RouteStage`]]).then(() => {
                gameState["routeFinished"][topic] = true;
            })
        } else {
            await mettTalking(tooMuchMett[gameState["routeStages"][`${topic}RouteStage`]]);
        }

        await routeFunction();
        gameState["routeStages"][`${topic}RouteStage`]++;
    } 
}


const checkOut = async function() {
    checkConversation("check", "checkOutTimes");
};

const flirting = function() {
    defaultConversation("flirt", "flirtTimes");
}

const performing = function() {
    defaultConversation("perform", "performTimes");
}

const insulting = function() {
    defaultConversation("insult", "insultTimes");
}

const rating = function() {
    console.log("testing");
}

const stick = function() {
    successfulSelect();

    let selectedIndex = randomIndex(allText["flavor"]["stick"]);

    flavorText(allText["flavor"]["stick"][selectedIndex]).then(() => {
        mettTalking(allText["mettaton"]["stick"][selectedIndex]);
    });
}

const checkTool = function (selectedTool) {
    Object.keys(gameState["drawTool"]).forEach(tool => {
        if (tool === selectedTool) {
            gameState["drawTool"][tool] = true;
        } else {
            gameState["drawTool"][tool] = false;
        }
    })
}

const allMarkers = function () {
    buttonConfirm.play();
    textField.replaceChildren();
    starSpace.classList.add("invisible");
    let currentMarkerColor;

    markerBox = {};

    function capitalizeFirstLetter(str) {
        let firstCapWord = str[0].toUpperCase() + str.slice(1);
        const vowelsToFilter = ['a', 'e', 'i', 'o', 'u'];

        //concrete method for shortening specific color keywords
        firstCapWord = firstCapWord.includes("Light") 
        ? firstCapWord.replace("Light", "Lt") 
        : firstCapWord.includes("Dark") 
            ? firstCapWord.replace("Dark", "Dk")
            : firstCapWord;

        firstCapWord = firstCapWord.includes("Blue")
        ? firstCapWord.replace("Blue", "Blu") 
        : firstCapWord;

        let firstCap = firstCapWord[0];
        let restOfWord = firstCapWord.slice(1);

        if (firstCapWord.length >= 4 && !firstCapWord.includes("Blu")) {
            const deVoweled = restOfWord.split("").filter((letter) => !vowelsToFilter.includes(letter)).join('');
            return firstCap + deVoweled;
        } else {
            return firstCapWord;
        }
      }

    

    for (color of allColors) {
        markerBox[color] = document.createElement("div");
        markerBox[color].id = `marker-${color}`;

        const getColor = function (event) {
            currentMarkerColor = event.target.id;
            return currentMarkerColor;
        }
        
        markerBox[color].addEventListener("click", getColor);

        const drawThisColor = function () {
            successfulSelect();
            checkTool("marker");

            gameState["currentDrawingColor"] = allColors[`${allColors.indexOf(`${currentMarkerColor.split("-")[1]}`)}`];
        }

        createMenuOption(markerBox[color], `${capitalizeFirstLetter(`${color}`)}Mrk`, drawThisColor);
    }
}

const etchPencil = function() {
    successfulSelect();
    checkTool("etchPen");

    gameState["currentDrawingColor"] = "etchPen"; 
};

const rainbowPencil = function() {
    successfulSelect();
    checkTool("rainbowPen");

    gameState["currentDrawingColor"] = "rainbowPen"
}

const hideAndShow = function (functionOne, functionTwo, checkOne, checkTwo, checkedValue, comparator) { //comparator should be used like (a, b) => a (insert the needed check, like >= or === or what else) b)  example: (a, b) => a < b
    if (!gameState[checkOne] && comparator(checkTwo, checkedValue)) {
        functionOne.classList.add("gone");
    } else {
        functionOne.classList.remove("gone");
    }

    functionTwo.classList.toggle("gone", gameState[checkOne] === true) //if true, adds the gone class - if false, removes it
}

const createPageNavigation = function(pageNumber, providedText) {

    let heartSpace = document.createElement("div");
    let textSpace = document.createElement("div");

    pageNumber.classList.add("page-selection");
    heartSpace.classList.add("heart-space");
    textSpace.classList.add("page-text");

    heartSpace.innerHTML = "<img id='stand-in-for-yellow-heart' src='./images/red-soul-hidden.png'></img>";
    textSpace.textContent = providedText;

    pageNumber.appendChild(heartSpace);
    pageNumber.appendChild(textSpace);

    pageNavigation.appendChild(pageNumber);

    pageNumber.addEventListener("mouseover", () => {
        buttonSelect.play();
        heartSpace.innerHTML = `<img id="yellow-heart" src="./images/yellow-soul-sprite.png">`;
    })

    pageNumber.addEventListener("mouseout", () => {
        heartSpace.innerHTML = "<img id='stand-in-for-yellow-heart' src='./images/red-soul-hidden.png'></img>";
    })
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
                        //should be a "hit" minigame similar to one used in undertale for the fight action
                } else if (currentButton === "act") {
                    const storedNodes = {
                        nodesToStay: {},
                        nodesToMove: {}
                    };

                    pageOne = document.createElement("div");
                    pageTwo = document.createElement("div");

                    let currentPage = 1;
                    let idOfStayingElements;
                    let idOfMovedElements;   
                    let allElements;
                    

                    const optionCountObserver = new MutationObserver(() => {
                        allElements = Array.from(textField.querySelectorAll(":scope > div:not(.gone)"));

                        if (currentPage === 1) {
                            const elementsToStay = allElements.slice(0, Math.min(6, allElements.length));
                            idOfStayingElements = elementsToStay.map(node => node.id);

                                if (elementsToStay.length > 0) {
                                    for (let i = 0; i < Math.min(6, elementsToStay.length); i++) {
                                        storedNodes["nodesToStay"][elementsToStay[i].id] = elementsToStay[i];
                                    }
                                }
                        }
                        

                        if (allElements.length > 6){
                            const elementsToMove = allElements.slice(6);
                            idOfMovedElements = elementsToMove.map(node => node.id);

                            for (let i = 0; i < elementsToMove.length; i++) {
                                const elementId = elementsToMove[i].id;

                                storedNodes["nodesToMove"][elementId] = elementsToMove[i];
                                document.getElementById(elementId)?.remove();

                                delete storedNodes["nodesToStay"][elementId];
                                idOfStayingElements = idOfStayingElements.filter(id => id !== elementId);
                            }
                        }

                        if (Object.keys(storedNodes["nodesToMove"]).length >= 1) {
                            if (!gameState["pageNavigationOn"]) {
                                pageNavigation.classList.remove("gone");
                                gameState["pageNavigationOn"] = true;
    
                                if (!pageNavigation.contains(pageOne)) {
                                    createPageNavigation(pageOne, "Page 1");
                                    pageOne.classList.add("invisible");
                                }
                                if (!pageNavigation.contains(pageTwo)) {
                                    createPageNavigation(pageTwo, "Page 2");
                                }
                            }  
                                
                                pageOne.addEventListener("click", function(){
                                    currentPage = 1;
                                    buttonConfirm.play();
                                    textField.replaceChildren();
                                    pageOne.classList.add("invisible");
                                    pageTwo.classList.remove("invisible");

                                    for (let id of idOfStayingElements) {
                                        if (storedNodes["nodesToStay"][id]) {
                                            textField.appendChild(storedNodes["nodesToStay"][id]);
                                        }
                                    }     
                                   
                                })
    
                                pageTwo.addEventListener("click", function(){
                                    currentPage = 2;
                                    buttonConfirm.play();
                                    textField.replaceChildren();
                                    pageOne.classList.remove("invisible");
                                    pageTwo.classList.add("invisible");

    
                                    for (let id of idOfMovedElements) {
                                        if (storedNodes["nodesToMove"][id]) {
                                            textField.appendChild(storedNodes["nodesToMove"][id]);
                                        }
                                    } 
                                })
                            }
                    });
                    
                    optionCountObserver.observe(textField, { childList: true, subtree: false });     
                    

                    let menuOptions = {
                        //endgame
                        rate: {
                            id: "rate",
                            data: document.createElement("div")
                        },
                        
                        //music
                        stopMusic: {
                            id: "stopMusic",
                            data: document.createElement("div")
                        },
                        restartMusic: {
                            id: "restartMusic",
                            data: document.createElement("div")
                        },

                        //animation
                        stopWiggle: {
                            id: "stopWiggle",
                            data: document.createElement("div")
                        },
                        restartWiggle: {
                            id: "stopMusic",
                            data: document.createElement("div")
                        },

                        //dialogue
                        check: {
                            id: "check",
                            data: document.createElement("div")
                        },
                        flirt: {
                            id: "flirt",
                            data: document.createElement("div")
                        },
                        insult: {
                            id: "insult",
                            data: document.createElement("div")
                        },
                        perform: {
                            id: "perform",
                            data: document.createElement("div")
                        }
                    }

                    let menuActions = {
                        //endgame
                        rate: () => createMenuOption(menuOptions, "rate", "Rate", rating),

                        //music
                        stopMusic: () => createMenuOption(menuOptions, "stopMusic", "Quiet", musicQuiet),
                        restartMusic: () => createMenuOption(menuOptions, "restartMusic", "Music", musicBack),

                        //animation
                        stopWiggle: () => createMenuOption(menuOptions, "stopWiggle", "Freeze", stopMoving),
                        restartWiggle: () => createMenuOption(menuOptions, "restartWiggle", "Dance", restartMoving),

                        //dialogue
                        check: () => createMenuOption(menuOptions, "check", "Check", checkOut),
                        flirt: () => createMenuOption(menuOptions, "flirt", "Flirt", flirting),
                        insult:  () => createMenuOption(menuOptions, "insult", "Insult", insulting),
                        perform: () => createMenuOption(menuOptions, "perform", "Perform", performing),

                    }

                    for (let key in menuActions) {
                        menuActions[key]();
                    }

                        hideAndShow(menuOptions.stopMusic.data, menuOptions.restartMusic.data, "musicOn", sameVolume, 0, (a, b) => a === b);
                        hideAndShow(menuOptions.stopWiggle.data, menuOptions.restartWiggle.data, "animationOn", "stayStill", 2, (a, b) => a >= b);


                    if (gameState["hasDrawing"]) {
                            menuOptions["rate"]["data"].classList.add("yellow-text");
                            menuOptions["rate"]["data"].classList.remove("gone");
                    } else if (!gameState["hasDrawing"]) {
                        menuOptions["rate"]["data"].classList.add("gone");
                    }   
                        
                         //ask mettaton to rate the drawing (need some function to check the colors of cells, determine which color is most prevalent -> show a line based on that + maybe depending on the drawing tool)
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
                        

                        Object.keys(gameState["routeFinished"]).forEach(route => {
                            if (gameState["routeFinished"][route] && menuOptions[route]) {
                                menuOptions[route].classList.add("gone");
                            }
                        })

                } else if (currentButton === "item") {
                    const availableItems = {
                        stickThrow: document.createElement("div"),
                        markerBox: document.createElement("div"),
                        etchPen: document.createElement("div"),
                        rainbowPen: document.createElement("div")
                    }
                    //will need to add a rainbow pen, pencil, box of markers (colors for allColors array will be used there) + maybe some funny items? like a stick

                    createMenuOption(availableItems["stickThrow"], "Stick", stick);
                    createMenuOption(availableItems["markerBox"], "MarkBox", allMarkers);
                    createMenuOption(availableItems["etchPen"], "EtchPen", etchPencil);
                    createMenuOption(availableItems["rainbowPen"], "RnbwPen", rainbowPencil)

                } else if (currentButton === "mercy") {
                    let spareOption = document.createElement("div");
                    createMenuOption(spareOption, "Mettaton", clearSketchField);
                }   
                    
            } else if (gameState["actionButtonClicked"] === true && gameState["currentActiveActionButton"][`${currentButton}`] >= 1 && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                clearTextField();
                buttonConfirm.play();
                gameState["currentActiveActionButton"][`${currentButton}`] = 0;
            }
        })
            

        div.addEventListener("mouseout", (event) => {
            if (gameState["actionButtonClicked"] === false) {
                event.currentTarget.classList.remove("button-highlight");
            
                let currentSymbol = event.currentTarget.getAttribute("id").split("-")[0];
                event.currentTarget.firstElementChild.innerHTML = gameState["symbols"][currentSymbol];
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight")) {
                hideYellowHeart(event);
            }
        });
});
})
