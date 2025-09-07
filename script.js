const sketchField = document.querySelector('#mett-a-sketch');
const leftArm = document.querySelector('#left-arm');
const rightArm = document.querySelector('#right-arm');
const load = document.querySelector("#load");

const battleStart = document.querySelector("#battle-start");
const romanceTheme = document.querySelector("#flirt-route");
const battleTheme = document.querySelector("#battle-theme");
const intro = document.querySelector("#intro");
const cheer = document.querySelector("#cheer");

cheer.volume = sameVolume;
intro.volume = sameVolume;
battleTheme.volume = sameVolume - 0.1; //sadly, battle crusher theme is as loud as it is great
romanceTheme.volume = sameVolume - 0.1;

const allColors = ["red", "orange", "yellow", "green", "lightBlue", "blue", "purple", "black", "grey"];

const mettBody = document.querySelector(".top-part");
const textBubble = document.querySelector("#text-bubble");

function getNumber(element, property){
    const searchFor = document.querySelector(`${element}`)
    const initialCss = window.getComputedStyle(searchFor).getPropertyValue(property);
    let toNumber = parseFloat(initialCss); 
    toNumber = Math.round(toNumber * 10) / 10;
    return toNumber;
};

function marginAdjust() {
    let step = 100;
    let defaultScreenWidth = 2568;
    let defaultScreenHeight = 1218;
    let currentScreenWidth = window.innerWidth;
    let currentScreenHeight = window.innerHeight;
    let defaultLeftArmX = 29.5;

    let getDifference = Math.abs(parseInt((defaultScreenWidth - currentScreenWidth)/step));
    let heightDifference = defaultScreenHeight - currentScreenHeight;
    
    let marginStepWidth = 0.5;
    let marginStepHeight = Math.min(Math.abs(parseInt(heightDifference/60)), 5);


    if (getDifference >= 4) { 
        marginStepWidth = marginStepWidth + (0.1 * (getDifference / 4));
    }

    document.documentElement.style.setProperty('--left-hand-position-X', `${(defaultLeftArmX + marginStepHeight) - (marginStepWidth * getDifference)}%`);
    document.documentElement.style.setProperty('--right-hand-position-X', `${-((defaultLeftArmX + marginStepHeight) - (marginStepWidth * getDifference)) + 10}%`);

    console.log(`the difference is ${marginStepWidth * getDifference}`)
    console.log(`the new left X margin is ${defaultLeftArmX - (marginStepWidth * getDifference)}%`)
    console.log(`the new right X margin is ${-(defaultLeftArmX - (0.5 * getDifference)) + 10}%`)
}


window.addEventListener("resize", function() {
    document.documentElement.style.setProperty('--body-width', `${getNumber('.head', 'height')/1.25}px`);
    document.documentElement.style.setProperty('--body-height', `${getNumber('.head', 'height')/5}px`);

    console.log(`new body width is ${getNumber('.head', 'height')/1.25}px`);
    console.log(`new body width is ${getNumber('.head', 'height')/5}px`);

    //now i need a function to adjust arm positioning. it's not the 'best', but it's less complicated than going the .getBoundingRect() route
    //basically, on every screen resize, we will need to increase/reduce the X margin (left) based on how many "steps" away we're from the 'default' screen size
    //can make the step 100px or 200px? just gotta find the proportion for margin increase/decrease for consistent distance from the body

    marginAdjust();
});


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

const body = document.querySelector("body");
const unRatedEnd = document.querySelector("#premature-end-noised");
const creditsRoll = document.querySelector("#premature-end");
const creditsTextBox = document.querySelector("#end-text");

const transmissionEnd = function() {
    const static = document.createElement("audio");
    static.src = "./music/static-sound.mp3";
    static.setAttribute("loop", "loop");
    static.volume = sameVolume - 0.1;

    body.appendChild(static);
    static.play();

    setTimeout(() => {
        body.replaceChildren();
    }, 3000)
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

        //If the canvas does not exist, create it
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

        setTimeout(() => {
            animate();
        }, 50);
    }

        if (gameState["routeFinished"]['flirt'] === true ) {
            if (gameState["flirtLoseEnd"]) {
                body.replaceChildren(creditsRoll);
                const creditsMusic = document.createElement("audio");
                creditsMusic.src = "./music/Undertale OST : 025 - Dating Start!.mp3"
                creditsMusic.setAttribute("loop", "loop");
                creditsMusic.volume = sameVolume - 0.1;

                let creditsText = [];
                let correctPart = allCredits["flirty"]["fail"];

                creditsText.push(...correctPart["title"], "",
                    ...allCredits["forAll"], "", ...correctPart["department"], "", 
                    ...correctPart["awards"], "",  ...correctPart["sponsors"], "",  
                    ...correctPart["legal"], "", ...correctPart["closing"]
                );

                for (let i = 0; i < creditsText.length; i++) {
                    const newLine = document.createElement("p");
                    newLine.textContent = creditsText[i];

                    newLine.addEventListener("mouseover", (event) => {
                            event.target.classList.add("yellow-text");
                    })

                    creditsTextBox.appendChild(newLine);
                }

                creditsMusic.play();

            } else {
                setTimeout(function() {
                    leftArm.src = "./images/mett-sprite/arm-left.png";
                    romanceTheme.pause();
                    battleTheme.play();
                    gameState["isAnimating"] = false;
                }, 150)  
            }  
        }
};

const insultTheme = document.querySelector("#insult-route");
const betrayTheme = document.querySelector("#insult-route-betrayal")
insultTheme.volume = sameVolume - 0.1;
betrayTheme.volume = sameVolume - 0.1;

const laserShot = document.querySelector("#laser");
const heartShatter = document.querySelector("#heart-shatter");
const heartExplode = document.querySelector("#heart-explode");
const heartHurt = document.querySelector("#heart-hurt");

const insultRoute = async function() {
    if (gameState["routeStages"]["insultRouteStage"] === 3) {
        gameState["routeBlocked"]["flirt"] = true;
        gameState["routeBlocked"]["perform"] = true;
    }
    if (gameState["routeStages"]["insultRouteStage"] >= 4) {
        leftArm.src = "./images/mett-sprite/arm-left-gun.png";
        document.documentElement.style.setProperty('--left-hand-position-X', `30.2%`);
        document.documentElement.style.setProperty('--left-arm-scaling', `1.28`);

        battleTheme.pause();

        if (gameState["routeFinished"]["flirt"]) {
            betrayTheme.play()
        } else {
            insultTheme.play()
        } 
    }

    if (gameState["routeFinished"]['insult'] === true) {
        setTimeout(function() {
            function laser() {
                starSpace.classList.add("invisible");
                const flash = document.createElement('div');
                flash.classList.add('flash-effect');
                document.body.appendChild(flash);

                const soul = document.createElement("img");
                soul.id = "soul";
                soul.src = "./images/red-soul-sprite.png";
                textField.style.justifyContent = "center";

                textField.appendChild(soul);
                
                requestAnimationFrame(() => {
                    flash.style.opacity = '0.85'; 
                    laserShot.play();
                    setTimeout(() => {
                        heartHurt.play();
                    }, 50)

                    laserShot.addEventListener("ended", function() {
                        flash.style.opacity = '0';
                        flash.remove()
                        insultTheme.volume -= 0.1;
                        betrayTheme.volume -= 0.1;

                        setTimeout(() => {
                            document.querySelector(".hp-numbers").textContent = "0 / 20";
                            document.getElementById("red").style.width = "100%";
                            document.getElementById("yellow").style.width = "0%";
                            soul.src = "./images/red-soul-broken.png"
                            heartShatter.play();
                        }, 15)
                    })

                    heartShatter.addEventListener("ended", function() {
                        setTimeout(() => {
                            heartExplode.play();

                            body.replaceChildren(unRatedEnd); 
                            transmissionEnd();
                        }, 15)
                    })            
                });
              }

              laser();
        }, 50)
    }
}

const gameState = {
    //drawing
    isDrawing: false,
    isErasing: false,
    hasDrawing: false,
    markerBoxOpen: false,
    fieldSize: 16, 
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
    stickTimes: 0,
    flirtTimes: 0,
    performTimes: 0,
    insultTimes: 0,
    roseTimes: 0,
    routeStages: {
        flirtRouteStage: 0,
        insultRouteStage: 0,
    },
    routeFunctions: {
        flirt: flirtRoute,
        insult: insultRoute
    },
    routeFinished: {
        flirt: false,
        insult: false
    },
    routeBlocked: {
        flirt: false,
        perform: false,
        insult: false,
        rejectionSeen: false
    },

    //for animation/sound tracking
    quietTimes: 0,
    stayStill: 0,
    musicOn: true,
    animationOn: true,
    moveArms: true,
    moveBody: true,
    isAnimating: true,
    waved: true,
    wentLeft: false,

    //button state
    fightActive: false,
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
    },

    //ending
    flirtLoseEnd: false,
    rate: {
        colorScore: 0,
        densityScore: 0,
        mannersScore: 0,
        baitAndSwitch: 0
    }
}

const drawField = function() {
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
}

drawField();

const allSketchFieldElements = document.querySelectorAll("div.innerCells");

    mettBody.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("innerCells") && !gameState["fightActive"]) {
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
        if(!gameState["fightActive"]) {
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
        }
    })
  
    async function handWave() {
        if (gameState["moveArms"]) {
            if (gameState["waved"]) {
                rightArm.src = "./images/mett-sprite/arm-right-1.png";
                gameState["waved"] = !gameState["waved"];
            } else {
                rightArm.src = "./images/mett-sprite/arm-right-2.png";
                gameState["waved"] = true;
            }

            await new Promise((resolve) => setTimeout(resolve, 280));

            requestAnimationFrame(handWave);
        }
    }

    requestAnimationFrame(handWave);

const actionButtons = document.querySelectorAll(".action-button");
const textBox = document.querySelector("#textBox");
const textSection = document.querySelector("#text-section")
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

const typeWriterSound = document.querySelector("#textBox-typing");
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
    let stopCondition = false;

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

    window.addEventListener("keydown", (event) => {
        if (event.code === "Digit2" || event.code === "Numpad2" ) {
            stopCondition = true;
            clearInterval(wordByLetterOutput);
            clearInterval(musicEffects);
        }
    })
});
}

const flavorIntro = [
    ["Spotlights dance on Mettaton’s gleaming frame.", "As he rolls forward, his screen flickers with a slow, theatrical pulse."],
    ["Mettaton's voice drops theatrically."],
    ["The crowd murmurs, leaning in."],
    ["He pauses, letting the silence stretch - just enough."],
    ["He lifts an arm, as he softly gestures to his screen-face."],
    ["His screen flickers, a playful glitch of pink and blue."],
    ["He leans in, voice dropping into a near-whisper, the crowd leaning with him."],
    ["He rolls back, the hush replaced with eager shuffling, the glow of stage lights sharp on chrome."],
    ["The spotlight lingers, then blinks twice like a coded cue."]
    ["His screen brightens, outlining you in its glow as he opens his arms to the crowd."]
];

const mettIntro = [
    ["Monsters of the Underground, darlings at home, and YOU - our lone human guest!", "Tonight, all of you are in for a truly special treat."],
    ["They say art reveals the Soul...", "That every stroke, every color, every bold mistake, is a window into who you really are.", "And here, under these lights, before this live audience and every eager viewer at home...", "...Your Soul will have nowhere to hide, Human."],
    ["So paint, human.", "Paint with fear, with hope, with chaos if you must.", "Let the world see what beats beneath that fragile exterior."],
    ["Tonight, you will transform this screen - my screen - into a canvas worthy of Hotland’s eyes.", "You will paint, live and unfiltered before a studio audience that demands nothing less than brilliance!"],
    ["There's no need to FIGHT for your life on a cramped canvas.", "If the moment demands it - go grand, expand it."],
    ["Need to spice things up or test the waters?", "Feel free to ACT.", "Try a pose, turn the music on - or off - if you think silence will help your inspiration."],
    ["Or if you crave something special - an ITEM can help.", "A rainbow flourish, a precise pencil, or... something else, if your ambition dares."],
    ["And if, by some cruel twist, you create a disaster too dreadful for this world - take MERCY, darling.", "Spare us the horror, clear my screen, and begin anew."],
    ["Oh, and if you'll get TOO tired of my magnificent voice...", "Just raise TWO fingers, darling - the signal to let the scene roll forward."]
    ["Now, let’s see what your Soul can create under the gaze of the lights, the audience...", "and ME - your host, your judge, your star!"]
];

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
    ["Oh, so it’s that kind of performance!", "A pantomime, a mystery, a whispered secret... Delightful!"],
    ["Darling, if you needed peace, you could have just asked!", "But fine - let’s see if your talent is loud enough without the fanfare."],
    ["Oh, the tension! The drama!", "I do love an artist who understands the power of anticipation!"],
    ["Oh, craving that old Hollywood charm, are we?", "A silent film? A tragedy!", "But worry not - I always have a monologue ready!"]

];

const mettQuietDisabled = [
    ["A dramatic return!", "A scene worthy of me!", "Oh, darling, you do have taste!"],
    ["Oh, how relieved I am!", "Silence is one thing, but a star without sound? Unthinkable!"],
    ["A wise move!", "Art without ambiance is like a performance without applause! Which is to say, quite tragic!"],
    ["See? Much better!", "Now, let’s make some noise, darling!"]
]

const flavorStopOnce = [
    ["You raise a single finger, demanding absolute poise.", "The music hesitates, as if holding its breath with you."],
    ["You wave a hand sharply.", "Somewhere backstage, the orchestra falters, unsure whether to continue without their star's rhythm."],
    ["You pinch your fingers together, indicating 'just a little less'.", "Mettaton responds by locking into a pose with dramatic flair."]
];

const flavorStopTwice = [
    ["You make a T shape with your hands.", "At that, a spotlight snaps onto Mettaton’s frozen form."],
    ["You raise your hand, commanding complete stillness.", "Even the audience seems to lean forward, holding their breath."],
    ["You clasp your hands in front of you solemnly.", "Mettaton catches the cue and freezes, a perfect monument to lost motion."]

];

const flavorStopDisabled = [
    ["You wave your hand dismissively.", "Mettaton takes it as royal permission - and moves like a star reborn."],
    ["You nod, almost imperceptibly.", "Mettaton instantly seizes the moment, filling the silence with grand, graceful motion."],
    ["You release a long breath.", "The lights seem to shimmer in approval as Mettaton bursts back to life."]
]

const mettStopOnce = [
    ["Not even a little sway?", "Fine, I’ll hold my fabulous pose.", "But I must say, you’re depriving the world of pure spectacle!"],
    ["Oh, darling, I do hope you’re not planning to make this masterpiece in complete stillness.", "Art flows, just like my fabulous self!"],
    ["A little stillness, hm?", "Not so easy to create when my dazzling presence is moving, is it?", "But fine, I’ll endure your perfectionist whims."]
];

const mettStopTwice = [
    ["Oh, so now I’m supposed to be a mannequin?", "Very well, darling, I shall stand tall and let you focus.", "No waving, no gesturing - only cold, cruel stillness!"],
    ["It's said that an artist must suffer for their craft...", "But truly, darling, you will suffer too much - deprived of basking in my endless grace!"],
    ["Completely still? You wound me, darling!", "A moving star shines so much brighter - but fine, let your canvas miss out on a little sparkle."]

];

const mettStopDisabled = [
    ["You’re allowing me to move again, darling? How kind!", "Let’s see if you can capture my essence while I work my charm!"],
    ["Now we’re talking! Back in action, darling!", "A true masterpiece demands motion - and nobody moves like Mettaton!"],
    ["Finally! My full glory returns!", "Let’s not waste a second - there’s beauty to unleash and legends to create, darling!"]
]

const checkOut = [
    [`METTATON 8 ATK 999 DEF`, `His metal body renders him invulnerable to attack.`],
    [`METTATON 8 ATK 999 DEF`, `Yes, this still didn't change.`]
];

const mettCheckNone = [
    ["I see you've checked again!", "And oh - would you look at that? Nothing’s changed!"],
    ["Ah, a critic returning for a second glance?", "You’ll find the masterpiece is already perfect."],
    ["Repetition is the key to success!", "Except here.", "Here, it’s just a waste of time."],
    ["Oh, checking twice? How thorough!", "But the perfection remains unchanged."]
];

const mettCheckDrawn = [
    ["Back for another check? Marvelous!", "Appreciate your own work, darling!", "Such bold choices... truly."],
    ["Oh, you're checking it again? What’s wrong, dear?", "Second thoughts about your artistic masterpiece?"],
    ["Ah, still looking?", "A true artist should always reevaluate their work...", "...or regret it."]
];

const flavorPerformNone = [
    ["You insist you’re merely building suspense."], 
    ["You claim your masterpiece is invisible - a true avant-garde statement."],
    ['You dramatically insist that true art exists in the mind.'],
    ['You claim your empty canvas represents the boundless potential of the universe.'],
    ["You say you're still summoning the artistic spirits."],
    ['You dramatically gesture at the blank canvas, declaring it a statement on silence and restraint.'],
    ['You declare the blank space represents the beauty of nothingness.'],
    ['You say that every stroke must be perfect - and so you hesitate.'],
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
    ['Ah, so the spirits are your collaborators? How avant-garde!', 'But darling, this is your moment - no ghostwriting!'],
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

const flavorFlirtNone = [
    ['You declare that Mettaton is already the ultimate work of art.'],
    ['You lean in and call Mettaton the Ultimate Muse.'],
    ['You tell Mettaton that his beauty has rendered you incapable of holding a pen.'],
    ['You declare your undying admiration for Mettaton.'],
    ['You ask Mettaton if he believes in love at first sight.'],
    ["You promise to always be Mettaton's number-one fan."],
    ['You confess you’ve never met a robot quite like Mettaton.'],
    ['You strike a pose and wink.', 'The lights seem to shine a little brighter!']
];

const mettFlirtNone = [
    ['Oh, darling! Such exquisite taste!', 'But I do want to see your artistic genius, too!'],
    ['A muse with no masterpiece?', 'Darling, this is artistic blasphemy!'],
    ['Ah! A tragic curse! But fear not, dear - I accept verbal tributes, too!'],
    ['Of course you do, dear! But let’s really sell it - tears, music, confetti!'],
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
    ['Oh, sweetheart, nothing could - but I do adore a devoted artist!'],
    ['Darling, my mere presence is the signature of excellence.'],
    ["Why, of course!", "But be warned, dear - no portrait could ever outshine the original."],
    ['Oh, darling, inspiration was inevitable!', ' But can your art truly contain my brilliance?'],
    ['Oh, how sweet!', 'But darling, where’s the grand show? ', 'The fireworks?', 'The thunderous applause I so richly deserve?'],
    ['ONLY TEN?!', 'How utterly tragic!'],
    ['Naturally, darling! But do say it louder - the cameras are rolling!'],
    ['Ah! A tragic, star-crossed romance!', 'Quick, someone cue the sweeping orchestral score!'],
    ['']
];

//flirt route
const flavorFlirtTooMuch = [
    ["You wink, hands shaping into a heart on cue.", "A few audience members seem to gasp."],
    ["You sweep into an elegant, exaggerated bow - one hand extended as if inviting Mettaton to a dance."],
    ["You hum a love song - off-key, but painfully heartfelt.", "Audience gasps, someone faints in the back."],
    ["You unveil a sketch of Mettaton alluringly reclining atop a velvet chaise, draped in strategically placed roses and absolutely nothing else."],
    ["Spotlights dim. Romantic music swells. The background becomes starry and golden. For a moment, the atmosphere feels unusually personal."]
];

const mettFlirtTooMuch = [
    ["Oho, darling! Starting with the charm already?", "I’m flattered, really.", "But let's see if you can back it up with some talent!"],
    ["Ooh!", "Such gallantry!", "If you’re auditioning for a leading role in my life, darling... you have my attention."],
    ["It was dreadful! Chaotic! A total mess!", "You’ve hummed your heart out with all the grace of a collapsing chandelier...", "Darling, if this is what love sounds like, then I never want to hear silence again."],
    ["Darling, please! You’re scandalizing the sponsors!", "If they faint, it’ll be your fault - you've captured my likeness a little too well.", "Every angle, every tiny flourish - it’s like you know me better than my own mirror.", "But tell me, sweetheart...", "...can you really handle what you’ve dreamed up?"],
    ["Tonight... you’ve bared your heart beneath these blinding lights.", "Not with perfect notes or polished lines... but with something far rarer: sincerity.", "I’ve had suitors - brilliant, breathtaking, but ultimately forgettable.", "But you? You've lingered - too dazzling to forget, too foolish to let go.", "And persistence like that? Darling, it’s almost criminal.", "So this is it - the final rose. My last flourish, and perhaps... my first real offer.", "Will you take your place in the spotlight beside me? Or vanish into the wings, one breath short of forever?"]
];

const flavorFlirtTooMuchEndingWin = [
    ["The lights shift - softer now, more intimate. The clamor of the crowd fades to a hush as Mettaton glides toward you, his screen aglow with something gentler than before."],
    ["He slows, his voice losing its performative edge.", "For a moment, the glitter fades - just a little."],
    ["His arm extends - precise, delicate - and he lifts your hand in his cold, carefully calibrated fingers. The gesture is practiced, yet the pause that follows is not."],
    ["As Mettaton brings your hand closer to his screen, a faint buzz of static vibrates through the air - like the soft hum you’d feel from touching an old television."],
    ["The cool surface pulses with an electric warmth, almost as if it’s alive."],
    ["With elegant care, he presses your knuckles gently to the screen."],
    ["The static buzz, subtle yet undeniable, passes through your touch - soft, tender, a quiet connection. The contact lingers, meaningful and sincere."],
    ["The moment lingers - longer than it should - but eventually, he draws back. His screen flickers, bright with energy. The crowd’s murmurs rises to a restless buzz."],
    ["He leans forward, one hand extending with theatrical flourish, presenting the final rose to you."],
    ["With a flourish, he twirls on his wheel, scattering glittering confetti. The music swells, a triumphant, sparkling melody."],
    ["He strikes a pose, one hand over his 'chest', the other extended upwards as if trying to grab the stars."]
];

const mettFlirtTooMuchEndingWin = [
    ["...Tonight, you bared your heart beneath these lights - and maybe, just maybe, I did too."],
    ["I’ve played a thousand roles. Lived a thousand perfect scenes.", "But none quite like this. None quite like you."],
    ["You’ve earned something most never even dare to dream of..."],
    ["...A fragment of perfection. From me, no less."],
    [""],
    [""],
    [""],
    ["But don’t cue the credits just yet, darling... we're only at intermission!"],
    ["Take it, darling. A token of this fabulous, fleeting moment."],
    ["The stage is set, darling - the spotlight’s on you!", "Now, paint with passion, with fire, and let the world see the masterpiece you’re meant to create!"],
    ["Because this love story?", "It’s only just beginning... and darling, it's going to be a showstopper!"]
];

const flavorFlirtTooMuchEndingLose = [
    ["The lights dim to a soft, tragic hue.", "Mettaton glides toward you, rose in hand, the crowd breathless with anticipation."],
    ["He stops.", "Slowly... dramatically... he lowers the rose."],
    ["He sighs deeply, placing a gloved hand to where a heart might be."],
    ["He turns his back with a sharp, practiced spin.", "A single spotlight catches the glint of the rose as he clutches it to his chest like a fallen star."],
    ["A sudden lurch - a trapdoor beneath your feet creaks ominously."],
    ["Cue dramatic gasp from the audience.", "Somewhere, a production intern sobs into a headset."],
    ["With a flick of his wrist, Mettaton pulls a hidden lever.", "You drop - theatrically - into a pit filled with oversized pink heart pillows marked 'FRIEND ZONE'."],
    ["Mettaton peers over the edge, striking a sorrowful pose, one hand extended downward."],
    ["He tosses down a glittery envelope."],
    ["He spins back to the crowd", "Music explodes into an over-the-top, bittersweet finale."]
];

const mettFlirtTooMuchEndingLose = [
    [""],
    ["Ah... love.", "Sometimes, it’s grand.", "Transcendent.", "Worth a thousand encores..."],
    ["And sometimes...", "It’s just good television."],
    ["You dazzled, darling. You tried.", "But my heart is a five-star venue...", "And tonight?", "You didn’t quite make the guest list."],
    ["Don’t take it personally!", "I simply must keep my options open for future shows!"],
    [""],
    [""],
    ["You’re still one of my favorites, darling... just not THE one."],
    ["As a consolation prize: a lifetime membership to my fan club!", "Signed, sealed, and sparkled - by yours truly!"],
    ["Because even when hearts break-", "-THE SHOW MUST GO ON!"]
];

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
    ["Your insults go too far, and the crew looks nervous.", "Mettaton’s usually vibrant shine seems to dull for a split second."],
    ["You call Mettaton something unthinkable.", "The production crew frantically cuts to a commercial break, and live audience scatters - but it’s too late."]
];
const mettInsultTooMuch = [
    ["Oh, darling, you’re really digging yourself a hole, aren’t you?", "Keep this up, and I may stop gracing you with my attention."],
    ["You’re testing my patience, aren’t you?", "Keep going, and I’ll have no sympathy left for you.", "Rudeness isn’t wit, darling - it’s a death sentence."],
    ["You’re really pushing it, darling.", "If you’re not careful, you’ll find yourself in a much worse position than you realize.", "Not everyone takes insults lightly."],
    ["You’ve crossed a line now, darling.", "One more word, and you’ll regret ever uttering my name.", "You’ve lost the privilege of my attention."],
    ["That’s it.", "You’ve earned yourself a one-way ticket out of here.", " You want to keep insulting me?", "Well, let’s see how much you enjoy your final act.", "The show is over."]
];

//alt insult route progression

const flavorBetrayal = [
    ["You toss out a cutting remark.", "The lights above dim by a fraction - almost as if the stage itself flinched."],
    ["You push further.", "The background music falters, skipping a beat, as if uncertain whether to continue."],
    ["You press on, lashing out sharper than before.", "The stagehands exchange worried glances. You can feel it - something beautiful starting to rot."],
    ["You throw another insult, cold and deliberate.", "The warmth drains from the stage lights, leaving Mettaton framed in a halo of something merciless."],
    ["You hurl the final blow without hesitation.", "The world tilts, the cameras cut - and then the world slams shut around you, and your story ends mid-sentence."]
];

const mettBetrayal = [
    ["Oh, darling... Is this really the path you want to take?", "I thought you had better taste than this."],
    ["It’s easy to tear things down, isn't it?", "I suppose I expected a little more brilliance... or at least originality."],
    ["You're not just wasting your potential, darling...", "You're tarnishing mine by association."],
    ["This was your chance. A chance to shine alongside me.", "Now? You’ll be lucky if anyone even remembers your name.", "Not a word shall be uttered by you."],
    ["No more chances, darling.", "No second takes. No forgiveness.", "Your final act... ends now."]
];

const flavorFullBetrayal = [
    ["You throw out an insult that cuts through the air.", "You mock something Mettaton clearly once took pride in. The lighting team hesitates - this isn’t just banter anymore."],
    ["You push further, your words becoming sharper.", "The flirtation you once shared curdles in the air. Mettaton's screen flickers with static."],
    ["You get bolder, and the tone shifts completely.", "A member of production crew steps backward. You’re not sparring - you’re stabbing."],
    ["Your insults go too far.", "The stage lights flicker once, then hold steady, sterile and cold. Whatever connection you had is gone - and something worse has taken its place."],
    ["You call Mettaton something unthinkable.", "The crew scrambles to kill the feed. The broadcast freezes on Mettaton’s silhouette - motionless and menacing."]
];

const mettFullBetrayal = [
    ["...Is this a new bit, darling?", "A little edge for the ratings?", "Surely, someone as charming as you wouldn't truly mean that."],
    ["You seemed so sincere when you called me dazzling.", "Tell me - were you just rehearsing that, too?"],
    ["So that’s it. I was a tool, a toy for your amusement.", "How poetic. The star, burned out by their own spotlight"],
    ["You had the spotlight, darling. You had me.", "And now?", "Another word - and you’ll see what happens when the lights go out for you."],
    ["You made a fool of me.", "You turned affection into ammunition.", "So let me return the favor.", "You wanted a brutal show?", "Then die knowing... you were the climax."]
];

//alt phrases for flirt/perform actions when insults were used before

//flirt
const flavorFlirtInsult = [
    ["You toss a desperate compliment into the fraying air between you."],
    ["You try to spin your insults into charm.", "It’s not very convincing."],
    ["You attempt a flirtatious smile.", "It feels brittle."],
    ["You offer a compliment, clumsy and clattering."],
    ["You toss another half-hearted flirt Mettaton's way."],
];

const flavorFlirtDisgrace = [
    ["You toss out a flirt with a crooked smile.", "Mettaton barely spares you a glance."],
    ["You bat your lashes, desperate", "Mettaton’s wheel screeches slightly as he turns away."],
    ["You offer a syrupy compliment.", "It sours the moment it leaves your mouth."],
    ["You murmur another sweet nothing.", "It evaporates between you."],
    ["You try to flirt yet again.", "Mettaton’s screen flickers with disdain."]
];

const flavorFlirtLock = [
    ["You reach for one last desperate flirt.", "Mettaton’s wheel grinds to a halt."],
    ["You offer a trembling compliment.", "Mettaton’s arms cross firmly over his screen."],
    ["You toss out another sweet line.", "It sinks like a stone."],
    ["You blow a kiss.", "Mettaton doesn't even spare you a glance."],
    ["You toss out another sweet line.", "It sinks like a stone."],
    ["You blow a kiss.", "Mettaton doesn't even spare you a glance."],
    ["You try to charm your way back.", "The silence is deafening."]
]

const mettFlirtInsult = [
    ["Darling, you can't wound my heart and then expect to kiss it better!"],
    ["Such passion!", "Such venom!", "I'm almost flattered, in a tragic sort of way."],
    ["If this is your idea of courtship, darling... it needs serious revision."],
    ["Wounds don't heal with sweet words, especially not from you."],
    ["Save your sweet nothings - I heard your true voice already."]
];

const mettFlirtDisgrace = [
    ["Keep your silver tongue to yourself, darling. It's tarnished beyond repair."],
    ["You think a wink will fix fix betrayal? How quaint."],
    ["Save your tired tricks for someone who still cares."],
    ["A kiss from a snake is still a bite, no matter how sweet the hiss."],
    ["You spit venom, then offer roses? Watch them wither, darling."]
];

const mettFlirtLock = [
    ["Flirting? From you? Hilarious. Pathetic."],
    ["Enough. You lost this audience, and I don't do reruns."],
    [""],
    [""],
    [""],
    [""],
    [""]
]

//perform
const flavorPerformInsult = [
    ["You spin with practiced flair, the lights catching you just right - if only the mood could follow suit."],
    ["You break into a pose that once got cheers.", "Now, it earns only silence and raised brows."],
    ["You stretch your arms toward the heavens, hoping drama might salvage the mood."],
    ["You give a deep, theatrical bow.", "The gesture trembles under the weight of what came before."],
    ["You sweep your cape behind you and strike a pose.", "There’s a tension in the air that stage lights can’t dispel."]
];

const flavorPerformDisgrace = [
    ["You strike a dramatic pose.", "The lights dim slightly... almost like they’re embarrassed for you."],
    ["You belt a line, full voice, full commitment.", "The echo is louder than the response."],
    ["You bow with a flourish, sweat clinging to your brow like shame."],
    ["You pirouette across the stage.", "But the rhythm feels off - and the connection is gone."],
    ["You spin like a puppet who forgot who pulled the strings."]
];

const flavorPerformLock = [
    ["You throw yourself into a passionate performance.", "But the cameras don’t follow - you’re out of frame."],
    ["You begin your act, but the spotlight doesn’t turn on.", "It knows when a story’s over."],
    ["You give your all.", "The room watches silently, unmoved."]
]

const mettPerformInsult = [
    ["A bold attempt, darling. But glitter can’t cover bruises, no matter how you throw it."],
    ["Oh, trying to win back your audience?", "Points for effort... minus ten for emotional whiplash."],
    ["Darling, theatrics are lovely - until they start smelling like desperation."],
    ["A little late for humility, don’t you think?", "But hey - audience loves a redemption arc."],
    ["Trying to distract from your words, dear? At least your transitions are smooth."]
];

const mettPerformDisgrace = [
    ["Oh please. If you wanted to be a clown, darling, all you had to do was ask."],
    ["Stunning, truly.", "Shame it's coming from someone who already flubbed their character arc."],
    ["Bravo. A standing ovation - if only I had legs to walk out with."],
    ["Such poise, such elegance... such misplaced effort."],
    ["Still rehearsing lines, I see. But this script’s past saving."]
];

const mettPerformLock = [
    [""],
    [""],
    [""]
]

//phrases for the stick action
const flavorThrowOnceDrawn = [
    ["You toss the stick mid-sketch.", "Mettaton snatches it and dramatically inspects your art."],
    ["You toss the stick.", "Mettaton snatches it mid-air and strikes a pose, examining your art piece."],
    ["You throw the stick at Mettaton, right after finishing your art.", "He catches it, hesitates, then drops it like it’s beneath him."],
    ["You throw the stick.", "It bounces off Mettaton’s screen, right below the doodle you just made."]
];

const flavorThrowMoreDrawn = [
    ["You send your stick flying again.", "Mettaton flinches this time - but not from fear."],
    ["You lob a stick mid-drawing.", "Mettaton dodges it with a sharp metallic clink."],
    ["You toss the stick yet again.", "Mettaton’s screen glows red for a split second as he avoids it."],
    ["You throw the stick once again.", "Mettaton rolls out of its path."],
    ["You throw your stick again.", "Mettaton’s wheel spins sharply to the side, dodging it with style."]
];

const flavorThrowOnceEmpty = [
    ["You offer the stick like a ceremonial tribute", "Mettaton takes it with suspicious elegance."],
    ["You throw the stick.", "Mettaton intercepts it effortlessly, like this was rehearsed."],
    ["You toss the stick gently.", "Mettaton snatches it from the air with a practiced flick."],
    ["You throw the stick.", "Mettaton raises an arm and catches it with a magician's flourish."],
    ["You throw the stick.", "Mettaton grabs it, his screen lighting up in what seems to be a playful wink."]
];

const flavorThrowMoreEmpty = [
    ["You toss the stick again.", "Mettaton sighs and elegantly rolls away to avoid it."],
    ["You hurl your stick again.", "Mettaton pivots around it, unimpressed."],
    ["You fling the stick again.", "Mettaton sighs and lets it hit the floor."],
    ["You throw the stick again.", "Mettaton’s screen flickers briefly in annoyance as he avoids it."],
    ["You throw the stick again.", "Mettaton glides out of the way, his screen flickering in annoyance as he spins around."]
];

const mettThrowOnceDrawn = [
    ["A mixed-media attempt, I see. Tragically unrefined, but amusing!"],
    ["Chaotic, but I must admit, I’m intrigued.", "You’re not a master, but I see potential in this.", "Just... not with that stick."],
    ["I admire the passion, but props were not part of the program. Let the art speak for itself!"],
    ["A bold new brushstroke!", "...Oh wait, it’s just a stick.", "Still, you’ve got gumption, darling."]
];

const mettThrowMoreDrawn = [
    ["This isn’t slapstick, darling. It’s barely art at this point."],
    ["Darling! If you're trying to ruin your own work, you're doing splendidly."],
    ["This is a drawing show, not a stick fight. Get it together, darling."],
    ["Do I look like a dartboard to you, darling?"]
    ["Oh, darling, this is not how we make art!", "If you’re trying to ruin your own masterpiece, you’re doing an excellent job."]
];

const mettThrowOnceEmpty = [
    ["Charmed, darling...", "...but I do hope this isn’t the whole act."],
    ["A dramatic start! Now let’s hope your talent matches your timing."],
    ["Ah, a gift? How touching.", "But do try roses next time, darling!"],
    ["Ooh! A prop! How bold.", "Shall I juggle it or just strike a pose?"],
    ["Impressive! But darling, we can do better than sticks, can’t we?"]
];

const mettThrowMoreEmpty = [
    ["Darling, you had one chance to be cute. Now you’re just... disruptive."],
    ["How quaint. Is stick-throwing your entire repertoire?"],
    ["Darling... this is an art show, not fetch night at the park."],
    ["Not the response I was hoping for, darling. You’re starting to bore me."],
    ["Is this really all that you’re bringing to the table?", "The novelty’s wearing off quickly, darling."]
];

//phrases for mercy action

const flavorMercyEmpty = [
    ["You attempt to reset, but the display is perfectly blank."],
    ["Woshua appears, checks the spotless surface, and politely bows out."],
    ["Canvas is spotless. Waiting for you."]
];

const flavorMercyDrawn = [
    ["With a flicker, Woshua appears and wipes every mark away, leaving the display spotless."],
    ["Woshua dutifully sweeps across the screen, erasing every trace of your last attempt."],
    ["A chime sounds. Woshua quickly mops the screen clean, restoring an empty canvas."]
];

const mettMercyEmpty = [
    ["The stage is empty. All that’s missing is your performance."],
    ["Darling, you can’t polish perfection."],
    [""]
];

const mettMercyDrawn = [
    ["Clean as ever. Your work starts from zero once more."],
    ["Blank, polished, and waiting. Let’s see what you do with it this time."],
    ["The stage is reset. Try again."]
];

//phrases for the 'fight' action

const flavorFightGrow = [
    ["You strike a bold pose. The resolution of the screen increases, giving way to more nuance in drawing."],
    ["Your hands sweep wide. The canvas obeys, stretching to fill the imagined horizon."],
    ["Space to dazzle. Use it wisely."]
];

const flavorFightShrink = [
    ["The canvas folds in, daring boldness within a cozy frame."],
    ["You pinch the edges inward. The space contracts with eager anticipation."],
    ["Tiny frame, sharp focus!"]
];

const mettFightGrow = [
    ["Bigger, brighter, bolder! Yes, yes - give the drama room to breathe!"],
    ["Bigger is better, darling! If you’re going to draw, do it with grandeur!"],
    [""]
];

const mettFightShrink = [
    ["A clever trick! When the world shrinks, the spotlight grows hotter!"],
    ["Tiny stage, huge consequences! Every gesture matters now, darling."],
    [""]
];

//phrases for rose

const flavorRoseRude = [
    ["You hold out the rose like a shield - but your eyes falter before his glow."],
    ["You raise it gently, but the warmth behind the gesture is gone.", "Something’s broken - and you know it."],
    ["You offer the rose again, but there’s tension in your grip.", "What once bloomed now feels like an apology."],
    ["You try to steady your hand, holding the rose like a memory - but the petals feel heavier than before."],
    ["You lift it high, as if to rewind time - but Mettaton’s gaze stays fixed on what you've become."],
    ["You flash the rose between acts of cruelty, pretending it still means something."],
    ["You bring it forward, but not even the lights believe the gesture anymore."]
];

const flavorRoseMaxInsult = [
    ["You shove the rose forward like an excuse, hoping it’ll say what your actions can’t."],
    ["You try to wave it off - the insults, the betrayal.", "It only makes the silence louder."],
    ["You hold it out, but your words still linger in the air, sharp and unforgivable."],
    ["You clutch the rose like a mask - but it can’t hide what you’ve already done."],
    ["You present it again, but the petals have curled.", "It no longer suits the one holding it."],
    ["You raise it once more, desperate for it to mean something.", "But you’ve burned every line in the script."],
    ["You dare to show it, even now.", "The gesture is crueler than silence."]
];

const flavorRosePos = [
    ["You bring out the rose with a smile.", "The cameras seem to sparkle in approval."],
    ["You hold the rose with quiet pride, offering it like a secret only the two of you still understand."],
    ["You raise it playfully, and Mettaton actually falters in his next pose."],
    ["You flourish the rose in a gentle arc, as though presenting a treasured prop - not for the audience, but just for him."],
    ["You lift it slowly, the bloom still bright - a quiet echo of something real blooming between stage lights and stolen glances."],
    ["You draw the rose close to your heart before showing it to Mettaton again - like a bashful confession."],
    ["You tease him with a rose gently.", "Even the audience lets out a collective swoon."]
];

const mettRoseRude = [
    ["Clutching at old glories, are we? How tragic.", "Roses are beautiful, darling... but even they wither when neglected."],
    ["Clinging to memories won't save you, darling.", "Not after the cracks you've made."],
    ["How bittersweet... You parade my gift even as you tarnish what we built."],
    ["A flower given in trust, now held by trembling hands. How poetic."],
    ["You can wave it all you want, dear.", "But no amount of nostalgia can rewind the show."],
    ["Darling... is this guilt I see?", "Or is that just a prop for your next performance?"],
    ["Even stars dim, I suppose. Just like the meaning behind that gift."]
];

const mettRoseMaxInsult = [
    ["Is that supposed to soften your cruelty?", "Pathetic.", "Even the prettiest gift can’t hide an ugly heart, darling."],
    ["You thought that sentiment would save you?", "It only makes your fall more pitiful."],
    ["Even a rose that beautiful can't mask the stench of betrayal, sweetheart."],
    ["Pathetic. Flowers wilt, trust dies - and you, darling, are withering faster than both."],
    ["A wilted rose for a withered heart. How fitting."],
    ["Touching. Tragic. Tiresome.", "I hope you enjoy your finale, because there won’t be a curtain call."],
    ["You still have that thing? Darling, that’s not nostalgia - that’s mockery."]
];

const mettRosePos = [
    ["Seeing you cherish it... well, even I must admit, it makes this performance truly unforgettable!"],
    ["Oh, you sentimental thing!", "Always knowing just how to stir my circuits."],
    ["Be still, my heart!", "If you keep this up, I’ll have to write you into my autobiography!"],
    ["Oh! Still carrying that little token? You do know how to make a star swoon."],
    ["Still blooming... just like my affection for you.", "Oh, this is too romantic!"],
    ["Oh my! You kept it!", "You’re either hopelessly sentimental... or hopelessly in love!"],
    ["My processors are overheating, darling!", "How am I supposed to keep on with this show when you do things like this?!"]
];

//rate interaction when an empty drawing is submitted

const flavorBlankPositiveOnce = [
    ["You bat your eyes and gesture to the screen from which you've jsut erased your drawing."],
    ["You glance at the space where your masterpiece once was, lips pursed like a tragic artist."],
    ["You tilt your head with a knowing smile, as if the mystery is more valuable than the piece itself."],
    ["You flourish a hand toward the canvas like you’re unveiling brilliance."],
    ["You flash a mischievous smile as the screen stays blank."]
];

const flavorBlankPositiveMore = [
    ["The empty canvas reflects your own reflection."],
    ["The screen flickers. His tone is soft - not amused."],
    ["You offer nothing but a playful smile."]
];

const flavorBlankNeutralOnce = [
    ["You strike a dramatic stance. The canvas behind you is blank."],
    ["You strike a pose and gesture at your empty canvas with flair."],
    ["You try to pass off the absence of content as a daring statement."],
    ["You dramatically request a review."],
    ["You pretend to bask in applause for the art you just erased."]
];

const flavorBlankNeutralMore = [
    ["You submit another blank canvas."],
    ["You request to rate your just-erased drawing.", "Mettaton sighs. It’s almost dramatic."],
    ["Another rating request. Another blank canvas."]
];

const flavorBlankNegativeOnce = [
    ["You submit a perfectly blank canvas, unblinking."],
    ["You fold your arms and stare at the empty canvas like that is your statement."],
    ["You offer emptiness and wait for praise."],
    ["You straighten your posture as if presenting a grand finale, then reveal... nothing."],
    ["You leave a blank canvas hanging like a missed cue."]
];

const flavorBlankGegativeMore = [
    ["Again?"],
    ["Mettaton’s voice drops cold."],
    ["Mettaton doesn’t even feign surprise."]
];

const mettBlankPositiveOnce = [
    ["You erased it? How coy!", "Was it too dazzling to see... or just too sweet to share?", "Don’t be shy - I can handle brilliance."],
    ["Gone before its time... a tragedy!", "But even your vanishing act has flair, sweetheart.", "Still, a masterpiece left unwitnessed is a performance half-lived."],
    ["A bold move - leaving me to imagine what could’ve been.", "Dangerous. I like it.", "But next time, darling... give me something real to crave."],
    ["You erased it? Tch, and I was ready to shower you in praise!", "What a flirt.", "Now stop teasing - I want the full production."],
    ["Even when you leave me with nothing, I find myself intrigued.", "Truly, you’re impossible to ignore.", "But the audience is calling - give them your all!"]
];

const mettBlankPositiveMore = [
    ["I’m beginning to think you’re afraid to impress me.", "Afraid I’d fall too hard?"],
    ["It was cute the first time.", "Now it just feels like you're avoiding sincerity."],
    ["Erased, again? Darling... are you flirting or stalling?"]
];

const mettBlankNeutralOnce = [
    ["I call this piece ‘Nothing to See Here’.", "A bold move, but I was promised a show.", "Maybe next time, include the art with the attitude."],
    ["Bravo! Truly, a piece that challenges the very concept of visual media!...", "...Now quit playing and actually draw something that judges will be able to rate."],
    ["A blank canvas speaks volumes - but unfortunately, none of it is good.", "One point for audacity!", "And minus ten for messing around like this.", "But if you'll actually submit something, I can forget that deduction."],
    ["Oh my! The gall to demand a rating for nothing!", "You truly are a provocateur... or a prankster.", "Either way, I’m entertained.", "Let’s aim for provocative and visible next time, darling."],
    ["Is this... perfomance art?", "Or are you just hoping I wouldn’t notice how you wiped your drawing clean?", "Cute.", "But points aren’t handed out for disappearing acts on this show - so chop-chop!"]
];

const mettBlankNeutralMore = [
    ["Ah. A series. Minimalist... and utterly empty. Again.", "Maybe you could try a different theme for your actual piece?"],
    ["We get it, darling. You’re deep. Now draw something."],
    ["I see you’re dedicated to your craft - the craft of wasting everyone's time."]
];

const mettBlankNegativeOnce = [
    ["White on white with a touch of 'I gave up.' Exquisite.", "Try again - this time with effort."],
    ["If your goal was to waste both our time - congratulations, you've done just that.", "Come back with art, not excuses."],
    ["This isn’t enigmatic. It’s lazy.", "You’re capable of more. Show it."],
    ["Submit actual work, or don't submit at all. Stardom demands effort.", "And right now, you’re just phoning it in."],
    ["A blank submission?", "How brave. How bold. How thoroughly unimpressive.", "If you're going to command my attention, darling, earn it."]
];

const mettBlankGegativeMore = [
    ["You’re confusing minimalism with mediocrity."],
    ["If you have nothing to say... then stop trying to speak."],
    ["You’ve submitted nothing. Again. And yet you demand attention."]
];


//all color-related phrases for rating
const flavorRatingPositiveIntro = [
    ["Satisfied with your creation, you step back.", "Mettaton’s screen glows - your final stroke still gleaming across his face."],
    ["You meet Mettaton’s gaze and nod.", "He stills - not from hesitation, but anticipation.."],
    ["The music fades. The lights dim.", "A hush settles over the studio like falling velvet."],
    ["Then, a soft mechanical hum begins to rise.", "Above, hidden panels slide open."], 
    ["A half-circle of polished mirrors descends from the ceiling, slow and reverent."],
    ["Each one reflects a different angle of Mettaton... and your art displayed in radiant color across his screen."],
    ["The audience gasps.", "The camera-bot zooms in, capturing the mirrored glory of it all."],
    ["Bathed in his own reflections and the color of your creation, Mettaton lifts his arms in front of the mirrors - a conductor poised before a symphony."],
    ["His voice drops, low and sweet."],
    ["Mettaton's screen shimmers - faint, flickering, like a held breath."],
    ["Then, he snaps his fingers - a panel opens, and a sleek scanning lens slides forward. A pulse of light washes over your drawing."],
    ["The scanner locks in.", "A radiant color wheel unfurls above the stage - spinning, analyzing"],
    ["Mettaton turns to the audience with deliberate dramatism."],
    ["Then he turns to you, just slightly."]
    ["He flicks his wrist toward the glowing wheel overhead."],
    ["The spotlight shifts and lands on you."],
    ["Judgment begins."]
];

const mettRatingPositiveIntro = [
    [" "],
    [" "],
    [" "],
    [" "],
    [" "],
    [" "],
    [" "],
    [" "],
    ["Darling... isn’t that what art truly is? A wish to be seen. To be known."],
    ["And you truly saw me."],
    [" "],
    [" "],
    ["Ladies, gentlemen, and all my dazzling darlings!"],
    ["The spotlight has kissed every line you drew, sugar.", "And now, let us see..."],
    ["...just what kind of Soul blooms beneath such bold beauty."],
    [""],
    [""]
]

const flavorRatePositiveColorOne = [
    ["The color wheel flickers... then freezes on a single hue. The room stills."],
    ["Mettaton rotates slowly, one arm behind his frame like a painter in critique mode."],
    ["He turns just slightly, voice curling with dry amusement."]
    
];

const mettRatePositiveColorOne = [
    ["Ah. Singular. Decisive. A statement."],
    ["Minimalism has its charm, darling - but you weren’t minimalist."],
    ["You were cautious. This stage deserves bolder choices.", "Let’s just say... I was hoping for a bit more drama from my co-star."]
];

const flavorRatePositiveColorFew = [
    ["Mettaton's wheel spins as he rolls around showcasing your tasteful color combination to the cameras."],
    ["He keeps rotating slowly, displaying each selected hue like a gallery exhibit."]
];

const mettRatePositiveColorFew = [
    ["Mmm, a curated palette! Chic, stylish... a hint of mystery."],
    ["Not loud. Not desperate. Just intentional. And oh, how that lingers."]
];

const flavorRatePositiveColorMany = [
    ["The scanner goes wild. Colors cascade wildly across Mettaton’s screen, a riot of saturation that nearly outshines the stage lights."],
    ["Glitter cannons hiss, the crowd surges with a single, collective gasp."],
    ["He spins once, letting the chaos of hues reflect across the stage."]
]

const mettRatePositiveColorMany = [
    [""],
    ["What a spectacle, darling!"],
    ["A masterpiece of mayhem, and the spotlight loved every shade."]
];

const flavorRatePositiveColorBlue = [
    ["Soft synth chords play under the audience’s collective sigh.", "Mettaton’s screen adopts a cool, blue tint."],
    ["He glances toward the audience, then back to you."]
];

const mettRatePositiveColorBlue = [
    ["So... serene."],
    ["A lesser performer might fade in those tones. But you? You glowed."]
];

const flavorRatePositiveColorPurple = [
    ["Mettaton’s screen darkens, then flares with purple undertones from your drawing."],
    ["He presses two fingertips together, as if savoring fine wine."]
];

const mettRatePositiveColorPurple = [
    ["...Ah. Royal."],
    ["Frankly, it’s quite flattering. You’ve got taste, darling - and you know where to use it."]
];

const flavorRatePositiveColorBoth = [
    ["A slow ripple of deep blue and violet sweeps across Mettaton’s screen, cool as midnight, sharp as spotlight glass."],
    ["His screen tilts, letting the colors shine under the lights."],
    ["He glides closer, the hues casting royal shadows across the stage."],
    ["The hum in his frame is more purr than static now."]
];

const mettRatePositiveColorBoth = [
    ["Oh, you clever thing."],
    ["You knew your audience. You knew me"],
    ["You combined restraint with decadence. Cool calculation with flair."],
    ["A palette so precise, it’s practically a signature."]
];

const flavorRatePositiveInstrumentPencil = [
    ["A thin, dusty line etches across Mettaton’s screen.", "It crackles faintly, the scratchy path catching the stage lights."],
    ["His frame tilts, screen humming."],
    ["A pause, then a soft chuckle."]
];

const mettRatePositiveInstrumentPencil = [
    ["A pencil. Really."],
    ["No neon. No flair. Just grit on glass."],
    ["And darling, confidence like this? Makes this a worthy show."]
];

const flavorRatePositiveInstrumentRainbow = [
    ["Lights fracture. A dozen tiny beams scatter across the audience, matching the rainbow pen’s spectrum. The front row throws their hands up like it’s a concert."],
    ["Mettaton’s screen rotates through seven shades in sync with the house lights."],
    ["He pauses, lets the moment simmer."]
];

const mettRatePositiveInstrumentRainbow = [
    ["Oh, you didn’t just draw. You performed."],
    ["Every color, every second - like a fireworks finale with no warning."],
    ["You weren’t subtle. But subtlety’s overrated anyway."]
];

const flavorRatePositiveInstrumentBoth = [
    ["The scanner stutters. The display glitches, unsure whether to go grayscale or full disco. Mettaton blinks - figuratively."],
    ["His frame shifts, intrigued despite himself."],
    ["Sparks drift down from the lighting rig."],
    ["The screen glows, steady."]
];

const mettRatePositiveInstrumentBoth = [
    ["What is this?"],
    ["You scratched whispers, then drowned them in color."],
    ["It shouldn’t work."],
    ["And yet, here we are."]
];

//neutral
const flavorRatingNeutralIntro = [
    ["You take a step back, signaling that you're finished."],
    ["Mettaton’s screen holds the final image - the glow of your last brush stroke still pulsing faintly across his 'face'."],
    ["He meets your gaze. A slight nod. Professional. Measured."],
    ["The music fades. The lights dim.", "With a practiced hum, a mechanism whirs overhead."],
    ["A crescent of mirrors descends from the ceiling in perfect formation. Each reflects a different facet of Mettaton - and the artwork displayed across his face."],
    ["The audience leans forward, curious.", "The camera-bot slides in, catching the mirrored tableau in cinematic clarity."],
    ["Bathed in reflections, Mettaton lifts a single hand, just enough to catch the light. His voice is smooth and composed."],
    ["A soft snap - a hidden panel opens.", "A sleek color scanning lens extends, casting a gentle beam over his screen - over your work."],
    ["The scanner ticks. Lights blink.", "The mirrors rotate slightly, as if adjusting for best exposure."],
    ["A color wheel unfolds above the stage, spinning in deliberate arcs."],
    ["Mettaton doesn’t look at you at first.", "He studies the reflections, tapping his fingers lightly together."],
    ["Then - a glance, sharp but unreadable."],
    ["He taps his 'chin' with one elegantly gloved finger, then slowly turns to the audience."],
    ["Mettaton fans his fingers, as if dusting glitter from the air."],
    ["He glides forward, one hand resting theatrically on his chest."],
    ["A snap. The color scanner flickers to life. The wheel begins to turn, colors gleaming."],
    ["Judgment begins."]
];

const mettRatingNeutralIntro = [
    [""],
    [""],
    [""],
    [""],
    [""],
    [""],
    ["Well, darling... I see that your creation is complete.", "You’ve had your moment.", "Now I’ll have mine."],
    [""],
    [""],
    [""],
    ["Hm. Not bad."],
    ["Ladies, gentlemen, and all my dazzling darlings!", "You’ve witnessed a performance, a presentation... a painting, if we must."],
    ["The final stroke has just dried...", "...but oh, the drama is just beginning."],
    ["They say art reveals the Soul...", "And yours, sugarplum, is practically screaming for attention."],
    ["So let’s indulge it, shall we?", "Let’s see what truths you’ve painted all over me."], 
    [""]
    
]
const flavorRateNeutralColorOne = [
    ["The color scanner beeps once, landing on your lone hue."],
    ["A pause hangs in the air before Mettaton tilts his screen, reflecting that lonely hue back at you."],
    ["A mechanical sigh hums softly through the mic."],
    ["He leans in, glow sharpening."]
];

const mettRateNeutralColorOne = [
    [""],
    ["One color, hm?"],
    ["Minimalism can be art... if it has impact."],
    ["Let’s hope you didn’t waste your single note, darling."]
];

const flavorRateNeutralColorFew = [
    ["The scanner cycles through a few hues before dimming. The glow is modest - not meek, but hardly daring."]
];

const mettRateNeutralColorFew = [
    ["A selective palette. Economical, or just cautious?", "Not every stage needs fireworks... but they do add more to the show."]
];

const flavorRateNeutralColorMany = [
    ["Colors shimmer across the scanner, bold but uncertain."],
    ["The stage pulses with hues like a crowd unsure whether to clap."]
];

const mettRateNeutralColorMany = [
    ["A medley of ambition. A pity it lacks a crescendo."],
    ["Colorful, certainly. Memorable? We’ll see."]
];

const flavorRateNeutralColorBlue = [
    ["Light blue settles over the scanner like a sigh. Its light pulses coolly, reserved and distant."]
];

const mettRateNeutralColorBlue = [
    ["Ah, blue. Always the professional. Never the star.", "Composed. Understated. Some might even say... safe.", "But I quite like its simplicity"]
];

const flavorRateNeutralColorPurple = [
    ["Purple seeps into the scanner’s glow, faintly theatrical. The hue lingers - less a spotlight, more a velvet curtain."]
];

const mettRateNeutralColorPurple = [
    ["Purple. Drama’s favorite middle child.", "You flirted with grandeur. And then stopped."]
];

const flavorRateNeutralColorBoth = [
    ["Blue and purple ripple together, smooth but restrained.", "The scanner holds the two hues in gentle balance, like a practiced duet."],
];

const mettRateNeutralColorBoth = [
    ["Cool. Composed. Just enough edge to avoid fading entirely.", "Elegant, if a bit too... editorial."]
];

const flavorRateNeutralInstrumentPencil = [
    ["A gray mark trails across his screen - quiet, almost self-conscious. Mettaton’s gaze lingers on his reflection, then flicks away."]
];

const mettRateNeutralInstrumentPencil = [
    ["Minimalism. How brave.", "No color. No shine. Just... earnestness.", "We’ll call it 'introspective' and move on."]
];

const flavorRateNeutralInstrumentRainbow = [
    ["Color flickers across the stage like a skipped stone.", "The lights try to catch up, but something falls flat."],
    ["Mettaton’s screen flashes once, then dulls."]
];

const mettRateNeutralInstrumentRainbow = [
    ["All spectacle, no soul.", "A burst of color can’t cover a lack of direction."],
    ["But hey, at least it’s photogenic."]
];

const flavorRateNeutralInstrumentBoth = [
    ["The stage glows, stutters, then settles into something undefined. Pencil grit and rainbow flash muddle together, neither claiming the spotlight."],
    ["Mettaton sighs - audibly."]
];

const mettRateNeutralInstrumentBoth = [
    ["You mixed a whisper with a scream.", "Confusing. Contradictory. Possibly... avant-garde?"],
    ["Still, I admire this attempt. Sort of."]
];

//negative
const flavorRatingNegativeIntro = [
    ["The final stroke hits the canvas.", "Smudged. Defiant. A flourish, or a mess - but yours."],
    ["The lights snap to a focused white. No fanfare. No applause."],
    ["Just the heavy hum of the studio - and Mettaton’s unmoving frame, center-stage."],
    ["Your drawing flickers across his screen: smeared and jagged. A digital sigh crackles through his speakers."],
    ["His voice is velvet and static, the kind that smiles without softening."],
    ["He turns slightly, mechanical servos whirring as his display reflects your work in fragments."],
    ["From above, mirrors descend - silent and sterile - slowly encircling him like mourners at a wake."],
    ["A soft chuckle fizzes through the speakers - indulgent, almost fond."],
    ["His gaze flows toward the mirrors - not at you, not quite."],
    ["For a moment, he simply studies his own screen. The drawing. The mess. The echo."],
    ["Then he lifts his voice - not warm, but entertained."],
    ["The mirrors tilt. The spotlight sharpens."],
    ["Judgment begins."],
];

const mettRatingNegativeIntro = [
    [""],
    [""],
    [""],
    ["Astonishing."],
    ["Truly, I’ve never seen anything quite like it.", "So loud... or so empty. So messy, or so painfully controlled."],
    [""],
    ["You had the stage, darling.", "A blank canvas. A willing star.", "And this is what you chose to leave behind."],
    ["They say art reveals the Soul.", "Yours practically threw itself onto the floor and screamed."],
    [""],
    [""],
    ["Ladies and gentlemen, beauties and beasts...", "Let us see what this sordid little masterpiece says about our darling co-star."],
    [""],
    [""]
]

const flavorRateNegativeColorOne = [
    ["You present your one-color masterpiece with a flourish."],
    ["Mettaton doesn’t spare it a glance, idly inspecting his gloved hand as if checking for a chip in his manicure."]
];

const mettRateNegativeColorOne = [
    [""],
    ["Is there even any color to this?", "Sweetheart, if I wanted a blank canvas, I’d stare at the ceiling."]
];

const flavorRateNegativeColorFew = [
    ["You throw a smug glance at your drawing. Mettaton’s screen dims briefly, exasperated."],
];

const mettRateNegativeColorFew = [
    ["So that’s it? Did you run out of inspiration and crayons?"]
];

const flavorRateNegativeColorMany = [
    ["A wild mess of hues dances across the canvas."],
    ["The scanner jolts through a barrage of colors, visibly distressed. It sputters and twitches as if it wants to shut itself off."]
];

const mettRateNegativeColorMany = [
    ["Too many colors, darling. You’ve painted like a toddler at a birthday party.", "And not a particularly talented toddler at that."],
    ["...Do you even know what you were trying to say with all that?"]
];

const flavorRateNegativeColorBlue = [
    ["The scanner’s light holds on blue, unblinking, unamused.", "It feels like it is waiting for something more."]
];

const mettRateNegativeColorBlue = [
    ["A cold choice with nothing beneath the surface.", "I’ve seen water stains with more emotional depth."]
];

const flavorRateNegativeColorPurple = [
    ["A violet hue pulses briefly on Mettaton’s screen, then fades into gray."],
    ["Purple shivers across the scanner light, shallow and showy."]
];

const mettRateNegativeColorPurple = [
    ["Purple, reaching for drama, falling flat."]
    ["A royal color, wasted on a forgettable display."]
];

const flavorRateNegativeColorBoth = [
    ["Light blue and purple trade places like understudies unsure who got the part. The scanner cycles between them, looking for meaning. It finds none."]
];

const mettRateNegativeColorBoth = [
    ["Moody and confused. Just like your artistic direction.", "A brooding duet - if neither singer could stay in key, or on stage."]
];

const flavorRateNegativeInstrumentPencil = [
    ["A timid streak of gray scrawls across the screen, forgotten as soon as it appears."],
    ["The lights don’t even bother reacting."],
    ["The audience hesitantly laughs for maybe the first time during this show."]
];

const mettRateNegativeInstrumentPencil = [
    ["This isn't art. It's a cry for help in grayscale."],
    ["Did your soul fall asleep mid-doodle, darling?", "This drawing is so flat that I’d need a shovel just to dig up something."],
    [""]
];

const flavorRateNegativeInstrumentRainbow = [
    ["Color lashes out across the stage, desperate to impress."],
    ["At that, the scanner sputters, then goes still, as if it got embarrassed."]
];

const mettRateNegativeInstrumentRainbow = [
    ["A tantrum disguised as a palette."],
    ["So much noise. So little meaning.", "You threw everything at the wall - and somehow missed entirely."]
];

const flavorRateNegativeInstrumentBoth = [
    ["Gray smears and rainbow flares collide, clawing for attention. This entire performance chokes on its own ambition."]
];

const mettRateNegativeInstrumentBoth = [
    ["Panic isn’t a style, darling.", "A clumsy mashup of drama and dullness. You truly outdid yourself."]
];


//density

//positive
const flavorRatePositiveBucket = [
    ["Mettaton folds his arms, staring flatly at the monochrome wall of color in his reflection."],
    ["He gestures at the screen with a sweep so elegant it’s almost cruel."],
    ["A faint smile can be heard in his voice now."],
    ["He leans forward, voice dropping into that teasing, velvet register."]
];

const mettRatePositiveBucket = [
    ["Darling... you know I love a bold statement, but this?"],
    ["This isn’t a painting - it’s a set piece, waiting for someone else’s spotlight.", "Is this a statement? An inside joke? Or did you strain your creative muscle?", ]
    ["You’re my co-star, sugar - the lead role in my art show."],
    ["Don’t make me wonder if you’re only here to look pretty.", "I'd like to see some effort as well."]
];

const flavorRatePositiveDot = [
    ["The camera zooms so close the lone mark turns into a trembling pixel."],
    ["His tone is low, almost intimate - but there’s a bite underneath."],
    ["A pause."]
];

const mettRatePositiveDot = [
    ["One dot. That’s all I get from my leading act?"],
    ["I’ve seen you set a room on fire with a glance, darling.", "And now you choose to be needlessly cheeky instead of showing what you're actually capable of?"],
    ["I like you far too much to pretend I’m not... disappointed."]
];

const flavorRatePositiveSparse = [
    ["Mettaton's screen flickers, zooming in on the tiny smudge you left behind."],
    ["He gives a faint sigh and his arm slumps with performative disappointment."]
];

const mettRatePositiveSparse = [
    ["Darling, is this art, or did your stylus slip? It’s a bit... minimalistic for my taste."],
    ["Absence can be powerful, sugar...", "...But only if the audience doesn’t think you just got bored and stopped drawing right after starting."]
];

const flavorRatePositiveLittle = [
    ["Bright flecks scatter across the screen as he processes your strokes."],
    ["A faint metallic sigh."]
    ["A beat. His voice is soft, but with a challenge to it."]
];

const mettRatePositiveLittle = [
    ["Mmm... A preview. A tantalizing taste. A trailer of what could be."],
    ["But darling - trailers are meant to sell the movie. Where’s my feature presentation?"],
    ["You’ve got the spark. Next time? Don't hold back - light up the whole room."]
];

const flavorRatePositiveSome = [
    ["The lights on Mettaton's frame pulse as he studies the canvas."],
    ["He tilts his head as he turns to you."],
    ["His tone dips lower, almost conspiratorial."]
];

const mettRatePositiveSome = [
    ["There it is - your spark. I can feel it, sugarplum."],
    ["I see vision. I see hesitation. And - most importantly - I see you trying."],
    ["Don’t stop at just teasing with potential. Let everyone feel you in every inch of the stage."]
];

const flavorRatePositiveFilledOut = [
    ["Mettaton glides closer, taking in the busy canvas."],
    ["A small nod, the hint of a genuine smile to his voice."],
    ["His screen dims gently for a second - a wink?"]
];

const mettRatePositiveFilledOut = [
    ["Now this - this shows courage.", "Space filled with purpose - I love to see it."],
    ["It’s raw, a little messy... But also daring and completely impossible to ignore."],
    ["Keep that edge, darling. Perfect is boring when it comes to art."]
];

const flavorRatePositiveLots = [
    ["Mettaton’s tone is velvety, but with a razor’s edge beneath."],
    ["He lets the words hang, then smirks."],
    ["There's an affectionate but teasing smile to his voice."]
];

const mettRatePositiveLots = [
    ["This is delicious - vibrant, chaotic, alive."],
    ["I’ll admit, I’m pleased.", "But darling, the bar is set now. You’ve impressed me today..."],
    ["...But tomorrow, the stage will demand even more.", "Can you handle that, star?"]
];

const flavorRatePositiveFull = [
    ["Mettaton glides around a mirror, taking in your drawing from every angle - slowly and deliberately."],
    ["His voice is smooth but edged in delivery."],
    ["Then, his tone shifts to something akin to a sly smile."]
];

const mettRatePositiveFull = [
    ["Now this is what I expect from my co-star - bold, relentless, impossible to look away from."],
    ["It’s decadent. Messy. Human. I love it - and I don’t say that lightly."],
    ["But don’t get comfortable, darling.", "Today you’ve impressed me.", "Tomorrow... you’ll have to outdo yourself."]
];


//neutral
const flavorRateNeutralBucket = [
    ["Mettaton stares at his reflection in disbelief, then turns to you, disappointed felt heavy in the air."],
    ["Then he raises a hand - delicately, tragically - to cover his screen."],
    ["He moves his hand away and says as deadpan as it could only be possible."]
];

const mettRateNeutralBucket = [
    ["A bold creative decision..."],
    ["...to dump a bucket of paint on me and call it art"],
    ["Tell me, was it satire? Technical difficulties? A cry for help?", "Because it seems as if you just gave up on trying to give any meaning to your work."]
];

const flavorRateNeutralDot = [
    ["He leans closer to one of the mirrors, peering at his screen."],
    ["It seems that as if he squints, then recoils theatrically."],
    ["A beat of silence."]
];

const mettRateNeutralDot = [
    ["Is that a dead pixel, or..."],
    ["No, no - don’t tell me. That’s it, isn’t it?"],
    ["Art, reduced to a single molecule.", "Audacious. Or lazy."]
];

const flavorRateNeutralSparse = [
    ["He tilts to the side, as if considering something."]
];

const mettRateNeutralSparse = [
    ["Did you run out of paint... or ambition?", "I suppose restraint can be powerful... in theory.", "But I don't believe that's truly a case here."]
];

const flavorRateNeutralLittle = [
    ["A quiet beat. Then Mettaton exhales - exaggerated, as ever."],
    ["He taps the display twice, as if expecting something to appear."],
    ["Then he glances toward the audience."],
    ["You hear some giggles from the spectators of this show."]
];

const mettRateNeutralLittle = [
    ["How delicate. How restrained. How... unfinished."],
    ["An opening flourish without a show. A trailer for a film that doesn’t exist."],
    ["At least we know your stylus works."],
    [""]
];

const flavorRateNeutralSome = [
    ["He leans in to the mirror, thoughtfully analyzing your drawing."],
    ["He traces one gloved finger over his reflection."],
    ["Then, Mettaton half-turns to you, and says in a softer, almost intrigued tone."],
    ["His voice sounds as if he smiled faintly."]
];

const mettRateNeutralSome = [
    ["Hmm. We have a pulse."],
    ["Not a full-on heartbeat. But... something stirred in your Soul."],
    ["Was it hesitation? Or restraint in disguise?"],
    ["Either way, it’s more than nothing."]
];

const flavorRateNeutralFilledOut = [
    ["Mettaton leans in to the mirror, the air to him showing that he's satisfied in this work."],
    ["He gestures grandly across the canvas."],
    ["He nods."]
];

const mettRateNeutralFilledOut = [
    ["Finally - an image that dares to take space."],
    ["It breathes. It stretches. It almost says something."],
    ["Almost."]
];

const flavorRateNeutralLots = [
    ["He turns to the audience and flicks to the canvas like a magician revealing a card."],
    ["He circles around a mirror with one outstretched hand, showcasing your work from different angles."],
    ["Then, with a glimmer of a grin in his voice, Mettaton addresses you directly."],
];

const mettRateNeutralLots = [
    ["Now this is starting to look like a performance!"],
    ["A few more strokes and I might’ve called it a piece."],
    ["Instead, I’ll call it... promising."]
];

const flavorRateNeutralFull = [
    ["Silence. Mettaton goes still. The camera begins a slow, deliberate zoom on the canvas."],
    ["Then he exhales - purely for drama."],
    ["He snaps his fingers; the lights behind him shimmer in response."],
    ["He sweeps one arm outward, unveiling your work to the audience."]
];

const mettRateNeutralFull = [
    [""],
    ["Now that... that’s a performance."],
    ["You didn’t just doodle, darling - you committed. A full painting, a full vision."],
    ["And in this business, that’s more than most do.", "Dedication and passion like this is what defines a true artist."]
];

//negative

const flavorRateNegativeBucket = [
    ["Mettaton folds his arms, glaring at the monochrome wall."],
    ["He tilts his head, voice razor sharp."]
];

const mettRateNegativeBucket = [
    ["Oh, wonderful. A solid wall of nothing. How... uninspired."],
    ["Newsflash: covering the canvas doesn’t make up for the lack of imagination.", "This isn’t art - it’s a joke. And guess what? You’re the punchline."],
];

const flavorRateNegativeDot = [
    ["Mettaton zooms in on the lonely speck, his screen flashing a mix of disbelief and mockery."],
    ["He folds his metallic arms, voice dripping with sarcasm."]
];

const mettRateNegativeDot = [
    ["Is that a glitch? A dead pixel?", "No, let me guess... that’s your entire masterpiece!"],
    ["Bravo - this is the smallest, most pathetic act of defiance I’ve ever seen."]
];

const flavorRateNegativeSparse = [
    ["Mettaton squints at the single speck of color, unimpressed."],
    ["He taps his gloved fingers, mock irritation in his tone."]
];

const mettRateNegativeSparse = [
    ["A solitary dot on a vast stage - are we playing hide and seek?"],
    ["Did your inspiration ghost you, or are you simply unable to make anything better than this?"]
];

const flavorRateNegativeLittle = [
    ["The scanner traces a few hesitant strokes, like a whisper in a crowded room."],
    ["He smirks with theatrical impatience."]
];

const mettRateNegativeLittle = [
    ["A few timid brushstrokes... Is this your opening act or the full show?"],
    ["It’s like watching a trailer missing all the best scenes.", "Step it up - or clear the stage for someone who will."]
];

const flavorRateNegativeSome = [
    ["Color fights to claim the stage but never quite commands it."],
    ["He snaps his fingers, voice sharp and theatrical."]
];

const mettRateNegativeSome = [
    ["Almost there, sugar. But almost doesn’t get an encore."],
    ["If you’re going to play the star, darling, you need to own the spotlight - not half-step near it."]
];

const flavorRateNegativeFilledOut = [
    ["Mettaton’s screen flickers over the fuller canvas, clearly unimpressed."],
    ["He taps a finger on his side, tone sharp."]
];

const mettRateNegativeFilledOut = [
    ["You filled the space, but forgot the point."],
    ["Raw? Messy? More like sloppy and uninspired", "But mostly, it's incredibly forgettable."]
];

const flavorRateNegativeLots = [
    ["Mettaton’s screen bursts with color - yet something feels off."],
    ["His tone is cold but theatrical."]
];

const mettRateNegativeLots = [
    ["You filled the space, but left the Soul wanting."],
    ["A full canvas isn’t enough if the heart isn’t in it.", "If you want to impress, bring more than just colors to what you're making."]
];

const flavorRateNegativeFull = [
    ["Mettaton studies the riotous canvas with amused disbelief."],
    ["His voice is sharp and dripping with sarcasm."]
];

const mettRateNegativeFull = [
    ["An all-out assault on the eyes - but where’s the soul, darling?"],
    ["This is chaos without cause.", "If you wanted attention, congratulations.", "But if this was an attempt at making art - I'm afraid you weren't as successful at that."]
];

//manners 

const flavorRateMannersHighFlirty = [
    ["The lights dim until only the two of you remain visible, as if the rest of the theater has fallen away. "],
    ["Mettaton tilts to the side a bit, letting the pause stretch just long enough to be felt."],
    ["He paces around you with the precision of a slow dance, the faint click of his wheels syncing to your breath."]
];

const mettRateMannersHighFlirty = [
    [""],
    ["Elegant without being cold. Charming without trying too hard.", "You know exactly how much to give... And how much to keep them wanting."],
    ["Play it like this, darling, and they won’t just watch you - they’ll hang on your every move."]
];

const flavorRateMannersHighFriendly = [
    ["The lights soften to gold, casting Mettaton in warm silhouette as he rolls toward you."],
    ["His tone has the ease of champagne poured into crystal."],
    ["He tips an imaginary hat, a playful little bow."]
];

const mettRateMannersHighFriendly = [
    ["Respect, darling - such a rare, underrated art."],
    ["You didn’t flatter or fawn, but you stood your ground... and the star notices such things"],
    ["Grace on stage deserves grace in return."]
];

const flavorRateMannersNeutral = [
    ["The spotlight hovers uncertainly before landing on you. Mettaton regards you with a faintly amused tone."],
    ["His voice teases, but the glamour is muted."],
    ["He glances away with a small shrug."]
];

const mettRateMannersNeutral = [
    ["Neither a scandal nor a sensation... a quiet night in the theatre, hm?"],
    ["A safe choice, but safe is oh so forgettable - there's a reason the stage favors the bold."],
    ["Perhaps next time, you’ll give your audience something to remember."]
];

const flavorRateMannersNegative = [
    ["The lighting dims, a cool spotlight following Mettaton as he circles you."],
    ["His voice carries a sweet sting."],
    ["He rolls back, dismissive yet dazzling."]
];

const mettRateMannersNegative = [
    ["Oh, darling... Manners may not make the star, but they do keep the audience from leaving."],
    ["And you? You’ve been playing with fire... Without the charm to match."],
    ["Careful, sugar - even the brightest light can burn out."]
];

const flavorRateMannersVeryNegative = [
    ["The stage snaps to harsh white light. Every edge of Mettaton’s silhouette is razor-sharp."],
    ["His tone is silk wrapped around glass shards."],
    ["He turns away with a dramatic toss of his arm."]
];

const mettRateMannersVeryNegative = [
    ["You didn’t just snub the star - you spat in the spotlight."],
    ["Insults are easy, darling. Wit? That takes talent."],
    ["And you, clearly, are still auditioning."]
];

const flavorRateMannersBetrayal = [
    ["The lighting fractures into cold, sterile white. The stage is silent save for the faint hiss of static from Mettaton's screen."],
    ["His laugh is bright, brittle, and entirely without warmth."],
    ["He gestures broadly, as though revealing the final act of a play."]
];

const mettRateMannersBetrayal = [
    ["Win the crowd, then burn the stage... How very theatrical of you."],
    ["The tragedy, of course, is that you were so close to stealing the show."],
    ["But instead, you’ve written yourself into the footnotes - a scandal remembered only for its mess."]
];


//final!!


//start
const flavorRateFinalStartPositiveFlirty = [
    ["Mettaton spins away from you with a laugh that shimmers like the lights overhead."],
    ["A snap of his fingers - and from the wings, the mini-Mett bots roll in, each gripping a glittering judge's paddle in tiny, polished hands."],
    ["They line up with clockwork precision, striking poses as if the cameras were already flashing."],
    ["Mettaton glides back a pace, arms folding in playful detachment - a star savoring the suspense."],
    ["He leans close to you, voice dropping to a sultry whisper."]
];

const mettRateFinalStartPositiveFlirty = [
    ["Mm, I could keep playing this little back-and-forth all night...", "...But every show, darling, deserves its grand reveal."],
    ["Behold - my precious judge panel. Sharp-eyed, cold-bolted... and tragically immune to flattery.", "The most discerning critics in showbiz, here to decide your fate tonight."],
    [""],
    ["Darling, they’ve judged every act from tragedy to tap-dance. Will yours be their headline... or just a footnote?"],
    ["...No spoilers. That’s not how primetime works."]
];

const flavorRateFinalStartPositiveFriendly = [
    ["Mettaton’s voice melts into a velvet hush, his screen aglow with sly amusement."],
    ["The stage shudders with a playful chime as the mini-Mett bots roll in, chrome glittering under the lights, scoreboards in hands."],
    ["He spreads his arms, voice rich with mock-gravity, though the tease in his tone is undeniable."],
    ["He reclines a step, arms folding, savoring the tension as the hum of the lights swells around him."]
];

const mettRateFinalStartPositiveFriendly = [
    ["But really, darlings... a star doesn’t shine alone.", "Every finale needs critics bold enough to crown it in glory - or slash it to ribbons."],
    ["Behold - my jury of brilliance!", "They’ve seen disasters, divas, dazzling flames that fizzled in a single act... yet still, they hunger for something new."],
    ["So, my radiant contestant... will they reveal their scores to crown you tonight’s sensation?", "Or will you leave them scandalized, whispering of potential that almost - almost - touched greatness?"],
    ["...No rewrites. No retakes. Only a finale bold enough to make them remember your name."]
];

const flavorRateFinalStartNeutral = [
    ["Mettaton’s appraisal dissolves into a hush. There's silence in the air - the kind that makes an audience lean forward, breath held."],
    ["A bassy thrum rattles the stage. From the wings, the mini-Mett bots roll out, hoisting scoreboards that blaze beneath the lights."],
    ["Mettaton sweeps an arm toward them as though presenting a finale act, his voice rising in theatrical crescendo."],
    ["He glides back, arms folding with decadent detachment, savoring the tension as the hum of the lights swells around him."]
];

const mettRateFinalStartNeutral = [
    ["But really, darlings... what kind of spectacle ends with only my word?", "A true star knows: the final verdict belongs to the critics."],
    ["Behold - my illustrious jury panel!", "Sharper than diamond, colder than steel, and ravenous for judgment.", "They’ve shredded egos, toppled careers - and tonight, their gaze is fixed on you."],
    ["So tell me, our dear contestant...", "...Will they hail you as tonight’s sensation - or cut you down as nothing more than a failed audition reel?"],
    ["...No rewrites. No retakes. This is your final cut."]
];

const flavorRateFinalStartNegative = [
    ["Mettaton lingers center stage, screen flickering with a sly, indulgent glow. His tone oozes syrupy dramatics, every word gilded with mockery."],
    ["He spreads his arms as though unveiling a masterpiece, though the smirk in his voice betrays the joke."],
    ["The stage rattles with canned applause, hollow and tinny, as the mini-Mett bots wheel in."],
    ["He sweeps back, basking in the tension, voice lowering to a dramatic whisper."]
];

const mettRateFinalStartNegative = [
    ["Bravo, darling! A one-of-a-kind performance... though not of a star, no, no.", "Tonight, you’ve stolen the role of the clown prince of this little circus!"],
    ["Every stumble, every jeer, every oh-so-spirited insult - a routine worthy of the big top itself!", "A jest so committed, I could almost book you as tonight’s opening act."],
    ["But every circus needs its ringmasters - and mine, darling, carry scorecards instead of whips.", "Will they cheer your pratfalls as genius... or snap the tent shut on your little show?"],
    ["Let’s not keep them waiting, hmm?"]
];

const flavorRateFinalStartFullBetrayal = [
    ["Mettaton’s critique fades, leaving a charged hush. It feels deliberate - the kind that makes every eye in the hall lean in."],
    ["He spins, his metal body catching the lights with gleaming precision, arms wide in theatrical exasperation."],
    ["Mini-Mett bots glide in, judge paddles raised with gleaming, precise judgment - a mechanical chorus of snide applause."],
    ["Mettaton leans in, screen flickering like a spotlight teasing the stage.)"]
];

const mettRateFinalStartFullBetrayal = [
    ["Oh, my darling... I praised you, I flattered you, perhaps even indulged you...", "And you?", "You repay me with a twist worthy of opening night drama!"],
    ["Every barb, every sneer, every gleeful jab - a performance within the performance! Bravo!", "Truly, you could have your own show... just hope the rest of the cast survives your entrance."],
    ["The judges have arrived, darlings!", "Will they celebrate the star you pretended to be...", "...Or expose the mischief-maker under all that charm?"],
    ["Darling, the curtain is down, the lights are hot, and the final... oh, it bites", "But isn’t that the thrill of showbiz?", "Now, let’s see if you survive your own performance."]
];


//end
//positive flirty
const flavorRateFinalEndPositiveFlirtyLow = [
    ["The judges' paddles slam up - numbers on them so low they practically mock you. As they exit the stage, this mockery still stings."]
    ["The lights fade to a deep rose as Mettaton closes the distance between you. His screen glows with something unreadable."],
    ["He brushes his fingertips against your cheek, the cool metal contrasting with the warmth in his voice."],
    ["He leans in, close enough for the faint hum of his screen to reach your ears."],
    ["He draws back, his glow dimming, voice threaded with something almost tender."],

    ["Then, with a sudden flourish, he spins back to face the audience, voice booming with theatrical clarity."],
    ["He sweeps a grand bow, one arm extended toward you as if inviting the crowd to remember your name."],
    ["He turns back to you for one last whisper, private and electric."],
    ["Mettaton rolls into shadow as the stage music swells."]
    ["The lights fall in a gentle fade, as though the theater itself exhales - leaving only the echo of applause to carry you into the credits."]
];

const mettRateFinalEndPositiveFlirtyLow = [
    [""],
    ["My darling... You make it so very hard to say no."],
    ["But a star must never accept a scene that isn’t ready for the silver screen."],
    ["Don’t take it as cruelty, darling. Take it as... motivation.", "After all - what’s more thrilling than making me eat my words?"],
    ["My poor, beautiful thing... the stage can be so cruel, can’t it?"],

    ["Ladies, gentlemen, and glamorous entities of every persuasion - tonight you have witnessed a spark, fragile but bright.", "Perhaps not the inferno you craved... but isn’t that the joy of live theater?", "The promise that next time might set the whole world ablaze!"],
    ["Keep your eyes open, darlings. When this one returns, it may be with a fire no critic can extinguish."],
    ["And when that blaze is ready to blind me... I’ll be waiting."]
    [""],
    [""]
];

const flavorRateFinalEndPositiveFlirtyMiddle = [
    ["The judges’ paddles lift with middling scores. The numbers gleam without cruelty, but without awe either."],
    ["The applause that follows is polite, uncertain - neither a triumph nor a failure."],
    ["Mettaton glides toward you, voice dipping low, intimate."],
    ["He lets a fingertip linger beneath your chin, his screen glowing with a glint of playful intrigue."],
    ["With a flourish, he spins away to face the audience, arms wide as the spotlight blooms around him."],
    ["He pivots back to you, screen humming with a pulse like anticipation."],
    ["The lights cut to black, the echo of his voice hanging in the air like the last note of a song unfinished."],
    ["The music swells - a curtain call without closure."]
];

const mettRateFinalEndPositiveFlirtyMiddle = [
    [""],
    [""],
    ["Mm... steady. Safe. A sketch of something unfinished.", "But oh, darling - even half a spark can make me wonder how brightly the fire might yet burn."],
    ["You’re not unworthy - far from it. You’re dangerous.", "Because you’ve left me wanting to know whether you’ll soar... or shatter spectacularly."],
    ["'Viewers! What you’ve witnessed tonight is not a finale - but a cliffhanger!", "The promise of brilliance or disaster, waiting to be claimed.", "And isn’t that the cruelest, sweetest lure of live theatre?"],
    ["Next time, darling... don’t leave them wanting.", "Make them gasp, make them cheer - and make ME regret every other show I’ve ever hosted."],
    [""],
    [""]
];

const flavorRateFinalEndPositiveFlirtyHigh = [
    ["The judges’ scorecards flash high, numbers gleaming. The crowd explodes in cheers, the sound cascading through the hall."],
    ["Mettaton rolls to center stage, his chrome catching the spotlight in dazzling bursts"],
    ["He pivots sharply, screen glowing with delight and his arms wide."],
    ["He gestures grandly toward the crowd, his tone swelling to a crescendo."],
    ["Then softer, leaning in, his voice almost intimate."],
    ["He pauses, the stage falling into silence. With a dramatic sweep, he conjures a holographic scroll edged in glimmering gold trim."],
    ["He tilts that scroll forward, its surface shimmering with light."],
    ["Mettaton takes your hand with a deliberate grace, his touch electric and his voice softening to a purr."],
    ["The roar of the crowd melts into a softer hum, the spotlight narrowing until it frames only you and Mettaton."],
    ["His screen lingers on you, glowing with quiet warmth as if the rest of the world has vanished."],
    ["The curtain lowers, the world fading to black as the credits begin their slow ascent, shimmering softly in the darkness."]
];

const mettRateFinalEndPositiveFlirtyHigh = [
    [""],
    ["Darling... you’ve turned a stage into a galaxy of your own making. Every step, every glance... radiant."],
    ["Look at them! The audience is spellbound, breathless - and I... I can’t look away."],
    ["Tonight, you glittered brighter than anyone could dream. Remember this moment - it belongs to you."],
    ["Feel it, darling. The roar, the rhythm, the spotlight beating in time with your pulse.", "Tonight, you weren’t just a performer... you were the star they came to see."],
    ["And now... the offer."],
    ["Put your name here, and it’s official - not just a fleeting act, not just a spark that fades, not even a special thanks at the credits...", "...But the name beside mine. From this moment, every ovation, every curtain rise, every shining beat of the stage - ours, together.'"],
    ["So... what will it be, darling? Shall we take our bow together and let the spotlight never dim?", "Or should we leave the world begging for a sequel?"], 
    [""],
    [""],
    [""]
];

// positive friendly
const flavorRateFinalEndPositiveFriendlyLow = [
    ["The judges' scorecards flicker at the bottom rungs. Applause trickles in like rain on an empty stage."],
    ["Mettaton doesn’t miss a beat. He claps his hands together with manufactured delight."],
    ["He glides offstage, then sweeps back in dragging a glittery trunk brimming with random props: boas, a bent disco ball, and at least three sparkling top hats."],
    ["With a theatrical flourish, he plucks out a clipboard out of the prop pile and thrusts it into your hands."],
    ["Then, Mettaton plucks a pink feather boa from the heap and drapes it around your shoulders as though it were a royal cape."],
    ["A soft ripple of laughter rises from the audience - affectionate, not cruel."],
    ["Mettaton leans close, lowering his voice just enough that the sweetness carries through:"],
    ["He winks, striking a final pose. The lights dim, catching you in silhouette behind him, arms full of mismatched props."]
];

const mettRateFinalEndPositiveFriendlyLow = [
    [""],
    ["Marvelous! Simply marvelous! ...for a first rehearsal, that is."],
    [""],
    ["Every shining star needs someone who knows where the glitter is kept. And, darling, that someone can be you!"],
    ["You may not sparkle in the spotlight...", "...but you’ll keep it ready for the next act. The stage itself will depend on you!"],
    [""],
    ["Don’t pout, darling. Even assistants share the glamour - just less of the pressure.", "And with me, even the smallest role gets a standing ovation."],
    [""]
];

const flavorRateFinalEndPositiveFriendlyMiddle = [
    ["The judges' scorecards flicker with middling numbers - polite applause, scattered cheers, nothing too wild."],
    ["Mettaton doesn’t falter for even a second. With a whirl of his wheel and a perfectly practiced gasp, he throws out his arms toward you."],
    ["He lowers his voice just enough to make the crowd lean in."],
    ["The audience murmurs in interest. Mettaton produces a clipboard with a flourish, your name already scribbled under a document titled 'UNDERSTUDY'."],
    ["The crowd titters at his joke, but there’s genuine warmth beneath the glamour."],
    ["He steps closer, lowering his voice as if sharing a secret just for you."],
    ["With a snap of his fingers, a cascade of golden spotlights blooms around you."],
    ["They don’t stay long - just enough to bathe you in promise before retreating back to Mettaton."],
    ["He twirls, voice rising again into a triumphant crescendo."],
    ["The audience erupts into applause - supportive, if not earth-shattering. Mettaton leans down for one last, syrupy parting shot."],
    ["With a final dramatic spin, the cameras fade to black - leaving your new role hanging in the air, full of promise and pressure."]
];

const mettRateFinalEndPositiveFriendlyMiddle = [
    [""],
    ["Darling... you may not have stolen tonight’s spotlight..."],
    ["...but I see it. That spark. That raw, glittering potential just begging for its debut!"],
    ["So! Consider this your big break. You’ll be my official understudy!", "Should tragedy ever befall me...", "...or should I decide to nap through rehearsal - the stage will be yours."],
    [""],
    ["Don’t think of it as second place, sweetheart. Think of it as stardom... simply waiting for its perfect cue."],
    [""],
    ["From this day forth, you’ll shadow me, learn the ropes, and when the time is right..."],
    ["...step into the radiance of fame itself!"],
    ["Stay ready, darling. For when the curtain calls your name... the world will already be watching."],
    [""]
];

const flavorRateFinalEndPositiveFriendlyHigh = [
    ["The judges' scorecards keep on ticking higher and higher - as their scores get projected onto a big scoreboard stage screen."],
    ["As ticking stops, that screen explodes into light, panels spinning until they fuse into a single shining sign above the stage:"],
    ["'COMING SOON: METTATON & FRISK - A DOUBLE FEATURE SENSATION!' shows on that sign in big bold letters."],
    ["Mettaton gasps, clutching his chest in mock theatricality, as though the announcement itself has taken his breath away."],
    ["He sweeps across the stage in a whirl, stopping just in front of you. His voice softens, though the room still hangs on every word."],
    ["A hand to your cheek, tender but dazzling."],
    ["With a dramatic snap, the lights blaze, casting both your names on the sign in golden glow."],
    ["He takes your hand, raising it high as if presenting you to all creation. The stage erupts in shimmer, and the curtain falls - not on one star, but on two."]
];

const mettRateFinalEndPositiveFriendlyHigh = [
    [""],
    [""],
    [""],
    ["Darling...! You weren’t my opening act.", "You weren’t my rival. You were my equal!", "Every step, every stroke of your brush - flawless. Absolutely flawless!"],
    ["I’ve seen stars. I’ve made stars. But you-"],
    ["You’re the kind that burns forever."],
    ["So let the world prepare. The age of Mettaton doesn’t end tonight... it doubles!", "A new era begins: two names, one legend, side by side!"],
    [""]
];


//neutral
const flavorRateFinalEndNeutralLow = [
    ["The scores flash — all pitifully low. The audience sits in stunned silence. A few coughs. The spotlight flickers awkwardly."],
    ["The hush stretches. Mettaton leans forward to the audience, voice dripping with mock sympathy."],
    ["The crowd murmurs with mild relief. Some begin shuffling toward the exits."],
    ["Mettaton then snaps back to the production crew, looking out from the stage wings."],
    ["The cameras swivel away from you. On-screen, a cheery 'TECHNICAL DIFFICULTIES' card flickers for a moment before fading to black."],
    ["As Mettaton's microphone gets turned off, he turns back to you."]
];

const mettRateFinalEndNeutralLow = [
    ["...Well. THAT was... an artistic interpretation.", "Not one I asked for, or that ANYONE wanted, but an interpretation nonetheless."],
    ["Darlings, you deserve better. Refunds will, of course, be issued to our lovely live audience.", "Please, stop by the lobby on your way out and claim your complimentary coupons for something actually entertaining."],
    [""],
    ["And as for the HOME audience - CUT the feed.", "Replace this disaster with a rerun of my Holiday Special.", "Yes, the one with the thirty-foot candy cane.", "At least THAT had charm."],
    [""],
    ["Try not to take it personally, dear. Not EVERYONE is destined for stardom."]
];

const flavorRateFinalEndNeutralMiddle = [
    ["The judges' scoreboards settle on middlying scores - lukewarm applause trickles in."],
    ["Mettaton strikes a grand pose anyway, his voice dripping with irony."],
    ["He snaps his fingers. Spotlights flare, and his voice booms."],
    ["The audience surges out of their seats, a stampede for the snack bar. The roar of food orders drowns out everything else."],
    ["A group of teens loudly debates whether the nacho cheese counts as real cheese."],
    ["Your artwork blips on the big stage screen once, then vanishes under looping ads: popcorn buckets, candy bars, and soda cups fizzing in slow motion."],
    ["Backstage chatter leaks through a hot mic: 'Okay, swap the feed.' 'Copy that - snack ads until we roll into the next feature.' 'Finally...'"],
    ["Mettaton glances back at you, but the smile in his voice is too sweet to be sincere."],
    ["The broadcast dissolves into a cheery jingle: 'Snack smart, snack glam — only with Glamburgers!'."],
    ["The crowd’s gone, their chatter about sodas louder than any memory of your work. You're left staring at the emptying seats."]
];

const mettRateFinalEndNeutralMiddle = [
    [""],
    ["Ah, perfection! Not too spicy, not too bland... the ideal flavor for..."],
    ["...AN INTERMISSION!"],
    [""],
    [""],
    [""],
    [""],
    ["Congratulations, darling.", "You’ve achieved what few ever do: you’re officially the reason people remembered to grab snacks before the good part starts."],
    [""],
    [""]
];

const flavorRateFinalEndNeutralHigh = [
    ["The judges reveal their scores - all dazzlyingly high. The audience actually gasps, then breaks into real applause."],
    ["Mettaton presses a hand to his 'chest', staggering back as though struck by divine inspiration."],
    ["He gestures at your drawing with operatic reverence."],
    ["The audience cheers. Backstage chatter bleeds in: 'Are we... really hosting a gallery?' 'Print the flyers! Quick! Before he changes his mind!'"],
    ["Spotlights converge on your work, now projected onto a big stage screen. Applause swells like a curtain call."],
    ["Mettaton leans close to the camera lens of one of the nearby camera operators."],
    ["The broadcast ends frozen on your art, framed as if it already hung in a gallery."],
];

const mettRateFinalEndNeutralHigh = [
    [""],
    ["Oh! The reluctant one, the wallflower... blossoming into a TRUE prodigy!"],
    ["This is no mere sketch, darling. This is a MASTERPIECE begging for its own EXHIBITION!"],
    [""],
    [""],
    ["Next season, darlings - the grand premiere of ‘The Hesitant Virtuoso: A Collection’...", "...curated, of course, by ME."],
    [""]
];

//negative

const flavorRateFinalEndNegativeLow = [
    ["The Mettabots’ screens flicker, numbers flashing one by one until they freeze on your final score - pitifully low."],
    ["A murmur ripples through the audience, followed by uneasy chuckles."],
    ["Mettaton sweeps to center stage, raising a gleaming hand as if to command the very mood of the crowd. His voice rings out, sharp and melodic"],
    ["The audience titters nervously, looking to him for cues. When Mettaton laughs, they laugh with him."],
    ["The laughter surges, sharp, aimed squarely at you. Mettaton lets it rise, then glides closer, lowering his tone to something almost... tender."],
    ["The spotlight slams down upon you - blinding, searing. At first it feels like stage fright burning through your veins..."],
    ["...but then your body begins to smolder, cracking like paper in a flame. The crowd is caught between awe and horror thinking that this bit must be special effects."],
    ["Mettaton watches, hand pressed dramatically to his chest, as you collapse in a cloud of embers. He kneels, scooping a few pale remnants into his palm."],
    ["For the briefest moment, his voice softens - pity wrapped in poison."],
    ["He lets the ash drift through his fingers like glitter, scattering across the stage. Then, he turns back to the audience, radiant and unshaken."],
    ["The spotlight retracts to him alone, flawless, eternal. The curtain falls to thunderous cheers."]
];

const mettRateFinalEndNegativeLow = [
    [""]
    [""],
    ["Darlings, darlings... what WAS that performance?", "Our would-be headliner came strutting in, dreaming of crowns and glory...", "...only to trip over their own punchline!"],
    [""],
    ["Oh, my poor little fool. You tried to play at royalty, to turn jest into majesty.", "How brave. How foolish. But don’t worry..."],
    [""],
    [""],
    [""],
    ["Even the worst acts deserve... a grand finale.", "And you, my dear failure, just gave the Underground the laugh of a lifetime."],
    ["Remember them well, darlings! The jester who dreamed too high - and burned for it!", "But don’t fret... you’ll always have me. Your one and only star."],
    [""]
];

const flavorRateFinalEndNegativeMiddle = [
    ["The Mett-Bot judges flash their middling scores."]
    ["A polite murmur ripples through the hall - chuckles, meek applause, the kind reserved for a sideshow rather than a headline act."],
    ["Mettaton rolls to center stage, screen flickering with sly amusement."],
    ["He purrs, voice dripping mock grandeur."],
    ["He snaps his fingers. A spotlight shifts - you’re perched atop a massive rolling ball, wobbling precariously under the glare."],
    ["Mettaton claps, each motion dripping sarcastic charm."],
    ["With a gentle shove, you roll toward the edge of the stage. The audience titters, the sound a ripple of dismissive amusement."],
    ["Mettaton twirls, center stage again, every movement commanding attention. Now he nudges your ball to the stage exit, while you barely keep your balance."],
    ["The applause swells, and the spotlight returns to Mettaton - the stage, and the show, forever his."],
    ["Your moment is over - Mettaton claims the stage once more, leaving you a playful footnote in the evening’s spectacle."],
    ["The curtain falls as Mettaton takes a theatrical bow."]
];

const mettRateFinalEndNegativeMiddle = [
    [""]
    [""],
    ["Ah, our would-be monarch of the spotlight!"],
    ["Every stumble, every sly jab... truly a performance!", "Bravo, darling - you’ve earned your role... just not the one you dreamed of."],
    ["And now, for the final flourish - the grandest exit of all!"],
    [""],
    [""],
    ["See, darlings? Even the brightest stars need their supporting acts.", "And tonight, our dear Clown Prince...simply rolls off into the wings!", "But who knows, maybe you'll see them in some opening act again!"],
    [""],
    [""],
    [""]
];

const flavorRateFinalEndNegativeHigh = [
    ["The scorecards flash - impossibly high. Gasps ripple through the crowd. Mettaton throws his arms wide, voice booming."]
    ["Your 'crown' descends from the rafters - it's an oversized jester’s cap, the bells jingling as it settles crookedly on your head. The audience chuckles at that."],
    ["The lights flare. Behind you, a phantom circus rises, shimmering tents and tumbling silhouettes. For a heartbeat, you are its star."],
    ["Mettaton snaps his fingers, and the misty circus vanishes in a puff of smoke."],
    ["The audience roars, caught between laughter and applause, as the spotlight lingers on you — mocked, celebrated, and dismissed all at once."],
];

const mettRateFinalEndNegativeHigh = [
    ["Well, well, well!", "The Clown Prince who clawed and jeered their way across my stage... has somehow dazzled the judges!", "What a delicious disgrace!", "Why, it wouldn't be right if we don't crown our Monarch of show and comedy right here and now!"],
    [""],
    ["But don’t get carried away, darling...", "Because a crown of bells is still only noise. And when MY curtain falls..."],
    ["...your little circus goes with it."],
    [""]
];

//fullBetrayal

const flavorRateFinalEndBetrayalLow = [
    ["The scoreboard flickers violently, numbers crashing into pitiful lows. The audience gasps, then breaks into slow, mocking applause."],
    ["Mettaton rolls forward, the spotlight following him like an obedient pet. There's an eery feel to his screen glow, and there's a sharp smile in his voice."],
    ["From the rafters, neon strings descend, latching onto your wrists, your ankles. They tug once, twice - your body lurches forward in jerky, humiliating motions."],
    ["Mettaton spreads his arms as though presenting a masterpiece to the crowd."],
    ["Each tug of the strings makes you stumble, dance, collapse, all to the roaring delight of the audience."],
    ["Mettaton leans in, his voice velvet over steel, rising above the mockery."],
    ["The strings tighten. Your movements grow more frantic, more grotesque, every step perfectly in time with Mettaton’s gestures."],
    ["The audience claps along, not in admiration, but in cruel rhythm."],
    ["The spotlight narrows, trapping you in its suffocating glow. The laughter swells, drowning out everything else."],
    ["The strings pull taut - and the stage goes dark."]
];

const mettRateFinalEndBetrayalLow = [
    [""]
    ["Darling... such betrayal, such audacity!", "You played your hand, and oh, how the cards collapsed.", "But don’t fret - every disaster has its... entertainment value."],
    [""],
    ["Behold! The schemer, the betrayer, now reduced to my finest marionette.", "How poetic. How divine. How utterly pitiful."],
    [""],
    ["You wanted to control the stage, to steal the spotlight?", "Congratulations, darling - you are on it. But no longer as a star... only as a puppet."],
    [""],
    ["And when the curtain falls, you won’t bow... oh no, my darling.", "Puppets don’t bow. They hang. They dangle.", "They dance until the crowd has had their fill of entertainment."],
    [""],
    [""]
];

const flavorRateFinalEndBetrayalMiddle = [
    ["The scoreboards flicker, then settle on middling numbers. The glow is muted, the digits dull against the stage lights."]
    ["The audience reacts with uneven clapping, scattered cheers, and the low buzz of whispers running through the hall like static."],
    ["Mettaton rolls into center stage, his chrome catching the spotlight - but instead of dazzling, the light accentuate every flaw and imperfection of your work."],
    ["He gestures outward, sweeping one hand toward the crowd. Their applause falters into murmurs, the sound more like gossip in the dark than admiration."],
    ["His screen flickers, tone sharpening to a cruel edge."],
    ["The audience titters nervously. A cough, a shuffle of feet, the rustle of programs. The energy drains from the hall as quickly as it rose."],
    ["He pivots suddenly, pointing a polished finger directly at you. The spotlight narrows, isolating you in a cold cone of white."],
    ["His voice drops, low and intimate, almost venomous."],
    ["The spotlight snaps off. The stage is swallowed in darkness. For a moment, all that remains is the echo of half-hearted applause, fading into silence."]
];

const mettRateFinalEndBetrayalMiddle = [
    [""]
    [""],
    ["Ahhh, darling... hear that?", "Not the roar of triumph. Not the hiss of outrage.", "Just... noise. Tepid, flavorless noise."],
    ["You played your hand. You plotted, you twisted, you betrayed.", "For a glittering second, it almost worked - eyes turned, mouths gasped, hearts quickened..."],
    ["...But sparks that fizzle never become fire."],
    ["You wanted scandal, darling. And scandal you made... but only the petty kind.", "A fleeting rumor. A tiny footnote in tomorrow’s tabloids.", "Nothing sharp enough to scar, nothing bright enough to burn.", "Just a stain - destined to be scrubbed away."],
    ["Look at them. Not cheering. Not booing. Just watching, already forgetting.", "You gave them betrayal without brilliance - and in this world, darling..."],
    ["...The greatest failure is to be forgettable."],
    [""]
];

const flavorRateFinalEndBetrayalHigh = [
    ["The scores burst across judges' scoreboards, perfect. The crowd gasps, then bursts into frenzy - stomping, screaming, roses flying like confetti."]
    ["This result is undeniable, staggering, almost unthinkable. Even in betrayal, even with the odds stacked against you, you’ve done the impossible."],
    ["Mettaton steps into the light, flawless and radiant. When he speaks, there's a tinge of hurt surprise - blink and you'll miss it."],
    ["The crowd’s chant swells, shaking the stage: 'MET-TA-TON! MET-TA-TON!' But this time, there are other cries - your name, shouted, chanted, mixed into the tide. Not equal, but present. Real."],
    ["For the first time, it feels like you carved out a sliver of the spotlight for yourself."],
    ["He glides closer, lowering his voice - intimate, with a dangerious gleam of his now perfectly stark screen, your work erased."],
    ["With a final, glittering spin, the lights converge on him. The cheers rise to fever pitch, swallowing your name into his."],
    ["The roses at your feet are real... but the stage itself still belongs to him."]
];

const mettRateFinalEndBetrayalHigh = [
    [""]
    [""],
    ["Darling...! You actually did it.", "Against every scandal, every gasp, every jeer...", "You seized their eyes, their hearts, their precious little thrills - and you won them."],
    [""],
    ["Delicious! Scandal that became triumph, betrayal that became history!", "You’ve stolen a scene in my grandest show. And darling, let me assure you...", "...Very, very few ever manage that."],
    ["But remember: roses wilt. Whispers fade. Rivalries burn hot... then turn to ash.", "Yet me? I am the spotlight. Eternal. Inescapable.", "Your triumph will live on - but always, always in my shadow."],
    [""],
    [""]
];

const commonText = [
    "Production Team",
    "Directed by: Mettaton",
    "Camera Operator: Aaron",
    "Sound Effects & Music: Napstablook",
    "Lighting Technician: Jerry",
    "Robotics Specialist: Alphys",
    "Makeup Artist: Alphys",
    "Wardrobe Management: Catty & Bratty",
    "Cue/Applause Sign Holder: Mettabot Model CLAP-TRAP",
    "On-Set Catering: Muffet",
    "",
    "Art Department",
    "Head Illustrator: So Sorry",
    "Mettaton Face Model Reference: Mettaton (of course)",
    "Face Canvas Maintenance Crew: Woshua",
    "",
    "Stage & Set Crew",
    "Stage Pyrotechnics & Fog Machine Operator: Vulkin",
    "Glitter Effects Supervisor: Tsunderplane",
    "Rose Deployment Technician: Lesser Dog",
    "",
    "Romantic Operations Department",
    "Romantic Tension Consultant: Burgerpants (unpaid intern)",
    "Breakup Scene Consultants: Bratty & Catty",
    "Post-Rejection Recovery Counselor: Papyrus",
    "Heartbreak Stunt Double: A cardboard box with lipstick",
    "Romantic Lighting Designer: Tsunderplane",
];

const flirtyFailTitle = ["METTATON'S ART SHOW/ROMANCE SPECIAL: END CREDITS"];

const flirtyFailDepartment = [
    "Romantic Operations Department",
    "Romantic Tension Consultant: Burgerpants (unpaid intern)",
    "Breakup Scene Consultants: Bratty & Catty",
    "Post-Rejection Recovery Counselor: Papyrus",
    "Heartbreak Stunt Double: A cardboard box with lipstick",
    "Romantic Lighting Designer: Tsunderplane"
];

const flirtyFailAwards = [
    "Award Segment",
    "Best Improvised Monologue While Rejecting a Suitor (Gracefully): Mettaton",
    "Best Performance by a Leading Role in a Romance Drama: Mettaton",
];

const flirtyFailSponsors = [
    "This show was made possible by:",
    "GlamGal Grease - For when your gears need to glow.",
    "RoboRomance Magazine - Now 99% Mettaton!",
    "The Official Mettaton Body Pillow - 'For lonely nights... or all of them.'",
    "Dramatone Eyeliner - Cries with you.",
];

const flirtyFailLegal = [
    "No monsters were emotionally harmed during the making of this episode.",
    "Any resemblance to your love life is purely coincidental... probably.",
    "Viewer discretion advised: contains emotional turbulence.",
    "Use sparkle responsibly."
];

const flirtyFailClosing = [
    "Tune in next time for more drama, more sparkle, and maybe, just maybe... more love."
];

// low

const flirtyLowTitle = ["METTATON'S ART SHOW/ROMANCE SPECIAL: END CREDITS"];

const flirtyLowDepartment = [
    "Romantic Operations Department",
    "Passion Coordinator: Burgerpants (unpaid intern)",
    "Chemistry Consultants: Bratty & Catty",
    "Romantic Lighting Designer: Tsunderplane",
    "Heartthrob Stand-In: A potted plant (Mettaton-approved)"
];

const flirtyLowAwards = [
    "Award Segment",
    "Most Dramatic Near-Swoon: Mettaton",
    "Audience Vote for 'Second Chance Needed': YOU"
];

const flirtyLowSponsors = [
    "This show was made possible by:",
    "Lonely Hearts’ Karaoke Night - Thursdays at Grillby’s, first drink free!",
    "Instant Noodles - For when romance just isn’t on the menu",
    "Re-runs of 'Cooking with Mettaton!' - Weeknights at 7!"
];

const flirtyLowLegal = [
    "All romantic sparks generated tonight are considered 'non-binding'.",
    "Results may vary depending on charisma, timing, and dramatic lighting.",
    "Consult a doctor if you blush for more than 4 hours."
];

const flirtyLowClosing = [
    "Tune in again — maybe next time your sparks will actually start a fire."
];

// middle

const flirtyMiddleTitle = ["METTATON'S ART SHOW/ROMANCE SPECIAL: END CREDITS"];

const flirtyMiddleDepartment = [
    "Romantic Operations Department",
    "Passion Coordinator: Burgerpants (unpaid intern)",
    "Chemistry Consultants: Bratty & Catty",
    "Romantic Lighting Designer: Tsunderplane",
    "Heartthrob Stand-In: A potted plant (Mettaton-approved)"
];

const flirtyMiddleAwards = [
    "Award Segment",    
    "Outstanding Use of Stage Lighting for Maximum Tension: Mettaton",
    "The 'Just Kiss Already' Award"
];

const flirtyMiddleSponsors = [
    "This show was made possible by:",
    "Glamazon Prime - free shipping on roses, chocolates, and fan mail.",
    "Alphys’ Shipping Hotline - text 'OTP' for live updates!",
    "MTT Brand Perfume — ‘One spritz, infinite longing’"
];

const flirtyMiddleLegal = [
    "Any romance depicted may cause excessive swooning in susceptible viewers.",
    "Do not attempt these levels of passion unsupervised.",
    "All lingering eye contact licensed exclusively to MTT Productions."
];

const flirtyMiddleClosing = [
    "A spark caught on live television — rare, dazzling, unforgettable.",
    "Will it blaze brighter next time? Stay tuned, beauties!"
];

// high

const flirtyHighTitle = ["METTATON'S ART SHOW/ROMANCE SPECIAL: END CREDITS"];

const flirtyHighDepartment = [
    "Romantic Operations Department",
    "Passion Coordinator: Burgerpants (unpaid intern)",
    "Chemistry Consultants: Bratty & Catty",
    "Romantic Lighting Designer: Tsunderplane",
    "Heartthrob Stand-In: A potted plant (Mettaton-approved)"
];

const flirtyHighAwards = [
    "Award Segment",    
    "Critics’ Choice for Irresistible Leading Couple",
    "Underground Emmy for Romance in Prime Time"
];

const flirtyHighSponsors = [
    "This show was made possible by:",
    "Rosemelt Candles - 'Let the scent of passion linger long after the credits.'",
    "Red Velvet Energy Bars - because passion burns calories!",
    "Starlight Champagne Co. - 'Raise a glass to forever.'",
    "Underground Broadcasting Network - 'Delivering the drama you didn’t know you needed.'"
];

const flirtyHighLegal = [
    "Side effects may include sighing, hand-holding, and writing overly dramatic poetry.",
    "Mettaton Enterprises is not liable for fainting due to excessive charm."
];

const flirtyHighClosing = [
    "Until our next rendezvous, darlings... don’t stop believing in the spotlight of love."
];

//friendly

// low

const friendlyLowTitle = ["METTATON’S ART SHOW/FRIENDSHIP EXTRAVAGANZA: END CREDITS"];

const friendlyLowDepartment = [
    "Department of Audience Relations and Cooperative Entertainment",
    "Coordinator of High-Fives: Monster Kid",
    "Chief Encouragement Officer: Toriel",
    "Compliment Consultant: Nice Cream Guy",
    "Team Spirit and Training Technician - Temmie"
];

const friendlyLowAwards = [
    "Award Segment",   
    "Excellence in Boa Management and Feather Control: Mettaton",
    "Most Promising Prop Wrangler: YOU (Honorable Mention)"
];

const friendlyLowSponsors = [
    "This show was made possible by:",
    "Backstage Brew - coffee strong enough to survive any tech rehearsals",
    "Glowstick Warehouse Outlet - 'Lighting up your role, no matter how small.'",
    "Royal Capital Paperclip Consortium - Holding your clipboard and your dignity together.",
    "Toriel’s Knitted Socks Co. - 'Warm feet, warmer friendships.'"
];

const friendlyLowLegal = [
    "The title of 'Assistant' does not guarantee health insurance, free snacks, or union representation.",
    "Any resemblance to unpaid interns, actual or implied, is purely coincidental."
];

const friendlyLowClosing = [
    "Remember: without assistants, there’s no act, no sparkle, no show. Goodnight, my unseen heroes!"
];

// middle

const friendlyMiddleTitle = ["METTATON’S ART SHOW/FRIENDSHIP EXTRAVAGANZA: END CREDITS"];

const friendlyMiddleDepartment = [
    "Department of Audience Relations and Cooperative Entertainment",
    "Coordinator of High-Fives: Monster Kid",
    "Chief Encouragement Officer: Toriel",
    "Compliment Consultant: Nice Cream Guy",
    "Team Spirit and Training Technician: Temmie"
];

const friendlyMiddleAwards = [
    "Award Segment",    
    "Best Performance That Wasn’t Technically the Lead: YOU"
];

const friendlyMiddleSponsors = [
    "This show was made possible by:",
    "MTT Brand Co-Op Arcade Cabinet - 'Because Player Two matters'.",
    "Second Act Insurance - covering minor stage slips, fainting spells, and overzealous pirouettes",
    "Dramedy Masks Inc. - smile now, cry later (professionally)"
];

const friendlyMiddleLegal = [
    "Being an official understudy does not guarantee leading roles, glamour,",
    "or access to Mettaton’s personal dressing room.",
    "All star-making opportunities are subject to cancellation, rescheduling,",
    "or catastrophic ego meltdowns."
];

const friendlyMiddleClosing = [
    "So, viewers... let’s give a round of applause for tonight’s nearly-star!",
    "Their big debut may not be tonight, but remember - every understudy’s shadow",
    "is just waiting to burst into light."
];

// high

const friendlyHighTitle = ["METTATON’S ART SHOW/FRIENDSHIP EXTRAVAGANZA: END CREDITS"];

const friendlyHighDepartment = [
    "Department of Audience Relations and Cooperative Entertainment",
    "Coordinator of High-Fives: Monster Kid",
    "Chief Encouragement Officer: Toriel",
    "Compliment Consultant: Nice Cream Guy",
    "Team Spirit and Training Technician - Temmie"
];

const friendlyHighAwards = [
    "Award Segment",    
    "Golden Spotlight for Best Duo Performance: Mettaton & YOU",
    "The Rising Starlet Award: YOU"
];

const friendlyHighSponsors = [
    "This show was made possible by:",
    "ForeverFlare Lighting - the only spotlight that dares rival yours",
    "GlitterForge™ - armory of sparkle, certified indestructible",
    "Radiant Pulse Energy Drink - bottled applause, carbonated fame"
];

const friendlyHighLegal = [
    "By participating in the newly-declared era of Mettaton & Frisk, audiences",
    "accept full responsibility for fainting from overwhelming brilliance.",
    "Prolonged exposure to dual stardom may result in euphoric screaming, autograph addiction,",
    "and a sparkle-induced whiplash.",
    "Refunds will not be offered, because history cannot be refunded."
];

const friendlyHighClosing = [
    "Tonight was no ending, darlings - it was an overture.",
    "Two stars blazing brighter than one, a legend too radiant to ever fade!"
];

//neutral

// low

const neutralLowTitle = ["METTATON’S ART SHOW SPECIAL: END CREDITS"];

const neutralLowDepartment = [
    "Department of Audience Management and Damage Control",
    "Chief Excuse Engineer - Alphys",
    "Refund Distribution Supervisor - Nice Cream Guy",
    "Snack Bar Logistics Coordinator - Burgerpants"
];

const neutralLowAwards = [
    "Award Segment",   
    "Lifetime Achievement in Audience Disappointment: YOU"
];

const neutralLowSponsors = [
    "This show was made possible by:",
    "Napstablook’s Mix Tapes - 'Perfect for when things flop.'",
    "Temmie’s Bargain Exits - 'Get out fast, get out cheap!'"
];

const neutralLowLegal = [
    "No audience members were emotionally scarred beyond standard contractual limits.",
    "Refunds may be redeemed in the form of coupons for unrelated entertainment.",
    "By staying seated, you agree that boredom is subjective."
];

const neutralLowClosing = [
    "Thank you for enduring... err, watching."
];

// middle

const neutralMiddleTitle = ["METTATON’S ART SHOW SPECIAL: END CREDITS"];

const neutralMiddleDepartment = [
    "Department of Audience Management and Damage Control",
    "Chief Excuse Engineer - Alphys",
    "Refund Distribution Supervisor - Nice Cream Guy",
    "Snack Bar Logistics Coordinator - Burgerpants"  
];

const neutralMiddleAwards = [
    "Award Segment",
    "The Golden Popcorn Bucket Award (for Inspiring Snack Runs): YOU"
];

const neutralMiddleSponsors = [
    "This show was made possible by:",
    "Glamburger™ Snack Breaks - 'The real star of the evening.'",
    "Nice Cream Vending Solutions - 'Because nothing says ‘meh’ like lukewarm sprinkles.'",
    "Snowdin Soda Co. - 'Carbonation you can count on when art can’t.'"
];

const neutralMiddleLegal = [
    "Viewer engagement during intermission may not reflect actual artistic merit.",
    "Any resemblance between this performance and quality entertainment is purely coincidental."
];

const neutralMiddleClosing = [
    "Thank you for joining us tonight!",
    "Now please enjoy something actually satisfying - the concession stand",
    "is still open until the start of the next show."
];

// high

const neutralHighTitle = ["METTATON’S ART SHOW SPECIAL: END CREDITS"];

const neutralHighDepartment = [
    "Department of Audience Management and Damage Control",
    "Chief Excuse Engineer - Alphys",
    "Refund Distribution Supervisor - Nice Cream Guy",
    "Snack Bar Logistics Coordinator - Burgerpants"
];

const neutralHighAwards = [
    "Award Segment",
    "The Reluctant Virtuoso Award: YOU",
    "Best Unintended Masterpiece"
];

const neutralHighSponsors = [
    "This show was made possible by:",
    "Napstablook’s Limited Edition Vinyls - 'For the quiet genius in us all.'",
    "Dog Residue Cleaning Services - 'Because even brilliance leaves a mess.'",
    "Underground Ink Co. - 'For sketches that might shock, or might just flop.'"
];

const neutralHighLegal = [
    "Sudden stardom may cause dizziness, inflated ego, or unsolicited fan mail.",
    "The producers assume no responsibility if your work gets auctioned off without your consent."
];

const neutralHighClosing = [
    "Thank you, dearest viewers, for witnessing greatness emerge from neutrality.",
    "Remember - even hesitation can make history (even if rarely)."
];

//negative

// low

const negativeLowTitle = ["METTATON’S CLOWN SHOW/ART SHOW SPECIAL: END CREDITS"];

const negativeLowDepartment = [
    "Department of Accidents & Public Safety Hazards",
    "Grillby - Pyrotechnics and Fire Safety",
    "Mad Dummy - Anger Management Consultant",
    "River Person - Evacuation Planner"
];

const negativeLowAwards = [
    "Award Segment",
    "The 'Brightest Burnout' Award: YOU"
];

const negativeLowSponsors = [
    "This show was made possible by:",
    "Grillby’s Fire Safety School - Enrollment now open!",
    "Burgerpants’ Bargain Sunscreen - SPF too little, too late.",
    "Hotland Tourist Bureau - 'Feel the burn!' package tours."
];

const negativeLowLegal = [
    "This program accepts no responsibility for combustions, humiliations, or existential",
    "collapse experienced during tonight’s performance.",
    "By entering the stage, all participants waive dignity, hope, and posthumous rights to complaint.",
    "Do not attempt at home, in theaters, or anywhere lacking a five-star insurance policy."
];

const negativeLowClosing = [
    "Every clown burns bright, but only once.",
    "Apologies to the audience for the smoke and ash.",
    "The concession stand will remain open while we sweep up what’s left."
];

// middle

const negativeMiddleTitle = ["METTATON’S CLOWN SHOW/ART SHOW SPECIAL: END CREDITS"];

const negativeMiddleDepartment = [
    "Department of Pity Applause & Failed Performances",
    "Snowdrake - Head Joke Critic ('this isn’t even funny...')",
    "Gyftrot - Prop Delivery",
    "Temmie - Merchandising ('get ur failure plushie!!')"
];

const negativeMiddleAwards = [
    "Award Segment",
    "The 'Nap Time Highlight' Award': YOU"
];

const negativeMiddleSponsors = [
    "This show was made possible by:",
    "Snowdin Library - Because silence is better than this.",
    "Tem Shop - Selling your dignity back at double price.",
    "Nice Cream Guy - New flavor: 'Tearsicle.'"
];

const negativeMiddleLegal = [
    "Mettaton Enterprises reserves the right to humiliate performers for entertainment value.",
    "Refunds not available; pity applause constitutes payment in full."
];

const negativeMiddleClosing = [
    "All tumbling acts are performed by trained participants or those deemed expendable.",
    "Mettaton Enterprises reserves the right to humiliate performers for entertainment value",
    "No dignity was harmed in the making of this performance - because it was never",
    "present to begin with."
];

// high

const negativeHighTitle = ["METTATON’S CLOWN SHOW/ART SHOW SPECIAL: END CREDITS"];

const negativeHighDepartment = [
    "Department of Mock Honors",
    "Mettaton - Master of Ceremonies, Arbiter of Ridicule",
    "Glyde - Vanity Consultant",
    "Napstablook - Mood Technician"
];

const negativeHighAwards = [
    "Award Segment",
    "The 'Jester’s Crown' Distinction - Heavy with bells, hollow of meaning.",
    "The 'Star of Irony' Ribbon - YOU shone... only as the butt of the joke."
];

const negativeHighSponsors = [
    "This show was made possible by:",  
    "Snowdin’s Department of Festivals - 'Making sure your circus stays licensed and laughable.'",
    "Temmie Premium Bell Oil - 'so ur clown hat jingles good!!'",
    "Nice Cream XL (Clown Special) - 'Bright, colorful, and melting all over your dignity.'"
];

const negativeHighLegal = [
    "This coronation is purely symbolic. Title of Clown Monarch confers",
    "no respect, wealth, or real power.",
    "Crowning does not imply actual royalty. Bells included, dignity not.”"
];

const negativeHighClosing = [
    "Ah, my devoted viewers! Witness the rise of a true... calamity.",
    "Give them the applause they think they deserve!"
];

//betrayal

// low

const betrayalLowTitle = ["METTATON'S PUPPET SHOW/ART SHOW SPECIAL: END CREDITS"];

const betrayalLowDepartment = [
    "Department of Puppet Affairs",
    "Mettaton - Puppetmaster Extraordinaire",
    "Mad Dummy - Motion Director (“MAKE ‘EM JERK HARDER!!”)",
    "Muffet - Web & Wire & String Safety Supervisor",
    "Shyren - Humiliation Soundtrack Specialist"
];

const betrayalLowAwards = [
    "Award Segment",
    "'Strings Attached' Medal - YOU"
];

const betrayalLowSponsors = [
    "This show was made possible by:",
    "The Underground Clown Union - 'Supporting failed entertainers everywhere.'",
    "Nice Cream Seasonal Flavors - Tonight’s special: Salted Regret."
];

const betrayalLowLegal = [
    "Mettaton Enterprises accepts no liability for crushed ambitions, broken pride,",
    "or puppet-related injuries."
];

const betrayalLowClosing = [
    "Remember, darlings, betrayal makes for such fine theater...",
    "but only when you’re not the one hanging by the strings."
];

// middle

const betrayalMiddleTitle = ["METTATON'S YAWN SHOW/ART SHOW SPECIAL: END CREDITS"];

const betrayalMiddleDepartment = [
    "Department of Managing Forgettability",
    "Mettaton - Archivist of Mediocrity",
    "Temmie - Merchandising Lead ('wow! boring shirt! 20g!!')",
    "Nice Cream Guy - Disappointment Distributor",
    "Jerry - Conversation Killer"
];

const betrayalMiddleAwards = [
    "Award Segment",
    "The Audience Yawn Commendation - YOU, for inspiring drowsiness since tonight."
];

const betrayalMiddleSponsors = [
    "This show was made possible by:",
    "Muffet’s Gossip Blend Tea - Best served lukewarm, just like your scandal.",
    "Nice Cream 'Meh-Sundae' Special - The flavor you’ll forget five minutes later."
];

const betrayalMiddleLegal = [
    "This betrayal was rated PG: ‘Partially Gripping.’ Use only as background noise.",
    "Warning: Tonight’s act may cause symptoms of indifference, mild apathy,",
    "or checking your phone during the show.",
    "Viewer discretion is advised."
];

const betrayalMiddleClosing = [
    "Thank you for tuning in.",
    "Remember, lovely viewers: betrayal should make you shiver, not yawn."
];

// high

const betrayalHighTitle = ["METTATON'S 'ART OF BETRAYAL' SHOW SPECIAL: END CREDITS"];

const betrayalHighDepartment = [
    "Department of Fleeting Fame & Scandal",
    "Mettaton - Chairman of Everlasting Glamour",
    "Bratty & Catty - Paparazzi Scouts (already sold your photo for 10G)",
    "Nice Cream Guy - Temporary Delight Distributor",
    "Burgerpants - PR Exhaustion Specialist",
    "Gyftrot - Rose Sweeper"
];

const betrayalHighAwards = [
    "Award Segment",
    "The 'Scandal Laurels' Crown - YOU",
    "The “Thorned Rose” Distinction - to you, who made beauty cut as sharply as betrayal"
];

const betrayalHighSponsors = [
    "This show was made possible by:",
    "Royal Waterfall Press - Tomorrow’s headlines today: ‘Traitor or Triumph?’",
    "CORE Broadcasting Network - 'Turning treachery into prime-time ratings!'",
    "Bratty & Catty’s Starlet Boutique",
    "Mad Dummy’s Puppet School - 'Learn control, lose control, look fabulous doing both.'"
];

const betrayalHighLegal = [
    "Roses are symbolic only and hold no transferable value.",
    "Applause levels are subject to change without notice.",
    "Any fame accrued tonight will fade in 24 hours unless renewed by authorized sequels."
];

const betrayalHighClosing = [
    "What a show! What a scandal! And yet, by sunrise...",
    "it’ll be just another headline fading into dust.",
    "Until next time, darlings - may your cheers echo longer than the star who borrowed them."
];



allCredits = {
    forAll: commonText,
    flirty: {
        low: {
            title: flirtyLowTitle,
            department: flirtyLowDepartment,
            awards: flirtyLowAwards,
            sponsors: flirtyLowSponsors,
            legal: flirtyLowLegal,
            closing: flirtyLowClosing
        },
        middle: {
            title: flirtyMiddleTitle,
            department: flirtyMiddleDepartment,
            awards: flirtyMiddleAwards,
            sponsors: flirtyMiddleSponsors,
            legal: flirtyMiddleLegal,
            closing: flirtyMiddleClosing
        },
        high: {
            title: flirtyHighTitle,
            department: flirtyHighDepartment,
            awards: flirtyHighAwards,
            sponsors: flirtyHighSponsors,
            legal: flirtyHighLegal,
            closing: flirtyHighClosing
        },
        fail: {
            title: flirtyFailTitle,
            department: flirtyFailDepartment,
            awards: flirtyFailAwards,
            sponsors: flirtyFailSponsors,
            legal: flirtyFailLegal,
            closing: flirtyFailClosing
        }
    },
    friendly: {
        low: {
            title: friendlyLowTitle,
            department: friendlyLowDepartment,
            awards: friendlyLowAwards,
            sponsors: friendlyLowSponsors,
            legal: friendlyLowLegal,
            closing: friendlyLowClosing
        },
        middle: {
            title: friendlyMiddleTitle,
            department: friendlyMiddleDepartment,
            awards: friendlyMiddleAwards,
            sponsors: friendlyMiddleSponsors,
            legal: friendlyMiddleLegal,
            closing: friendlyMiddleClosing
        },
        high: {
            title: friendlyHighTitle,
            department: friendlyHighDepartment,
            awards: friendlyHighAwards,
            sponsors: friendlyHighSponsors,
            legal: friendlyHighLegal,
            closing: friendlyHighClosing
        },
    },
    neutral: {
        low: {
            title: neutralLowTitle,
            department: neutralLowDepartment,
            awards: neutralLowAwards,
            sponsors: neutralLowSponsors,
            legal: neutralLowLegal,
            closing: neutralLowClosing
        },
        middle: {
            title: neutralMiddleTitle,
            department: neutralMiddleDepartment,
            awards: neutralMiddleAwards,
            sponsors: neutralMiddleSponsors,
            legal: neutralMiddleLegal,
            closing: neutralMiddleClosing
        },
        high: {
            title: neutralHighTitle,
            department: neutralHighDepartment,
            awards: neutralHighAwards,
            sponsors: neutralHighSponsors,
            legal: neutralHighLegal,
            closing: neutralHighClosing
        },
    },
    negative: {
        low: {
            title: negativeLowTitle,
            department: negativeLowDepartment,
            awards: negativeLowAwards,
            sponsors: negativeLowSponsors,
            legal: negativeLowLegal,
            closing: negativeLowClosing
        },
        middle: {
            title: negativeMiddleTitle,
            department: negativeMiddleDepartment,
            awards: negativeMiddleAwards,
            sponsors: negativeMiddleSponsors,
            legal: negativeMiddleLegal,
            closing: negativeMiddleClosing
        },
        high: {
            title: negativeHighTitle,
            department: negativeHighDepartment,
            awards: negativeHighAwards,
            sponsors: negativeHighSponsors,
            legal: negativeHighLegal,
            closing: negativeHighClosing
        },
    },
    betrayal: {
        low: {
            title: betrayalLowTitle,
            department: betrayalLowDepartment,
            awards: betrayalLowAwards,
            sponsors: betrayalLowSponsors,
            legal: betrayalLowLegal,
            closing: betrayalLowClosing
        },
        middle: {
            title: betrayalMiddleTitle,
            department: betrayalMiddleDepartment,
            awards: betrayalMiddleAwards,
            sponsors: betrayalMiddleSponsors,
            legal: betrayalMiddleLegal,
            closing: betrayalMiddleClosing
        },
        high: {
            title: betrayalHighTitle,
            department: betrayalHighDepartment,
            awards: betrayalHighAwards,
            sponsors: betrayalHighSponsors,
            legal: betrayalHighLegal,
            closing: betrayalHighClosing
        },
    }
}




allText = {
    flavor: {
        rate: {
            blank: {
                positive: { once: flavorBlankPositiveOnce, more: flavorBlankPositiveMore },
                neutral: { once: flavorBlankNeutralOnce, more: flavorBlankNeutralMore },
                negative: { once: flavorBlankNegativeOnce, more: flavorBlankGegativeMore },
            },
            ratingIntroduction: {
                positive: flavorRatingPositiveIntro,
                neutral: flavorRatingNeutralIntro,
                negative: flavorRatingNegativeIntro
            },
            colorComments: {
                positive: {
                    lightBlue: flavorRatePositiveColorBlue,
                    purple: flavorRatePositiveColorPurple,
                    bothColorsComment: flavorRatePositiveColorBoth,

                    pencilComment: flavorRatePositiveInstrumentPencil,
                    rainbowComment: flavorRatePositiveInstrumentRainbow,
                    bothInstrumentsComment: flavorRatePositiveInstrumentBoth,

                    one: flavorRatePositiveColorOne,
                    few: flavorRatePositiveColorFew,
                    many: flavorRatePositiveColorMany
                },
                neutral: {
                    lightBlue: flavorRateNeutralColorBlue,
                    purple: flavorRateNeutralColorPurple,
                    bothColorsComment: flavorRateNeutralColorBoth,

                    pencilComment: flavorRateNeutralInstrumentPencil,
                    rainbowComment: flavorRateNeutralInstrumentRainbow,
                    bothInstrumentsComment: flavorRateNeutralInstrumentBoth,

                    one: flavorRateNeutralColorOne,
                    few: flavorRateNeutralColorFew,
                    many: flavorRateNeutralColorMany
                },
                negative: {
                    lightBlue: flavorRateNegativeColorBlue,
                    purple: flavorRateNegativeColorPurple,
                    bothColorsComment: flavorRateNegativeColorBoth,

                    pencilComment: flavorRateNegativeInstrumentPencil,
                    rainbowComment: flavorRateNegativeInstrumentRainbow,
                    bothInstrumentsComment: flavorRateNegativeInstrumentBoth,

                    one: flavorRateNegativeColorOne,
                    few: flavorRateNegativeColorFew,
                    many: flavorRateNegativeColorMany
                },
            },
            densityComments: {
                positive: {
                    bucketComment: flavorRatePositiveBucket,
                    dotComment: flavorRatePositiveDot,

                    sparse: flavorRatePositiveSparse,
                    little: flavorRatePositiveLittle,
                    some: flavorRatePositiveSome,
                    filledOut: flavorRatePositiveFilledOut,
                    lots: flavorRatePositiveLots,
                    full: flavorRatePositiveFull
                },
                neutral: {
                    bucketComment: flavorRateNeutralBucket,
                    dotComment: flavorRateNeutralDot,

                    sparse: flavorRateNeutralSparse,
                    little: flavorRateNeutralLittle,
                    some: flavorRateNeutralSome,
                    filledOut: flavorRateNeutralFilledOut,
                    lots: flavorRateNeutralLots,
                    full: flavorRateNeutralFull
                },
                negative: {
                    bucketComment: flavorRateNegativeBucket,
                    dotComment: flavorRateNegativeDot,

                    sparse: flavorRateNegativeSparse,
                    little: flavorRateNegativeLittle,
                    some: flavorRateNegativeSome,
                    filledOut: flavorRateNegativeFilledOut,
                    lots: flavorRateNegativeLots,
                    full: flavorRateNegativeFull
                },
            },
            mannersComments: {
                ifHighFlirty: flavorRateMannersHighFlirty,
                ifHighFriendly: flavorRateMannersHighFriendly,
                ifNeutral: flavorRateMannersNeutral,
                ifNegative: flavorRateMannersNegative,
                ifVeryNegative: flavorRateMannersVeryNegative,
                ifBetrayal: flavorRateMannersBetrayal
            },

            finalScore: {
                start: {
                    positiveFlirty: flavorRateFinalStartPositiveFlirty,
                    positiveFriendly: flavorRateFinalStartPositiveFriendly,
                    neutral: flavorRateFinalStartNeutral,
                    negative: flavorRateFinalStartNegative,
                    betrayal: flavorRateFinalStartFullBetrayal
                },
                endFinal: {
                    positiveFlirty: {
                        low: flavorRateFinalEndPositiveFlirtyLow,
                        middle: flavorRateFinalEndPositiveFlirtyMiddle,
                        high: flavorRateFinalEndPositiveFlirtyHigh
                    },
                    positiveFriendly: {
                        low: flavorRateFinalEndPositiveFriendlyLow,
                        middle: flavorRateFinalEndPositiveFriendlyMiddle,
                        high: flavorRateFinalEndPositiveFriendlyHigh
                    },
                    neutral: {
                        low: flavorRateFinalEndNeutralLow,
                        middle: flavorRateFinalEndNeutralMiddle,
                        high: flavorRateFinalEndNeutralHigh
                    },
                    negative: {
                        low: flavorRateFinalEndNegativeLow,
                        middle: flavorRateFinalEndNegativeMiddle,
                        high: flavorRateFinalEndNegativeHigh
                    },
                    betrayal: {
                        low: flavorRateFinalEndBetrayalLow,
                        middle: flavorRateFinalEndBetrayalMiddle,
                        high: flavorRateFinalEndBetrayalHigh
                    }
                }
            }
        },
        introduction: flavorIntro,
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
        rose: {
            positive: flavorRosePos,
            wasInsulted: {
                rude: flavorRoseRude,
                tooMuch: flavorRoseMaxInsult
            }
        },
        stick: {
            none: {
                firstThrow: flavorThrowOnceEmpty,
                anotherThrow: flavorThrowMoreEmpty
            },
            drawn: {
                firstThrow: flavorThrowOnceDrawn,
                anotherThrow: flavorThrowMoreDrawn
            }
        },
        mercy: {
            none: flavorMercyEmpty,
            drawn: flavorMercyDrawn
        },
        fight: {
            grow: flavorFightGrow,
            shrink: flavorFightShrink
        },
        check: checkOut,
        flirt: {
            none: flavorFlirtNone,
            drawn:flavorFlirtDrawn,
            tooMuch: flavorFlirtTooMuch,
            ending: {
                win: flavorFlirtTooMuchEndingWin,
                lose: flavorFlirtTooMuchEndingLose
            },
            wasInsulted: {
                rude: flavorFlirtInsult,
                moreRude: flavorFlirtDisgrace, 
                tooMuch: flavorFlirtLock
            }
        },
        perform: {
            none: flavorPerformNone,
            drawn: flavorPerformDrawn,
            wasInsulted: {
                rude: flavorPerformInsult,
                moreRude: flavorPerformDisgrace, 
                tooMuch: flavorPerformLock
            }
        },
        insult: {
            none: flavorInsultNone,
            drawn: flavorInsultDrawn,
            tooMuch: flavorInsultTooMuch,
            wasFlirtedWith: {
                part: flavorBetrayal,
                full: flavorFullBetrayal
            }
        }
    },
    mettaton: {
        rate: {
            blank: {
                positive: {once: mettBlankPositiveOnce, more: mettBlankPositiveMore},
                neutral: {once: mettBlankNeutralOnce, more: mettBlankNeutralMore},
                negative: {once: mettBlankNegativeOnce, more: mettBlankGegativeMore},
            },
            ratingIntroduction: {
                positive: mettRatingPositiveIntro,
                neutral: mettRatingNeutralIntro,
                negative: mettRatingNegativeIntro
            },
            colorComments: {
                positive: {
                    lightBlue: mettRatePositiveColorBlue,
                    purple: mettRatePositiveColorPurple,
                    bothColorsComment: mettRatePositiveColorBoth,

                    pencilComment: mettRatePositiveInstrumentPencil,
                    rainbowComment: mettRatePositiveInstrumentRainbow,
                    bothInstrumentsComment: mettRatePositiveInstrumentBoth,

                    one: mettRatePositiveColorOne,
                    few: mettRatePositiveColorFew,
                    many: mettRatePositiveColorMany
                },
                neutral: {
                    lightBlue: mettRateNeutralColorBlue,
                    purple: mettRateNeutralColorPurple,
                    bothColorsComment: mettRateNeutralColorBoth,

                    pencilComment: mettRateNeutralInstrumentPencil,
                    rainbowComment: mettRateNeutralInstrumentRainbow,
                    bothInstrumentsComment: mettRateNeutralInstrumentBoth,

                    one: mettRateNeutralColorOne,
                    few: mettRateNeutralColorFew,
                    many: mettRateNeutralColorMany
                },
                negative: {
                    lightBlue: mettRateNegativeColorBlue,
                    purple: mettRateNegativeColorPurple,
                    bothColorsComment: mettRateNegativeColorBoth,

                    pencilComment: mettRateNegativeInstrumentPencil,
                    rainbowComment: mettRateNegativeInstrumentRainbow,
                    bothInstrumentsComment: mettRateNegativeInstrumentBoth,

                    one: mettRateNegativeColorOne,
                    few: mettRateNegativeColorFew,
                    many: mettRateNegativeColorMany
                },
            },
            densityComments: {
                positive: {
                    bucketComment: mettRatePositiveBucket,
                    dotComment: mettRatePositiveDot,

                    sparse: mettRatePositiveSparse,
                    little: mettRatePositiveLittle,
                    some: mettRatePositiveSome,
                    filledOut: mettRatePositiveFilledOut,
                    lots: mettRatePositiveLots,
                    full: mettRatePositiveFull
                },
                neutral: {
                    bucketComment: mettRateNeutralBucket,
                    dotComment: mettRateNeutralDot,

                    sparse: mettRateNeutralSparse,
                    little: mettRateNeutralLittle,
                    some: mettRateNeutralSome,
                    filledOut: mettRateNeutralFilledOut,
                    lots: mettRateNeutralLots,
                    full: mettRateNeutralFull
                },
                negative: {
                    bucketComment: mettRateNegativeBucket,
                    dotComment: mettRateNegativeDot,

                    sparse: mettRateNegativeSparse,
                    little: mettRateNegativeLittle,
                    some: mettRateNegativeSome,
                    filledOut: mettRateNegativeFilledOut,
                    lots: mettRateNegativeLots,
                    full: mettRateNegativeFull
                },
            },

            mannersComments: {
                ifHighFlirty: mettRateMannersHighFlirty,
                ifHighFriendly: mettRateMannersHighFriendly,
                ifNeutral: mettRateMannersNeutral,
                ifNegative: mettRateMannersNegative,
                ifVeryNegative: mettRateMannersVeryNegative,
                ifBetrayal: mettRateMannersBetrayal
            },

            finalScore: {
                start: {
                    positiveFlirty: mettRateFinalStartPositiveFlirty,
                    positiveFriendly: mettRateFinalStartPositiveFriendly,
                    neutral: mettRateFinalStartNeutral,
                    negative: mettRateFinalStartNegative,
                    betrayal: mettRateFinalStartFullBetrayal
                },
                endFinal: {
                    positiveFlirty: {
                        low: mettRateFinalEndPositiveFlirtyLow,
                        middle: mettRateFinalEndPositiveFlirtyMiddle,
                        high: mettRateFinalEndPositiveFlirtyHigh
                    },
                    positiveFriendly: {
                        low: mettRateFinalEndPositiveFriendlyLow,
                        middle: mettRateFinalEndPositiveFriendlyMiddle,
                        high: mettRateFinalEndPositiveFriendlyHigh
                    },
                    neutral: {
                        low: mettRateFinalEndNeutralLow,
                        middle: mettRateFinalEndNeutralMiddle,
                        high: mettRateFinalEndNeutralHigh
                    },
                    negative: {
                        low: mettRateFinalEndNegativeLow,
                        middle: mettRateFinalEndNegativeMiddle,
                        high: mettRateFinalEndNegativeHigh
                    },
                    betrayal: {
                        low: mettRateFinalEndBetrayalLow,
                        middle: mettRateFinalEndBetrayalMiddle,
                        high: mettRateFinalEndBetrayalHigh
                    }
                }
            }
        },
        introduction: mettIntro,
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
        rose: {
            positive: mettRosePos,
            wasInsulted: {
                rude: mettRoseRude,
                tooMuch: mettRoseMaxInsult
            }
        },
        stick: {
            none: {
                firstThrow: mettThrowOnceEmpty,
                anotherThrow: mettThrowMoreEmpty
            },
            drawn: {
                firstThrow: mettThrowOnceDrawn,
                anotherThrow: mettThrowMoreDrawn
            }
        },
        mercy: {
            none: mettMercyEmpty,
            drawn: mettMercyDrawn
        },
        fight: {
            grow: mettFightGrow,
            shrink: mettFightShrink
        },
        check: {
            none: mettCheckNone,
            drawn: mettCheckDrawn
        },
        flirt: {
            none: mettFlirtNone,
            drawn: mettFlirtDrawn,
            tooMuch: mettFlirtTooMuch,
            ending: {
                win: mettFlirtTooMuchEndingWin,
                lose: mettFlirtTooMuchEndingLose
            },
            wasInsulted: {
                rude: mettFlirtInsult,
                moreRude: mettFlirtDisgrace, 
                tooMuch: mettFlirtLock
            }
        },
        perform: {
            none: mettPerformNone,
            drawn: mettPerformDrawn,
            wasInsulted: {
                rude: mettPerformInsult,
                moreRude: mettPerformDisgrace, 
                tooMuch: mettPerformLock
            }
        },
        insult: {
            none: mettInsultNone,
            drawn: mettInsultDrawn,
            tooMuch: mettInsultTooMuch,
            wasFlirtedWith: {
                part: mettBetrayal,
                full: mettFullBetrayal
            }
        }
    },
}

const mettTalking = function (phrase) {
    let stopCondition = false;

    window.addEventListener("keydown", (event) => {
        if (event.code === "Digit2" || event.code === "Numpad2" ) {
            stopCondition = true;
        }
    })

    if (!phrase || (phrase.length === 1 && phrase[0] === "" || stopCondition)) { 
        return Promise.resolve(); 
    } 

    return new Promise(async (resolve) => {
        let i = 0; 
        textBubble.classList.remove("gone");
        gameState["mettTextShown"] = true;
        let stopCondition = false;

        window.addEventListener("keydown", (event) => {
        if (event.code === "Digit2" || event.code === "Numpad2" ) {
            removeBubble();
            stopCondition = true;
        }
    })


        async function displayNextPhrase() {
            if (i >= phrase.length) {
                setTimeout(removeBubble, 50);
                return;
            }

            let phraseDivided = phrase[i].split(" ");
            bubbleTextField.textContent = "";

            for (let word of phraseDivided) {
                if (stopCondition) {
                    break;
                }
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
    pageNavigation.classList.add("invisible");
    marginAdjust();

    const allCells = document.querySelectorAll(".innerCells");
    

const clearSketchField = async function() {
    successfulSelect();
    let correctKey = gameState["hasDrawing"] ? "drawn" : "none";
    let selectedIndex = randomIndex(allText["mettaton"]["mercy"][correctKey]);

    await flavorText(allText["flavor"]["mercy"][correctKey][selectedIndex]);

    if (gameState["hasDrawing"]) {
        allCells.forEach((div) => {
            div.className = "innerCells";
            div.style.backgroundColor = "";
            div.removeAttribute("style");
        })

        gameState["hasDrawing"] = false;        
    }

    await mettTalking(allText["mettaton"]["mercy"][correctKey][selectedIndex]);
    
    clearTextField();
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
    gameState["pageNavigationOn"] = false;

    Object.keys(gameState.currentActiveActionButton).forEach(function (key) {
        gameState.currentActiveActionButton[key] = 0;
    });

    pageNavigation.replaceChildren();
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
    successfulSelect();

    if (gameState["stayStill"] === 0) {        
        mettBody.classList.add("paused");
        mettBody.style.transform = `skew(0deg)`; 

        gameState["moveBody"] = false;
        gameState["animationOn"] = false;

    } else if (gameState["stayStill"] >= 1) {
        gameState["moveArms"] = false;

        leftArm.classList.add("paused");
        rightArm.classList.add("paused");
    }
    
    twoStepConversation("motion", "stayStill");
}

const restartMoving = function () {
    if (!gameState["moveBody"]) {
        gameState["moveBody"] = true;
        mettBody.classList.remove("paused");

        if (gameState["stayStill"] > 1) {
            gameState["moveArms"] = true;

            leftArm.classList.remove("paused");
            rightArm.classList.remove("paused");

            requestAnimationFrame(handWave);
            gameState["stayStill"] = 0;
        }
        
        successfulSelect();
        restoreDefaults("motion", "animationOn", "stayStill"); 
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

    window.addEventListener("keydown", (event) => {
        if (event.code === "Digit2" || event.code === "Numpad2" ) {
            cleanUp();
            starSpace.textContent = `*`;
        }
    })
    

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
            const secondLine = async () => {
                await firstLine();
                starSpace.textContent = `*
                *`
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


const introductionSequence = async function() {
    intro.removeEventListener("playing", introductionSequence);

    cheer.play();

    const introText = async function() {
        let introFlavor = allText["flavor"]["introduction"];
        let introMett = allText["mettaton"]["introduction"];

            for (let i = 0; i < introFlavor.length; i++) {
                await flavorText(introFlavor[i]);
                await mettTalking(introMett[i]);
            }

        intro.pause();
        battleTheme.play();
    } 

    cheer.addEventListener("ended", introText);
}

intro.addEventListener("playing", introductionSequence);

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

    mettResponding(); 
    gameState[checkToIncrement]++;
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


    if (topic !== "insult" && gameState["insultTimes"] >= 1) {
        let setAmount;
        let insultIndex;

        if (gameState["insultTimes"] >= 1 && gameState["routeStages"]["insultRouteStage"] === 0) {
            setAmount = "rude";
            insultIndex = randomIndex(allText["mettaton"][topic]["wasInsulted"][setAmount]);

            await flavorText(allText["flavor"][topic]["wasInsulted"][setAmount][insultIndex]);
            await mettTalking(allText["mettaton"][topic]["wasInsulted"][setAmount][insultIndex])

        } else if (gameState["routeStages"]["insultRouteStage"] > 0 && gameState["routeStages"]["insultRouteStage"] <= 3) {
            setAmount = "moreRude";
            insultIndex = randomIndex(allText["mettaton"][topic]["wasInsulted"][setAmount]);

            await flavorText(allText["flavor"][topic]["wasInsulted"][setAmount][insultIndex]);
            await mettTalking(allText["mettaton"][topic]["wasInsulted"][setAmount][insultIndex])

        } else if (gameState["routeStages"]["insultRouteStage"] === 4) {
            setAmount = "tooMuch";
            insultIndex = randomIndex(allText["mettaton"][topic]["wasInsulted"][setAmount]);

            gameState["routeBlocked"]["rejectionSeen"] = true;
            await flavorText(allText["flavor"][topic]["wasInsulted"][setAmount][insultIndex]);
            await mettTalking(allText["mettaton"][topic]["wasInsulted"][setAmount][insultIndex]);  
        }
    } else if (gameState[checkToIncrement] < 2 || topic === "perform") {
        await flavorText(allText["flavor"][topic][correctKey][selectedIndex]);
        await mettTalking(allText["mettaton"][topic][correctKey][selectedIndex]).then(() => gameState[checkToIncrement]++);
        
    } else if (topic !== "perform") {
        let tooMuchFlavor;
        let tooMuchMett;
        let routeFunction = gameState["routeFunctions"][`${topic}`];

        if (topic === "insult" && gameState["routeFinished"]["flirt"]) {
            tooMuchFlavor = allText["flavor"][topic]["wasFlirtedWith"]["part"];
            tooMuchMett = allText["mettaton"][topic]["wasFlirtedWith"]["full"];
        } else if (topic === "insult" && !gameState["routeFinished"]["flirt"] && gameState["flirtTimes"] >= 1 ) {
            tooMuchFlavor = allText["flavor"][topic]["wasFlirtedWith"]["part"];
            tooMuchMett = allText["mettaton"][topic]["wasFlirtedWith"]["full"];
        } else {
            tooMuchFlavor = allText["flavor"][topic]["tooMuch"];
            tooMuchMett = allText["mettaton"][topic]["tooMuch"];
        }

        await routeFunction();

        if (gameState["routeStages"][`${topic}RouteStage`] <= 4 || topic === "insult") {
            await flavorText(tooMuchFlavor[gameState["routeStages"][`${topic}RouteStage`]]);
            await mettTalking(tooMuchMett[gameState["routeStages"][`${topic}RouteStage`]]);

            if (gameState["routeStages"]["insultRouteStage"] === 4) {
                gameState["routeFinished"][topic] = true;
            }
        }

        if (gameState["routeStages"]["flirtRouteStage"] === 4) {
            if (gameState["rate"]["baitAndSwitch"] > 0 || gameState["stickTimes"] >= 2 || gameState["hasDrawing"] === false || gameState["animationOn"] === false || gameState["musicOn"] === false) {
                gameState["flirtLoseEnd"] = true;
                tooMuchFlavor = allText["flavor"]["flirt"]["ending"]["lose"];
                tooMuchMett = allText["mettaton"]["flirt"]["ending"]["lose"];
                } else {
                    tooMuchFlavor = allText["flavor"]["flirt"]["ending"]["win"];
                    tooMuchMett = allText["mettaton"]["flirt"]["ending"]["win"];
                }     

                for (let i = 0; i < tooMuchFlavor.length; i++) {
                    await flavorText(tooMuchFlavor[i]);
                    await mettTalking(tooMuchMett[i]);
                }
                    
                gameState["routeFinished"][topic] = true;
        }     
        
        await routeFunction();
        gameState["routeStages"][`${topic}RouteStage`]++;
    } 

}

const step = 8;
    const smallestSize = 16;
    const slightlyBiggerSize = smallestSize + step;
    const secondBiggestSize = slightlyBiggerSize + step;
    const biggestSize = secondBiggestSize + step;

const fightMett = function() {
    clearTextField(); 
    textBox.replaceChildren(); 
    gameState["fightActive"] = true;

    let oldSize = gameState["fieldSize"];

    const fightHits = {
        one:  { fieldSize: smallestSize },
        two:  { fieldSize: slightlyBiggerSize }, 
        three: { fieldSize: secondBiggestSize }, 
        four: { fieldSize: biggestSize }, 
        five: { fieldSize: secondBiggestSize }, 
        six: { fieldSize: slightlyBiggerSize }, 
        seven: { fieldSize: smallestSize }
    }

    const mousedBox = document.createElement("div");
    mousedBox.setAttribute("id", "mousedBox");

    const fightBar = document.createElement("div");
    fightBar.setAttribute("id", "fightBar");

    let createButton = function() {
        for (let button in fightHits) {
            let newButton = document.createElement("div");
            
            if (fightHits[button].fieldSize === biggestSize) {
                newButton.classList.add("sun");
            } else if (fightHits[button].fieldSize === secondBiggestSize) {
                newButton.classList.add("mercury");
            } else if (fightHits[button].fieldSize === slightlyBiggerSize) {
                newButton.classList.add("venus");
            } else if (fightHits[button].fieldSize === smallestSize) {
                newButton.classList.add("earth");
            }

            newButton.addEventListener("click", async function() {
                let newSize = fightHits[button].fieldSize;

                sketchField.replaceChildren();
                gameState["fieldSize"] = fightHits[button].fieldSize;
                drawField();
                clearTextField();
                buttonConfirm.play();

                gameState["fightActive"] = false;
                textBox.replaceChildren();
                textBox.appendChild(starSpace);
                textBox.appendChild(textSection);

                let correctKey = newSize > oldSize ? "grow" : "shrink";
                let selectedIndex = randomIndex(allText["mettaton"]["fight"][correctKey]);

                await flavorText(allText["flavor"]["fight"][correctKey][selectedIndex]);
                await mettTalking(allText["mettaton"]["fight"][correctKey][selectedIndex]);
                gameState["currentActiveActionButton"]["fight"] = 0;
            });

            mousedBox.appendChild(newButton);
        }   
    };   

    textBox.appendChild(mousedBox);
    createButton();

    textBox.appendChild(fightBar);



    mousedBox.addEventListener("mousemove", (event) => {
        let x = event.clientX;

        let boxRect = mousedBox.getBoundingClientRect(); 
        let boxCenter = boxRect.width / 2;

        let barStyles = window.getComputedStyle(fightBar);
        let thickness = parseFloat(barStyles.getPropertyValue("width").split("px")[0]);

        if (x > boxCenter) {
            fightBar.style.left = `${x - thickness}px`
        } else {
            fightBar.style.left = `${x}px`;
        }
    });
}


const checkOut = async function() {
    checkConversation("check", "checkOutTimes");
};

let addInsult = 1;
let addFlirt = 1;
let addPerform = 1;

const flirting = function() {
    defaultConversation("flirt", "flirtTimes");

    if (gameState["insultTimes"] === 0) {
        if (gameState["flirtTimes"] === 2) {
            addFlirt += 0.5;
        }
        gameState["rate"]["mannersScore"] += addFlirt;

    } else {
        if (gameState["insultTimes"] >= 1 && gameState["routeStages"]["insultRouteStage"] === 0) {
            addFlirt -= 1;
        } else if (gameState["routeStages"]["insultRouteStage"] > 0 && gameState["routeStages"]["insultRouteStage"] <= 3) {
            addFlirt -= 2;
        } else if (gameState["routeStages"]["insultRouteStage"] >= 4) {
            addFlirt -= 5;
        }

        gameState["rate"]["mannersScore"] += addFlirt;
    }

    console.log(`flirt score is ${addFlirt} and the total score is ${gameState["rate"]["mannersScore"]}`)
    
}

const performing = function() {
    defaultConversation("perform", "performTimes");

    if (gameState["insultTimes"] === 0) {
        if (gameState["performTimes"] > 3) {
            if (gameState["performTimes"] % 2 === 0) {
                addPerform = -1;
            } else {
                addPerform = 1;
            }
        }
        
        gameState["rate"]["mannersScore"] += addPerform;

    } else {
        if (gameState["insultTimes"] >= 1 && gameState["routeStages"]["insultRouteStage"] === 0) {
            addPerform -= 1;
        } else if (gameState["routeStages"]["insultRouteStage"] > 0 && gameState["routeStages"]["insultRouteStage"] <= 3) {
            addPerform -= 2;
        } else if (gameState["routeStages"]["insultRouteStage"] >= 4) {
            addPerform -= 5;
        }

        gameState["rate"]["mannersScore"] += addPerform;
    }

    console.log(`perform score is ${addPerform} and the total score is ${gameState["rate"]["mannersScore"]}`)
    
}

const insulting = function() {
    defaultConversation("insult", "insultTimes");

    if (gameState["insultTimes"] === 2 && (gameState["flirtTimes"] === 0 || gameState["performTimes"] === 0 || gameState["stickTimes"] === 0)) {
        addInsult += 0.5;
    }  else if (gameState["flirtTimes"] > 0 || gameState["performTimes"] > 0 || gameState["stickTimes"] > 0) {
        if (gameState["routeFinished"]["flirt"]) {
            addInsult += 2;
        } else {
            addInsult += 1;
        }
    }
    
    gameState["rate"]["mannersScore"] -= addInsult;

    console.log(`insult score is ${addInsult} and the total score is ${gameState["rate"]["mannersScore"]}`)
}

function randomNumber (number, modificator) {
    let rand = (Math.random() * number) + modificator;
    return Math.round(rand * 10) / 10;
}

const ratingPhrases = async function(section, attitude, topic) {
    let flavorLine = allText["flavor"]["rate"][section][attitude][topic]
    let mettLine = allText["mettaton"]["rate"][section][attitude][topic]

    for (let i = 0; i < flavorLine.length; i++) {
        await flavorText(flavorLine[i]);
        await mettTalking(mettLine[i]);
    }
}

const mannersAppraisal = async function(topic) {
    let flavorLine = allText["flavor"]["rate"]["mannersComments"][topic];
    let mettLine = allText["mettaton"]["rate"]["mannersComments"][topic];

    for (let i = 0; i < flavorLine.length; i++) {
        await flavorText(flavorLine[i]);
        await mettTalking(mettLine[i]);
    }
}

const ratingTransition = async function(attitude) {
    let flavorLine = allText["flavor"]["rate"]["ratingIntroduction"][attitude];
    let mettLine = allText["mettaton"]["rate"]["ratingIntroduction"][attitude];

    for (let i = 0; i < flavorLine.length; i++) {
        await flavorText(flavorLine[i]);
        await mettTalking(mettLine[i]);
    }
}

let attitude;
let score;

const rating = async function() {
    successfulSelect();     
    const allCells = document.querySelectorAll(".innerCells");

    const colorsPresent = {};
    const allColored = [...allCells].filter(el => el.classList.length > 1); //this check works for all drawing tools, as all of them apply a class to their cells

    const percentage = Math.floor((allColored.length / allCells.length)*100);
    const allUniqueColors = new Set([...allColored].map(el => el.classList.item(1)));

    const allColorsApplied = [...allColored].map(el => el.classList.item(1)); 
    
    allUniqueColors.forEach(element => {
        colorsPresent[`${element}`] = allColorsApplied.filter((color) => color === element);
    })

    let allColorNames = [];
    let allColorLength = [];

    if (gameState["insultTimes"] === 0) {
            if (gameState["routeFinished"]["flirt"]) {
                attitude = "positive";
            } else {
                attitude = "neutral";
            }    
        } else {
            attitude = "negative";
        } 

    Object.keys(colorsPresent).forEach(color => {
        allColorNames.push(color);
        allColorLength.push(colorsPresent[color].length);
    })
    
    if (allColorLength.length === 0) {
        sketchField.classList.add("unclickable");
        let times = gameState["rate"]["baitAndSwitch"] === 0 ? "once" : "more";

            if (attitude === "positive") {
                gameState["rate"]["mannersScore"] += (times === "once" ? 0.5 : -0.5);
            } else if (attitude === "neutral") {
                gameState["rate"]["mannersScore"] -= (times === "once" ? 0 : 0.5);
            } else if (attitude === "negative") {
                gameState["rate"]["mannersScore"] -= (times === "once" ? 0.5 : 1);
            }

        blankIndex = randomIndex(allText["mettaton"]["rate"]["blank"][attitude][times]);

        await flavorText(allText["flavor"]["rate"]["blank"][attitude][times][blankIndex]);
        await mettTalking(allText["mettaton"]["rate"]["blank"][attitude][times][blankIndex]);

        gameState["rate"]["baitAndSwitch"] += 1;
        sketchField.classList.remove("unclickable");


        return;
    } else {
        sketchField.classList.add("unclickable");
        let mostColor = allColorLength.reduce((a, b) => { return (a < b) ? a : b})
        let mostFrequentColor = [];
        let checkIfMultiple = [];

        for (i = 0; i < allColorLength.length; i++) { //mostColor finds a color that shows up most frequently - and checkIfMultiple finds if any other colors show up as often 
            if (allColorLength[i] === mostColor) {
                checkIfMultiple.push(allColorLength[i])
            }
        }

        if (checkIfMultiple.length === 1) {
            mostFrequentColor.push(allColorNames[allColorLength.indexOf(mostColor)]);
        } else {
            for (i = 0; i < allColorLength.length; i++) {
                if (allColorLength[i] === mostColor) {
                    mostFrequentColor.push(allColorNames[i])
                }  
            } 
        }

        async function showAllFinal() {
            await ratingTransition(attitude);

            if ((gameState["fieldSize"] === biggestSize && percentage <= 1) || (percentage >= 99 && allColorLength.length === 1)) {
                await densityComments();
                await mannersComments();
                await finale();
            } else {
                await colorComments();

                if (mostFrequentColor.includes("rainbowPen") || mostFrequentColor.includes("etchPen")) {
                    await instrumentColorComments();
                }
                
                if (mostFrequentColor.includes("purple") || mostFrequentColor.includes("lightBlue")) {
                    await specialColorComments();
                }
                
                await densityComments();
                await mannersComments();
                await finale();
            }
            
        }

        const colorComments = async function () {
                if (allColorLength.length === 1) {
                    gameState["rate"]["colorScore"] = randomNumber(2, 0);
                    console.log(`just one color used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
                    await ratingPhrases("colorComments", attitude, "one");
                    console.log("color comment was shown");
                } else if (allColorLength.length >= 2 && allColorLength.length <= 3) {
                    gameState["rate"]["colorScore"] = Math.min(randomNumber(4, 0.5), 4);
                    console.log(`a few colors were used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
                    await ratingPhrases("colorComments", attitude, "few");
                } else if (allColorLength.length > 3) {
                    gameState["rate"]["colorScore"] = Math.min(randomNumber(5, 1), 5);
                    console.log(`a lot of colors used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
                    await ratingPhrases("colorComments", attitude, "many");
                }        
        }

        const instrumentColorComments = async function () {
                if (mostFrequentColor.includes("rainbowPen") && mostFrequentColor.includes("etchPen")) {
                    await ratingPhrases("colorComments", attitude, "bothInstrumentsComment");
                } else if (mostFrequentColor.includes("rainbowPen")) {
                    await ratingPhrases("colorComments", attitude, "rainbowComment");
                } else if (mostFrequentColor.includes("etchPen")) {
                    await ratingPhrases("colorComments", attitude, "pencilComment");
                } 
            
        }

        const specialColorComments = async function () {
                if (mostFrequentColor.includes("purple") && mostFrequentColor.includes("lightBlue")) {
                    gameState["rate"]["colorScore"] += 1.5;
                    await ratingPhrases("colorComments", attitude, "bothColorsComment");
                } else if (mostFrequentColor.includes("purple")) {
                    gameState["rate"]["colorScore"] += 1;
                    console.log("you sure like purple!") 
                    await ratingPhrases("colorComments", attitude, "purple");
                } else if (mostFrequentColor.includes("lightBlue")) {
                    gameState["rate"]["colorScore"] += 1;
                    console.log("light blue time");
                    await ratingPhrases("colorComments", attitude, "lightBlue");
                }
        }
        
        const densityComments = async function () {
                console.log(`we have ${allCells.length} cells in total`);
                console.log(`and ${allColored.length} of them have any coloring applied`);
                console.log(`so ${percentage} percents of all canvas is colored in now`)

                if (percentage <= 1) {
                    if (gameState["fieldSize"] === biggestSize) {
                        gameState["rate"]["densityScore"] = -2;
                        await ratingPhrases("densityComments", attitude, "dotComment");
                        
                    } else {
                        gameState["rate"]["densityScore"] = randomNumber(2, 0)
                        await ratingPhrases("densityComments", attitude, "sparse");
                    }     
                } else if (percentage >= 2 && percentage <= 10) {
                    gameState["rate"]["densityScore"] = Math.min(randomNumber(3, 0.5), 3)
                    await ratingPhrases("densityComments", attitude, "little");
                    console.log("density comment was shown");
                } else if (percentage >= 11 && percentage <= 29) {
                    gameState["rate"]["densityScore"] = Math.min(randomNumber(4, 1), 4)
                    await ratingPhrases("densityComments", attitude, "some");
                } else if (percentage >= 30 && percentage <= 79) {
                    gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 0.5), 5)
                    await ratingPhrases("densityComments", attitude, "filledOut");
                } else if (percentage >= 80 && percentage < 99) {
                    gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 1), 5)
                    await ratingPhrases("densityComments", attitude, "lots");
                } else if (percentage >= 99) {
                    //filling out the entire thing in one color will result in the lowest score
                    if (allColorLength.length === 1) {
                        gameState["rate"]["densityScore"] = -2;
                        await ratingPhrases("densityComments", attitude, "bucketComment");
                    } else {
                        gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 1.5), 5)
                        await ratingPhrases("densityComments", attitude, "full");
                    }
                }
        }
        
        const mannersComments = async function () {
                if (gameState["routeFinished"]["flirt"] && gameState["routeStages"]["insultRouteStage"] >= 1) {
                    await mannersAppraisal("ifBetrayal");
                } else if (gameState["rate"]["mannersScore"] >= 3 && gameState["insultTimes"] === 0) {
                    if (gameState["routeFinished"]["flirt"]) {
                        await mannersAppraisal("ifHighFlirty");
                    } else {
                       await mannersAppraisal("ifHighFriendly");
                    }
                } else if (gameState["insultTimes"] > 0 || gameState["rate"]["mannersScore"] <= -2) { 
                    if (gameState["rate"]["mannersScore"] < -5) {
                        await mannersAppraisal("ifVeryNegative");
                    } else {
                        await mannersAppraisal("ifNegative");
                    }
                } else {
                    await mannersAppraisal("ifNeutral");
                    console.log("manners comment was shown");
                } 
 
        }
        
        const finale = async function () {
            const finalRate = async function(startOrEnd) {
            if (gameState["routeFinished"]["flirt"] && gameState["routeStages"]["insultRouteStage"] >= 1){
                attitude = "betrayal";
            } else if (gameState["insultTimes"] === 0) {
                    if (gameState["routeFinished"]["flirt"]) {
                        attitude = "positiveFlirty";
                    } else if (gameState["rate"]["mannersScore"] >= 3) {
                        positiveFriendly = "positiveFriendly";
                    } else {
                        attitude = "neutral";
                    }    
            } else {
                attitude = "negative";
            } 

            let flavorLine;
            let mettLine;
            let mannersModifier;

            if (attitude === "positiveFlirty") {
                if (gameState["rate"]["mannersScore"] > 14.5) {
                    mannersModifier = 4;
                } else if (gameState["rate"]["mannersScore"] === 14.5) {
                    mannersModifier = 3;
                } else if (gameState["rate"]["mannersScore"] < 14.5) {
                    mannersModifier = 2;
                }
            } else if (attitude === "positiveFriendly") {
                mannersModifier = 2;
            } else if (attitude === "neutral") {
                mannersModifier = 0;
            } else if (attitude === "negative") {
                //-11 is max score before getting killed when using just the insult action
                if (gameState["rate"]["mannersScore"] <= -11) {
                    mannersModifier = -3;
                } else if (gameState["rate"]["mannersScore"] <= -6) {
                    mannersModifier = -2;
                } else {
                    mannersModifier = -1;
                }
            } else if (attitude === "betrayal") {
                if (gameState["routeFinished"]["flirt"] && gameState["routeStages"]["insultRouteStage"] <= 2) {
                    //for case when user went through a few stages of betrayal
                    mannersModifier = -3;
                } else if ((gameState["routeFinished"]["flirt"] && gameState["routeStages"]["insultRouteStage"] >= 3) || gameState["routeFinished"]["flirt"] && gameState["routeStages"]["insultRouteStage"] >= 2 && (gameState["roseTimes"] > 0 || gameState["stickTimes"] > 1 || gameState["rate"]["baitAndSwitch"] > 0)) {
                    //for case if user almost finished the betrayal route or taken other actions that result in a negative score 
                    mannersModifier = -4;
                }
            }

            //min possible score for colors + density is 0, maximum is 11.5 if 2 fave colors are used, or 10 without them (so it would be logical to define low as <= 4, middle between 5 and 7, high as anything more than 8)
            //but i think that having good manners score should make it easier to gain a high score
            //who said that Mettaton is completely unbiased as a judge? no one.
            //score "modifier" will be added, which will depend of user's manners rating

            let scoreCount = gameState["rate"]["colorScore"] + gameState["rate"]["densityScore"] + mannersModifier;
            console.log(`color score is ${gameState["rate"]["colorScore"]}, density score is ${gameState["rate"]["densityScore"]}, manners modifier is ${mannersModifier} - and the total is ${scoreCount}`);

            if (scoreCount <= 4.4) {
                score = "low"
            } else if (scoreCount >= 4.5 && scoreCount <= 7.4) {
                score = "middle"
            } else if (scoreCount >= 7.5) {
                score = "high"
            } 

            if (startOrEnd === "start") {
                flavorLine = allText["flavor"]["rate"]["finalScore"][startOrEnd][attitude];
                mettLine  = allText["mettaton"]["rate"]["finalScore"][startOrEnd][attitude];
            } else {
                flavorLine = allText["flavor"]["rate"]["finalScore"][startOrEnd][attitude][score];
                mettLine  = allText["mettaton"]["rate"]["finalScore"][startOrEnd][attitude][score];
            }
            

            for (let i = 0; i < flavorLine.length; i++) {
                await flavorText(flavorLine[i]);
                await mettTalking(mettLine[i]);
            }
        }

        const judgeAnimation = async function() {
            starSpace.classList.add("gone");

            const miniMettsContainer = document.createElement("div");
            const middlePart = document.querySelector(".middle-part");

            miniMettsContainer.classList.add("shuffle-box");

            const judgeOneContainer = document.createElement("div");
            const judgeTwoContainer = document.createElement("div");
            const judgeThreeContainer = document.createElement("div");

            judgeOneContainer.classList.add("judge-box");
            judgeTwoContainer.classList.add("judge-box");
            judgeThreeContainer.classList.add("judge-box");

            const judgeOne = document.createElement("img");
            const judgeTwo = document.createElement("img");
            const judgeThree = document.createElement("img");
            judgeOne.src = "./images/small-M-D.png";
            judgeTwo.src = "./images/small-M-D.png";
            judgeThree.src = "./images/small-M-D.png";

            const tinyLegOne = document.createElement("div");
            const tinyLegTwo = document.createElement("div");
            const tinyLegThree = document.createElement("div");
            tinyLegOne.classList.add("tiny-leg");
            tinyLegTwo.classList.add("tiny-leg");
            tinyLegThree.classList.add("tiny-leg");

            const wheelOne = document.createElement("img");
            const wheelTwo = document.createElement("img");
            const wheelThree = document.createElement("img");
            wheelOne.src = "./images/mett-sprite/mett-wheel.png";
            wheelTwo.src = "./images/mett-sprite/mett-wheel.png";
            wheelThree.src = "./images/mett-sprite/mett-wheel.png";
            wheelOne.classList.add("wheelie");
            wheelTwo.classList.add("wheelie");
            wheelThree.classList.add("wheelie");

            judgeOneContainer.appendChild(judgeOne);
            judgeOneContainer.appendChild(tinyLegOne);
            judgeOneContainer.appendChild(wheelOne);

            judgeTwoContainer.appendChild(judgeTwo);
            judgeTwoContainer.appendChild(tinyLegTwo);
            judgeTwoContainer.appendChild(wheelTwo);

            judgeThreeContainer.appendChild(judgeThree);
            judgeThreeContainer.appendChild(tinyLegThree);
            judgeThreeContainer.appendChild(wheelThree);

            miniMettsContainer.appendChild(judgeOneContainer);
            miniMettsContainer.appendChild(judgeTwoContainer);
            miniMettsContainer.appendChild(judgeThreeContainer);


            const leftBlock = document.createElement("div");
            const rightBlock = document.createElement("div");
            leftBlock.classList.add("hiding-block-left");
            rightBlock.classList.add("hiding-block-right");
            body.append(leftBlock);
            body.append(rightBlock);

            middlePart.appendChild(miniMettsContainer);
            miniMettsContainer.id = "shuffle-here"

            miniMettsContainer.addEventListener("animationend", async function(event) {
                if (event.animationName === 'motion-to') {
                    judgeOne.src = "./images/small-M-R.png";
                    judgeTwo.src = "./images/small-M-R.png";
                    judgeThree.src = "./images/small-M-R.png";

                    const rateSignOne = document.createElement("div");
                    const rateSignTwo = document.createElement("div");
                    const rateSignThree = document.createElement("div");
                    rateSignOne.classList.add("rate-sign");
                    rateSignTwo.classList.add("rate-sign");
                    rateSignThree.classList.add("rate-sign");

                    judgeOneContainer.prepend(rateSignOne);
                    judgeTwoContainer.prepend(rateSignTwo);
                    judgeThreeContainer.prepend(rateSignThree);

                    function getVariedRating (number) {
                        let theFinalRating = gameState["rate"]["colorScore"] + gameState["rate"]["densityScore"];
                        let getNumber = (Math.random() * number);
                        return Math.round((theFinalRating - getNumber) * 10) / 10;
                    }

                    rateSignOne.textContent = `${Math.min(getVariedRating(2), 10)}`;
                    rateSignTwo.textContent = `${Math.min(getVariedRating(2), 10)}`;
                    rateSignThree.textContent = `${Math.min(getVariedRating(2), 10)}`;       

                    window.addEventListener("click", function() {
                        rateSignOne.remove();
                        rateSignTwo.remove();
                        rateSignThree.remove();
                        judgeOne.src = "./images/small-M-D.png";
                        judgeTwo.src = "./images/small-M-D.png";
                        judgeThree.src = "./images/small-M-D.png";
                        
                        setTimeout(() => {
                            miniMettsContainer.id = "shuffle-away";
                        }, 500)
                    })
                    
                } else if (event.animationName === 'motion-from') {
                    leftBlock.remove();
                    rightBlock.remove();
                    miniMettsContainer.remove();
                    starSpace.classList.remove("gone");

                    await finalRate("endFinal");

                    body.replaceChildren(creditsRoll);
                    const creditsMusicFinalStandard = document.createElement("audio");
                    creditsMusicFinalStandard.src = "./music/Death By Glamour.mp3";
                    creditsMusicFinalStandard.setAttribute("loop", "loop");
                    creditsMusicFinalStandard.volume = sameVolume;

                    const creditsMusicFinalFlirty = document.createElement("audio");
                    creditsMusicFinalFlirty.src = "./music/Undertale OST： 061 - Oh! One True Love.mp3";
                    creditsMusicFinalFlirty.setAttribute("loop", "loop");
                    creditsMusicFinalFlirty.volume = sameVolume;

                    const creditsMusicFinalBad = document.createElement("audio");
                    creditsMusicFinalBad.src = './music/Undertale - Snowy (Genocide).mp3'
                    creditsMusicFinalBad.setAttribute("loop", "loop");
                    creditsMusicFinalBad.volume = sameVolume;

                    let creditsText = [];
                    let correctPart = allCredits[attitude][score];
                    creditsText.push(...correctPart["title"], "",
                        ...allCredits["forAll"], "", ...correctPart["department"], "", 
                        ...correctPart["awards"], "",  ...correctPart["sponsors"], "",  
                        ...correctPart["legal"], "", ...correctPart["closing"]
                    );

                    for (let i = 0; i < creditsText.length; i++) {
                        const newLine = document.createElement("p");
                        newLine.textContent = creditsText[i];

                        newLine.addEventListener("mouseover", (event) => {
                            event.target.classList.add("yellow-text");
                        })
                        creditsTextBox.appendChild(newLine);
                    }

                    if (attitude === "friendly" || attitude === "neutral") {
                        creditsMusicFinalStandard.play();
                    } else if (attitude === "flirty") {
                        creditsMusicFinalFlirty.play();
                    } else if (attitude === "negative" || attitude === "betrayal") {
                        creditsMusicFinalBad.play();
                    }
                    
                } 
            })
        }

            await finalRate("start");
            await judgeAnimation();
    }

        showAllFinal();
    }
}


const rose = async function() {
    successfulSelect();
    let mannerState;

    if (gameState["insultTimes"] === 0) {
        mannerState = "positive";
        gameState["rate"][mannersScore] += 0.5;
    } else {
        if (gameState["routeStages"]["insultRouteStage"] >= 2) {
            mannerState = "tooMuch";
            gameState["rate"][mannersScore] -= 5;
        } else {
            mannerState = "rude";
            gameState["rate"][mannersScore] -= 3;
        }
    }
    
    let selectedIndex = randomIndex(allText["mettaton"]["rose"][mannerState]);

    await flavorText(allText["flavor"]["rose"][mannerState][selectedIndex]);
    await mettTalking(allText["mettaton"]["rose"][mannerState][selectedIndex]); 

    if (gameState["routeStages"]["insultRouteStage"] === 4) {
        gameState["routeBlocked"]["rejectionSeen"] = true;
    }

    gameState["roseTimes"]++;
}

const stick = async function() { 
    successfulSelect();

    let correctKey = gameState["hasDrawing"] ? "drawn" : "none";
    let thrownState = gameState["stickTimes"] === 0 ? "firstThrow" : "anotherThrow";
    let selectedIndex = randomIndex(allText["mettaton"]["stick"][correctKey][thrownState]);

    await flavorText(allText["flavor"]["stick"][correctKey][thrownState][selectedIndex]);
    await mettTalking(allText["mettaton"]["stick"][correctKey][thrownState][selectedIndex]);

    if (gameState["stickTimes"] === 0) {
        gameState["rate"]["mannersScore"] += 0.5;
    } else {
        gameState["rate"]["mannersScore"] -= 0.5;
    }

    gameState["stickTimes"]++;
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

const addObjectEntry = function (objectName, variableName, assignedID) {
    objectName[variableName] = {
        id: assignedID,
        data: document.createElement("div")
    };
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

        addObjectEntry(markerBox, `${color}`, `marker-${color}`);

        const getColor = function (event) {
            currentMarkerColor = event.target.id;
            gameState["markerBoxOpen"] = false;
            return currentMarkerColor;
        }
        
        markerBox[color]["data"].addEventListener("click", getColor);

        const drawThisColor = function () {
            successfulSelect();
            checkTool("marker");

            gameState["currentDrawingColor"] = allColors[`${allColors.indexOf(`${currentMarkerColor.split("-")[1]}`)}`];
        }

        createMenuOption(markerBox, `${color}`, `${capitalizeFirstLetter(`${color}`)}Mrk`, drawThisColor);
    }

    gameState["markerBoxOpen"] = true;
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
        console.log(!gameState[checkOne]);
        console.log(comparator(checkTwo, checkedValue));

        functionOne.classList.add("gone");
    } else {
        functionOne.classList.remove("gone");
    }

    functionTwo.classList.toggle("gone", gameState[checkOne] === true)
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
            if (gameState["actionButtonClicked"] === false && !event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false && !gameState["fightActive"]) {
                handleMouseOver(event);
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false && !gameState["fightActive"]) {
                handleMouseOver(event);
            }
        })

        div.addEventListener("click", (event) => {
            pageOne = document.createElement("div");
            pageTwo = document.createElement("div");
            
            const storedNodes = {
                act: {
                    nodesToStay: {},
                    nodesToMove: {}
                },
                items: {
                    nodesToStay: {},
                    nodesToMove: {}
                },
            };

            const observerVariables = {
                act: {
                    currentPage: 1,
                    elementsToStay: [],
                    idOfStayingElements: [],
                    idOfMovedElements: [],  
                    elementsToMove: [],
                    allElements: [],
                },
                items: {
                    currentPage: 1,
                    elementsToStay: [],
                    idOfStayingElements: [],
                    idOfMovedElements: [],  
                    elementsToMove: [],
                    allElements: []
                }
            }

            const handleFirstPageClick = function(correctAction, correctObject) {
                observerVariables[correctAction]["currentPage"] = 1;
                buttonConfirm.play();
                textField.replaceChildren();
                pageOne.classList.add("invisible");
                pageTwo.classList.remove("invisible");

                for (let id of observerVariables[correctAction]["idOfStayingElements"]) { //staying
                    if (storedNodes[correctObject]["nodesToStay"][id]) {
                        textField.appendChild(storedNodes[correctObject]["nodesToStay"][id]);
                    }
                } 
            }

            const handleSecondPageClick = function(correctAction, correctObject) {
                observerVariables[correctAction]["currentPage"] = 2;
                buttonConfirm.play();
                textField.replaceChildren();
                pageOne.classList.remove("invisible");
                pageTwo.classList.add("invisible");


                for (let id of observerVariables[correctAction]["idOfMovedElements"]) { //moving
                    if (storedNodes[correctObject]["nodesToMove"][id]) {
                        textField.appendChild(storedNodes[correctObject]["nodesToMove"][id]);
                        }
                    } 
            }
            
            const actOptionCountObserver = new MutationObserver(() => {
                const actVars = observerVariables.act;

                actVars.allElements = Array.from(textField.querySelectorAll(":scope > div:not(.gone)"));

                if (actVars.currentPage === 1) {
                    actVars.elementsToStay = actVars.allElements.slice(0, Math.min(6, actVars.allElements.length));
                    actVars.idOfStayingElements = actVars.elementsToStay.map(node => node.id);

                        if (actVars.elementsToStay.length > 0) {
                            for (let i = 0; i < Math.min(6, actVars.elementsToStay.length); i++) {
                                storedNodes["act"]["nodesToStay"][actVars.elementsToStay[i].id] = actVars.elementsToStay[i];
                            }
                        }
                }
                

                if (actVars.allElements.length >= 6) {
                    if (actVars.allElements.length > 6) {
                        actVars.elementsToMove = actVars.allElements.slice(6);
                        actVars.idOfMovedElements = actVars.elementsToMove.map(node => node.id);
                    
                        for (let i = 0; i < actVars.elementsToMove.length; i++) {
                            const elementId = actVars.elementsToMove[i].id;
                    
                            storedNodes["act"]["nodesToMove"][elementId] = actVars.elementsToMove[i];
                            document.getElementById(elementId)?.remove();
                        }
                    }

                    // Check if any elements on page 2 already exist on page 1
                    const pageOneIds = new Set(actVars.elementsToStay.map(node => node.id));
                    
                    actVars.elementsToMove = actVars.elementsToMove.filter(element => {
                        if (pageOneIds.has(element.id)) {
                            delete storedNodes["act"]["nodesToMove"][element.id];
                            return false; // Remove duplicate from elementsToMove
                        }
                        return true; //if an element is not a duplicate, it will remain in elementsToMove
                    });
                
                    // Update the idOfMovedElements to reflect the filtered list
                    actVars.idOfMovedElements = actVars.elementsToMove.map(node => node.id);
                }

                if (Object.keys(storedNodes["act"]["nodesToMove"]).length >= 1 && (gameState["currentActiveActionButton"]["act"] > 0 || gameState["currentActiveActionButton"]["item"] > 0)) {
                    gameState["pageNavigationOn"] = true;

                    if (gameState["pageNavigationOn"]) {
                        pageNavigation.classList.remove("invisible");
                        if (!pageNavigation.contains(pageOne)) {
                            createPageNavigation(pageOne, "Page 1");
                            pageOne.classList.add("invisible");
                        }
                        if (!pageNavigation.contains(pageTwo)) {
                            createPageNavigation(pageTwo, "Page 2");
                        }
                    }  
                        
                        pageOne.addEventListener("click", () => handleFirstPageClick("act", "act")); //need to reference correct page object + correct object with IDs
                        pageTwo.addEventListener("click", () => handleSecondPageClick("act", "act"));
                    }
            });

            const itemsOptionCountObserver = new MutationObserver(() => {
                const actVars = observerVariables.items;
                actVars.allElements = Array.from(textField.querySelectorAll(":scope > div:not(.gone)"));
                
                if (actVars.allElements.length < 6 && !gameState["markerBoxOpen"]) {
                    pageNavigation.classList.add("invisible");
                }

                if (gameState["markerBoxOpen"] === true) {
                    if (actVars.currentPage === 1) {
                        actVars.elementsToStay = actVars.allElements.slice(0, Math.min(6, actVars.allElements.length));
                        actVars.idOfStayingElements = actVars.elementsToStay.map(node => node.id);

                            if (actVars.elementsToStay.length > 0) {
                                for (let i = 0; i < Math.min(6, actVars.elementsToStay.length); i++) {
                                    storedNodes["items"]["nodesToStay"][actVars.elementsToStay[i].id] = actVars.elementsToStay[i];
                                }
                            }
                    }

                    if (actVars.allElements.length >= 6) {
                        if (actVars.allElements.length > 6) {
                            actVars.elementsToMove = actVars.allElements.slice(6);
                            actVars.idOfMovedElements = actVars.elementsToMove.map(node => node.id);
                        
                            for (let i = 0; i < actVars.elementsToMove.length; i++) {
                                const elementId = actVars.elementsToMove[i].id;
                        
                                storedNodes["items"]["nodesToMove"][elementId] = actVars.elementsToMove[i];
                                document.getElementById(elementId)?.remove();
                            }
                        }
                        
                        const pageOneIds = new Set(actVars.elementsToStay.map(node => node.id));
                        
                        actVars.elementsToMove = actVars.elementsToMove.filter(element => {
                            if (pageOneIds.has(element.id)) {
                                delete storedNodes["items"]["nodesToMove"][element.id];
                                return false; 
                            }
                            return true; 
                        });
                        
                        actVars.idOfMovedElements = actVars.elementsToMove.map(node => node.id);
                    }

                    if (Object.keys(storedNodes["items"]["nodesToMove"]).length >= 1 && (gameState["currentActiveActionButton"]["act"] > 0 || gameState["currentActiveActionButton"]["item"] > 0)) {
                        gameState["pageNavigationOn"] = true;

                        if (gameState["pageNavigationOn"]) {
                            pageNavigation.classList.remove("invisible");
                            if (!pageNavigation.contains(pageOne)) {
                                createPageNavigation(pageOne, "Page 1");
                                pageOne.classList.add("invisible");
                            }
                            if (!pageNavigation.contains(pageTwo)) {
                                createPageNavigation(pageTwo, "Page 2");
                            }
                        }  
                        
                            pageOne.addEventListener("click", () => handleFirstPageClick("items", "items")); 
                            pageTwo.addEventListener("click", () => handleSecondPageClick("items", "items"));
                        }
                } 
            });

            let currentButton = event.currentTarget.getAttribute("id").split("-")[0];
            if (gameState["actionButtonClicked"] === false && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false && !gameState["fightActive"]) {

                buttonConfirm.play();

                hideYellowHeart(event);
                gameState["actionButtonClicked"] = true;
                gameState["currentActiveActionButton"][`${currentButton}`]+=1;
                    
                textField.textContent = "";
                starSpace.classList.add("invisible");
                    
                if (currentButton === "fight") {
                    const fightMenu = {
                        fightOption: {
                            id: "fight",
                            data: document.createElement("div")}
                    }

                    createMenuOption(fightMenu, "fightOption", "Mettaton", fightMett);
                        
                } else if (currentButton === "act") {    
                    itemsOptionCountObserver.disconnect();  
                    actOptionCountObserver.observe(textField, { childList: true, subtree: false });  

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
                            id: "restartWiggle",
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

                    if (gameState["routeBlocked"]["rejectionSeen"]) {
                        menuOptions["flirt"]["data"].classList.add("gone");
                        menuOptions["perform"]["data"].classList.add("gone");
                    }

                    for (let key in menuActions) {
                        menuActions[key]();
                    }

                        hideAndShow(menuOptions.stopMusic.data, menuOptions.restartMusic.data, "musicOn", sameVolume, 0, (a, b) => a === b);
                        hideAndShow(menuOptions.stopWiggle.data, menuOptions.restartWiggle.data, "animationOn", gameState.stayStill, 2, (a, b) => a === b);


                    if (gameState["hasDrawing"]) {
                            menuOptions["rate"]["data"].classList.add("yellow-text");
                            menuOptions["rate"]["data"].classList.remove("gone");
                    } else if (!gameState["hasDrawing"]) {
                        menuOptions["rate"]["data"].classList.add("gone");
                    }   

                    if (gameState["routeFinished"]["flirt"]) {
                            menuOptions["flirt"]["data"].classList.add("gone");
                        }

                } else if (currentButton === "item") {
                    actOptionCountObserver.disconnect();
                    itemsOptionCountObserver.observe(textField, { childList: true, subtree: false });  

                    const availableItems = {
                        rose: {
                            id: "rose",
                            data: document.createElement("div")},
                        stickThrow: {
                            id: "stick",
                            data: document.createElement("div")},
                        markerBox: {
                            id: "markerBox",
                            data: document.createElement("div")},
                        etchPen: {
                            id: "etchPen",
                            data: document.createElement("div")},
                        rainbowPen: {
                            id: "rainbowPen",
                            data: document.createElement("div")}
                    }

                    createMenuOption(availableItems, "rose", "Rose", rose);
                    createMenuOption(availableItems, "stickThrow", "Stick", stick);
                    createMenuOption(availableItems, "markerBox", "MarkBox", allMarkers);
                    createMenuOption(availableItems, "etchPen", "EtchPen", etchPencil);
                    createMenuOption(availableItems, "rainbowPen", "RnbwPen", rainbowPencil)      

                    if (gameState["routeFinished"]["flirt"] && !gameState[rejectionSeen]) {
                        availableItems["rose"]["data"].classList.remove("gone");
                    } else {
                        availableItems["rose"]["data"].classList.add("gone");   
                    }

                } else if (currentButton === "mercy") {
                    const spareMenu = {
                        spareOption: {
                            id: "spare",
                            data: document.createElement("div")}
                    }

                    createMenuOption(spareMenu, "spareOption", "Mettaton", clearSketchField);
                }   
                    
            } else if (gameState["actionButtonClicked"] === true && gameState["currentActiveActionButton"][`${currentButton}`] >= 1 && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                clearTextField();
                buttonConfirm.play();
                gameState["currentActiveActionButton"][`${currentButton}`] = 0;
                gameState["pageNavigationOn"] = false;
                gameState["markerBoxOpen"] = false;
                gameState["fightActive"] = false;
                pageNavigation.replaceChildren();
            }
        })
            

        div.addEventListener("mouseout", (event) => {
            if (gameState["actionButtonClicked"] === false) {
                removeButtonFocus();
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight")) {
                hideYellowHeart(event);
            }
        });
});
})
