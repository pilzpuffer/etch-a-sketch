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

                for (let i = 0; i < creditsText.length; i++) {
                    const newLine = document.createElement("p");
                    newLine.textContent = creditsText[i];

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
        baitAndSwitch: 0,
        pencilComment: false,
        rainbowComment: false,
        dotComment: false,
        bucketComment: false
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

const flavorIntro = [
    ["Spotlights dance on Mettaton’s gleaming frame.", "As he rolls forward, his screen flickers with a slow, theatrical pulse."],
    ["Mettaton's voice drops theatrically."],
    ["The crowd murmurs, leaning in."],
    ["He pauses, letting the silence stretch - just enough."],
    ["He lifts an arm, as he softly gestures to his screen-face."],
    ["His screen flickers, a playful glitch of pink and blue."],
    ["He leans in, voice dropping into a near-whisper, the crowd leaning with him."],
    ["He rolls back, the hush replaced with eager shuffling, the glow of stage lights sharp on chrome."],
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
    ["Now, let’s see what your Soul can create under the gaze of the lights, the audience...", "and ME — your host, your judge, your star!"]
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
    ["You raise a single finger, demanding absolute poise.", "The music hesitates, as if holding its breath with you."],
    ["You wave a hand sharply.", "Somewhere backstage, the orchestra falters, unsure whether to continue without their star's rhythm."],
    ["You pinch your fingers together, indicating 'just a little less'.", "Mettaton responds by locking into a pose with dramatic flair."]
];

const flavorStopTwice = [
    ["You make a T shape with your hands.", "Offstage, a spotlight snaps onto Mettaton’s frozen form."],
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
    ["Finally! My full glory returns!", "Let’s not waste a second — there’s beauty to unleash and legends to create, darling!"]
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
    ["Back for another check? Marvelous!", "Appreciate your own work, darling!", "Such bold choices... truly."],
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
    ['Ah! A tragic curse! But fear not, dear — I accept verbal tributes, too!'],
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
    ["Darling, please! You’re scandalizing the sponsors!", "If they faint, it’ll be your fault - you've captured my likeness a little too well.", "Every angle, every tiny flourish — it’s like you know me better than my own mirror.", "But tell me, sweetheart...", "...can you really handle what you’ve dreamed up?"],
    ["Tonight... you’ve bared your heart beneath these blinding lights.", "Not with perfect notes or polished lines... but with something far rarer: sincerity.", "I’ve had suitors — brilliant, breathtaking, but ultimately forgettable.", "But you? You've lingered - too dazzling to forget, too foolish to let go.", "And persistence like that? Darling, it’s almost criminal.", "So this is it - the final rose. My last flourish, and perhaps... my first real offer.", "Will you take your place in the spotlight beside me? Or vanish into the wings, one breath short of forever?"]
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
    ["He strikes a pose, one hand over his 'chest', the other extended upwards as though reaching for the stars."]
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
    ["With a flick of his wrist, Mettaton pulls a hidden lever.", "You drop - theatrically - into a pit filled with oversized pink heart pillows marked “FRIEND ZONE”."],
    ["Mettaton peers over the edge, striking a sorrowful pose, one hand extended downward."],
    ["He tosses down a glittery envelope."],
    ["He spins back to the crowd", "Music explodes into an over-the-top, bittersweet finale. Confetti rains. Cameras zoom."]
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
    ["Because even when hearts break—", "-THE SHOW MUST GO ON!"]
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
    ["You’re testing my patience, aren’t you?", "Keep going, and I’ll have no sympathy left for you.", "Rudeness isn’t wit, darling — it’s a death sentence."],
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
    ["You seemed so sincere when you called me dazzling.", "Tell me — were you just rehearsing that, too?"],
    ["So that’s it. I was a tool, a toy for your amusement.", "How poetic. The star, burned out by their own spotlight"],
    ["You had the spotlight, darling. You had me.", "And now?", "Another word - and you’ll see what happens when the lights go out for you."],
    ["You made a fool of me.", "You turned affection into ammunition.", "So let me return the favor.", "You wanted a brutal show?", "Then die knowing... you were the climax."]
];

//alt phrases for flirt/perform actions when insults were used before

//flirt
const flavorFlirtInsult = [
    ["You toss a desperate compliment into the fraying air between you."],
    ["You try to spin your insults into charm.", "It’s not very convincing."],
    ["You attempt a flirtatious smile", "It feels brittle."],
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
    ["Save your sweet nothings — I heard your true voice already."]
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
    ["You send your stick flying again.", "Mettaton flinches this time — but not from fear."],
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

//phrases for rose

const flavorRoseRude = [
    ["You hold out the rose like a shield — but your eyes falter before his glow."],
    ["You raise it gently, but the warmth behind the gesture is gone.", "Something’s broken - and you know it."],
    ["You offer the rose again, but there’s tension in your grip.", "What once bloomed now feels like an apology."],
    ["You try to steady your hand, holding the rose like a memory — but the petals feel heavier than before."],
    ["You lift it high, as if to rewind time - but Mettaton’s gaze stays fixed on what you've become."],
    ["You flash the rose between acts of cruelty, pretending it still means something."],
    ["You bring it forward, but not even the lights believe the gesture anymore."]
];

const flavorRoseMaxInsult = [
    ["You shove the rose forward like an excuse, hoping it’ll say what your actions can’t."],
    ["You try to wave it off - the insults, the betrayal.", "It only makes the silence louder."],
    ["You hold it out, but your words still linger in the air, sharp and unforgivable."],
    ["You clutch the rose like a mask — but it can’t hide what you’ve already done."],
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
    ["Pathetic. Flowers wilt, trust dies — and you, darling, are withering faster than both."],
    ["A wilted rose for a withered heart. How fitting."],
    ["Touching. Tragic. Tiresome.", "I hope you enjoy your finale, because there won’t be a curtain call."],
    ["You still have that thing? Darling, that’s not nostalgia — that’s mockery."]
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
const flavorColorPositiveIntro = [
    ["Mettaton tilts his frame just so, and a wave of color data scrolls across his screen in diagnostic bursts."],
    ["His fingers click together, snapping a hidden compartment open: a lens-shaped scanner beams briefly at his own screen — your canvas — before projecting a color wheel into the air."],
    ["The audience leans in. A camera-bot lowers to capture the glow from a better angle."]
]

const flavorRatePositiveColorOne = [
    ["The color wheel flickers... then freezes on a single hue. The room stills."],
    ["Mettaton’s screen shifts to match, radiating that lone color across the hall."],
    ["He rotates slowly, one arm behind his frame like a painter in critique mode."],
    ["He turns just slightly, voice curling with dry amusement."]
    
];

const mettRatePositiveColorOne = [
    ["Ah. Singular. Decisive. A statement."],
    ["You could’ve played with the whole rainbow... and you said no."],
    ["Minimalism has its charm, darling - but you weren’t minimalist."],
    ["You were cautious. This stage deserves bolder choices.", "Let’s just say... I was hoping for a bit more drama from my co-star."]
];

const flavorRatePositiveColorFew = [
    ["The wheel spins, showcasing your tasteful color combination.", "Applause flickers across the crowd like ripples in a champagne glass."],
    ["Mettaton rotates slowly, displaying each selected hue like a gallery exhibit."],
    ["He glides slightly forward, screen glowing."]
];

const mettRatePositiveColorFew = [
    ["Mmm, a curated palette! Chic, stylish... a hint of mystery."],
    ["You didn’t throw paint at the wall - you composed, darling. As if each hue had its own solo."],
    ["Not loud. Not desperate. Just intentional. And oh, how that lingers."]
];

const flavorRatePositiveColorMany = [
    ["The scanner goes wild. Colors cascade wildly across Mettaton’s screen, a riot of saturation that nearly outshines the stage lights."],
    ["Glitter cannons hiss, the crowd surges with a single, collective gasp."],
    ["His arms sweep upward, screen pulsing in swirling hues."],
    ["He spins once, letting the chaos of hues reflect across the stage."]
]

const mettRatePositiveColorMany = [
    [""],
    ["What a spectacle, darling!"],
    ["You didn’t just use color - you let it loose."],
    ["A masterpiece of mayhem, and the spotlight loved every shade."]
];

const flavorRatePositiveColorBlue = [
    ["Soft synth chords play under the audience’s collective sigh.", "Mettaton’s screen adopts a cool, blue tint."],
    ["He tilts slightly, the glow casting soft halos along his frame."],
    ["He glances toward the audience, then back to you."]
];

const mettRatePositiveColorBlue = [
    ["So... serene."],
    ["Blue like silence. Like confidence that doesn’t need applause."],
    ["A lesser performer might fade in those tones. But you? You glowed."]
];

const flavorRatePositiveColorPurple = [
    ["Mettaton’s screen darkens, then flares with purple undertones from your drawing."],
    ["He presses two fingertips together, as if savoring fine wine."],
    ["A dramatic pause. His voice drops just a notch."]
];

const mettRatePositiveColorPurple = [
    ["...Ah. Royal."],
    ["You covered me in the color of charisma, elegance... and subtle danger"],
    ["Frankly, it’s flattering. You’ve got taste, darling — and you know where to use it."]
];

const flavorRatePositiveColorBoth = [
    ["A slow ripple of deep blue and violet sweeps across Mettaton’s screen, cool as midnight, sharp as spotlight glass. Somewhere backstage, a mic catches a whispered, '...oh, that’s good.'"],
    ["His screen tilts, letting the colors catch the light like silk."],
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
    ["And darling, it was louder than fireworks."]
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

const flavorRateNeutralColorOne = [
    ["The color scanner beeps once, landing on your lone hue."],
    ["Mettaton’s screen matches your single color, holding steady."],
    ["He angles his frame, the light catching just so."]
];

const mettRateNeutralColorOne = [
    ["One color. By choice, I suppose."],
    ["It’s... direct. Can’t fault you for that."],
    ["Simple. Uncomplicated. Let’s move on."]
];

const flavorRateNeutralColorFew = [
    ["The scanner cycles through a few hues before settling."],
    ["Mettaton’s screen shifts softly, matching your modest palette."],
    ["The glow is subdued, but it fills the stage regardless."]
];

const mettRateNeutralColorFew = [
    ["A few colors. A hint of range, at least."],
    ["You kept it tidy. Respectable."],
    ["Not too loud, not too dull. Fair enough."]
];

const flavorRateNeutralColorMany = [
    ["The scanner hums as colors dance across Mettaton’s screen."],
    ["A swirl of shades lights up the stage, but not enough to blind."],
    ["Mettaton’s screen ripples, briefly saturated with your choices."]
];

const mettRateNeutralColorMany = [
    ["A splash of colors. Busy, but not reckless."],
    ["You brought variety. Can’t argue with that."],
    ["Plenty of shades. Let’s see if you made them count."]
];

const flavorRateNeutralColorBlue = [
    ["A cool blue tint pulses across Mettaton’s screen."],
    ["The scanner’s glow calms as blue takes focus."],
    ["A hush ripples across the stage lights."]
];

const mettRateNeutralColorBlue = [
    ["Blue. Calm. Measured."],
    ["A steady choice. Easy on the eyes."],
    ["Cool, but let’s see if it carries weight."]
];

const flavorRateNeutralColorPurple = [
    ["A violet sheen flickers briefly across Mettaton’s display."],
    ["Purple lingers in the scanner light, subtle yet noticeable."],
    ["The stage lighting dims to let the hue breathe."]
];

const mettRateNeutralColorPurple = [
    ["Purple. A touch of drama."],
    ["Hints of ambition in that shade."],
    ["Not loud, but it has presence."]
];

const flavorRateNeutralColorBoth = [
    ["Blue and purple filter across Mettaton’s screen, calm but unmistakable."],
    ["The scanner flickers between the two hues, steady and deliberate."],
    ["A layered glow settles over the stage, cool and composed."]
];

const mettRateNeutralColorBoth = [
    ["Blue and purple. A dependable choice."],
    ["Balanced, with just enough depth to stand out."],
    ["Calm colors, but they hold their own under these lights."]
];

const flavorRateNeutralInstrumentPencil = [
    [""],
    [""],
    [""]
];

const mettRateNeutralInstrumentPencil = [
    [""],
    [""],
    [""]
];

const flavorRateNeutralInstrumentRainbow = [
    [""],
    [""],
    [""]
];

const mettRateNeutralInstrumentRainbow = [
    [""],
    [""],
    [""]
];

const flavorRateNeutralInstrumentBoth = [
    [""],
    [""],
    [""]
];

const mettRateNeutralInstrumentBoth = [
    [""],
    [""],
    [""]
];

//negative

const flavorRateNegativeColorOne = [
    ["You present your one-color masterpiece with a flourish.", "Mettaton doesn’t spare it a glance, idly inspecting his gloved hand as if checking for a chip in his manicure."],
    ["Mettaton glances at your piece, tilts his frame just so, the closest a robot can get to an offended eyebrow raise."]
];

const mettRateNegativeColorOne = [
    ["One color, one yawn. Next!"],
    ["Did you drop your whole palette on the way here?"]
];

const flavorRateNegativeColorFew = [
    ["You throw a smug glance at your drawing. Mettaton’s screen dims briefly, exasperated."],
    ["Mettaton angles away from the flicker of your limited palette, glow flickering impatiently."]
];

const mettRateNegativeColorFew = [
    ["So that’s it? Did you run out of inspiration and crayons?"],
    ["A few colors can work wonders, darling. This... wasn’t one of those times."]
];

const flavorRateNegativeColorMany = [
    ["Mettaton’s frame shifts just enough to feel like a theatrical wince. The chaos of your colors flickers across his screen like confetti in a storm."],
    ["Mettaton scans the chaotic swirls of color, then dramatically turns his back."]
];

const mettRateNegativeColorMany = [
    ["Too many colors, darling. You’ve painted like a toddler at a birthday party."],
    ["A lavish use of color, but wasted on a piece so... uninspired."],
];

const flavorRateNegativeColorBlue = [
    [""],
    [""],
    [""]
];

const mettRateNegativeColorBlue = [
    [""],
    [""],
    [""]
];

const flavorRateNegativeColorPurple = [
    [""],
    [""],
    [""]
];

const mettRateNegativeColorPurple = [
    [""],
    [""],
    [""]
];

const flavorRateNegativeColorBoth = [
    [""],
    [""],
    [""]
];

const mettRateNegativeColorBoth = [
    [""],
    [""],
    [""]
];

const flavorRateNegativeInstrumentPencil = [
    [""],
    [""],
    [""]
];

const mettRateNegativeInstrumentPencil = [
    [""],
    [""],
    [""]
];

const flavorRateNegativeInstrumentRainbow = [
    [""],
    [""],
    [""]
];

const mettRateNegativeInstrumentRainbow = [
    [""],
    [""],
    [""]
];

const flavorRateNegativeInstrumentBoth = [
    [""],
    [""],
    [""]
];

const mettRateNegativeInstrumentBoth = [
    [""],
    [""],
    [""]
];


//now it's time for density

//positive
const flavorRatePositiveBucket = [
    [""]
];

const flavorRatePositiveDot = [
    [""]
];

const flavorRatePositiveSparse = [
    [""]
];

const flavorRatePositiveLittle = [
    [""]
];

const flavorRatePositiveSome = [
    [""]
];

const flavorRatePositiveFilledOut = [
    [""]
];

const flavorRatePositiveLots = [
    [""]
];

const flavorRatePositiveFull = [
    [""]
];

const mettRatePositiveBucket = [
    [""]
];

const mettRatePositiveDot = [
    [""]
];

const mettRatePositiveSparse = [
    [""]
];

const mettRatePositiveLittle = [
    [""]
];

const mettRatePositiveSome = [
    [""]
];

const mettRatePositiveFilledOut = [
    [""]
];

const mettRatePositiveLots = [
    [""]
];

const mettRatePositiveFull = [
    [""]
];

//neutral
const flavorRateNeutralBucket = [
    [""]
];

const flavorRateNeutralDot = [
    [""]
];

const flavorRateNeutralSparse = [
    [""]
];

const flavorRateNeutralLittle = [
    [""]
];

const flavorRateNeutralSome = [
    [""]
];

const flavorRateNeutralFilledOut = [
    [""]
];

const flavorRateNeutralLots = [
    [""]
];

const flavorRateNeutralFull = [
    [""]
];

const mettRateNeutralBucket = [
    [""]
];

const mettRateNeutralDot = [
    [""]
];

const mettRateNeutralSparse = [
    [""]
];

const mettRateNeutralLittle = [
    [""]
];

const mettRateNeutralSome = [
    [""]
];

const mettRateNeutralFilledOut = [
    [""]
];

const mettRateNeutralLots = [
    [""]
];

const mettRateNeutralFull = [
    [""]
];

//negative

const flavorRateNegativeBucket = [
    [""]
];

const flavorRateNegativeDot = [
    [""]
];

const flavorRateNegativeSparse = [
    [""]
];

const flavorRateNegativeLittle = [
    [""]
];

const flavorRateNegativeSome = [
    [""]
];

const flavorRateNegativeFilledOut = [
    [""]
];

const flavorRateNegativeLots = [
    [""]
];

const flavorRateNegativeFull = [
    [""]
];

const mettRateNegativeBucket = [
    [""]
];

const mettRateNegativeDot = [
    [""]
];

const mettRateNegativeSparse = [
    [""]
];

const mettRateNegativeLittle = [
    [""]
];

const mettRateNegativeSome = [
    [""]
];

const mettRateNegativeFilledOut = [
    [""]
];

const mettRateNegativeLots = [
    [""]
];

const mettRateNegativeFull = [
    [""]
];

//manners 

const flavorRateMannersHighFlirty = [
    [""]
];

const flavorRateMannersHighFriendly = [
    [""]
];

const flavorRateMannersNeutral = [
    [""]
];

const flavorRateMannersnegative = [
    [""]
];

const flavorRateMannersVeryNegative = [
    [""]
];

const flavorRateMannersBetrayal = [
    [""]
];

const mettRateMannersHighFlirty = [
    [""]
];

const mettRateMannersHighFriendly = [
    [""]
];

const mettRateMannersNeutral = [
    [""]
];

const mettRateMannersnegative = [
    [""]
];

const mettRateMannersVeryNegative = [
    [""]
];

const mettRateMannersBetrayal = [
    [""]
];


//final!!


//start
const flavorRateFinalStartPositiveFlirty = [
    [""]
];

const flavorRateFinalStartPositiveFriendly = [
    [""]
];

const flavorRateFinalStartNeutral = [
    [""]
];

const flavorRateFinalStartNegative = [
    ["A sharp feedback sound rings out from one of the overhead mics. Someone in the control booth coughs."],
    ["Mettaton pauses, then glides forward - slow and measured.", "His screen dims slightly, casting you in flickering grayscale."],
    ["The house lights flicker, intentionally or not.", "You hear someone backstage whisper: 'Did they seriously insult him mid-show?'"],
    ["He lifts one arm, clicks a remote. A screen behind him replays some past interaction - clipped, petty, graceless. The crowd groans."],
    ["The light on you hardens into a lone follow-spot."],
    ["One final pause. Then his screen dims entirely for a single beat. The audience gasps."]
];
const flavorRateFinalStartFullBetrayal = [
    [""]
];

const mettRateFinalStartPositiveFlirty = [
    [""]
];

const mettRateFinalStartPositiveFriendly = [
    [""]
];

const mettRateFinalStartNeutral = [
    [""]
];

const mettRateFinalStartNegative = [
    [""],
    ["There’s an art to presence. A rhythm to the dance between audience and performer."],
    ["And you... you misstepped, darling.", "Again. And again. And again."],
    ["You had the chemistry, the rhythm, the spark...", "...And then you tripped over your own lines."],
    ["What a shame. You had the stage... but you didn’t respect it."],
    [""]

];

const mettRateFinalStartFullBetrayal = [
    [""]
];
//end

//positive flirty
const flavorRateFinalEndPositiveFlirtyLow = [
    [""]
];

const flavorRateFinalEndPositiveFlirtyLowMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFlirtyMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFlirtyHighMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFlirtyHigh = [
    [""]
];

const flavorRateFinalEndPositiveFlirtyVeryHigh = [
    [""]
];

const mettRateFinalEndPositiveFlirtyLow = [
    [""]
];

const mettRateFinalEndPositiveFlirtyLowMiddle = [
    [""]
];

const mettRateFinalEndPositiveFlirtyMiddle = [
    [""]
];

const mettRateFinalEndPositiveFlirtyHighMiddle = [
    [""]
];

const mettRateFinalEndPositiveFlirtyHigh = [
    [""]
];

const mettRateFinalEndPositiveFlirtyVeryHigh = [
    [""]
];

// positive friendly
const flavorRateFinalEndPositiveFriendlyLow = [
    [""]
];

const flavorRateFinalEndPositiveFriendlyLowMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFriendlyMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFriendlyHighMiddle = [
    [""]
];

const flavorRateFinalEndPositiveFriendlyHigh = [
    [""]
];

const flavorRateFinalEndPositiveFriendlyVeryHigh = [
    [""]
];

const mettRateFinalEndPositiveFriendlyLow = [
    [""]
];

const mettRateFinalEndPositiveFriendlyLowMiddle = [
    [""]
];

const mettRateFinalEndPositiveFriendlyMiddle = [
    [""]
];

const mettRateFinalEndPositiveFriendlyHighMiddle = [
    [""]
];

const mettRateFinalEndPositiveFriendlyHigh = [
    [""]
];

const mettRateFinalEndPositiveFriendlyVeryHigh = [
    [""]
];


//neutral
const flavorRateFinalEndNeutralLow = [
    [""]
];

const flavorRateFinalEndNeutralLowMiddle = [
    [""]
];

const flavorRateFinalEndNeutralMiddle = [
    [""]
];

const flavorRateFinalEndNeutralHighMiddle = [
    [""]
];

const flavorRateFinalEndNeutralHigh = [
    [""]
];

const flavorRateFinalEndNeutralVeryHigh = [
    [""]
];

const mettRateFinalEndNeutralLow = [
    [""]
];

const mettRateFinalEndNeutralLowMiddle = [
    [""]
];

const mettRateFinalEndNeutralMiddle = [
    [""]
];

const mettRateFinalEndNeutralHighMiddle = [
    [""]
];

const mettRateFinalEndNeutralHigh = [
    [""]
];

const mettRateFinalEndNeutralVeryHigh = [
    [""]
];

//negative

const flavorRateFinalEndNegativeLow = [
    [""]
];

const flavorRateFinalEndNegativeLowMiddle = [
    [""]
];

const flavorRateFinalEndNegativeMiddle = [
    [""]
];

const flavorRateFinalEndNegativeHighMiddle = [
    [""]
];

const flavorRateFinalEndNegativeHigh = [
    [""]
];

const flavorRateFinalEndNegativeVeryHigh = [
    [""]
];

const mettRateFinalEndNegativeLow = [
    [""]
];

const mettRateFinalEndNegativeLowMiddle = [
    [""]
];

const mettRateFinalEndNegativeMiddle = [
    [""]
];

const mettRateFinalEndNegativeHighMiddle = [
    [""]
];

const mettRateFinalEndNegativeHigh = [
    [""]
];

const mettRateFinalEndNegativeVeryHigh = [
    [""]
];

//fullBetrayal

const flavorRateFinalEndBetrayalLow = [
    [""]
];

const flavorRateFinalEndBetrayalLowMiddle = [
    [""]
];

const flavorRateFinalEndBetrayalMiddle = [
    [""]
];

const flavorRateFinalEndBetrayalHighMiddle = [
    [""]
];

const flavorRateFinalEndBetrayalHigh = [
    [""]
];

const flavorRateFinalEndBetrayalVeryHigh = [
    [""]
];

const mettRateFinalEndBetrayalLow = [
    [""]
];

const mettRateFinalEndBetrayalLowMiddle = [
    [""]
];

const mettRateFinalEndBetrayalMiddle = [
    [""]
];

const mettRateFinalEndBetrayalHighMiddle = [
    [""]
];

const mettRateFinalEndBetrayalHigh = [
    [""]
];

const mettRateFinalEndBetrayalVeryHigh = [
    [""]
];


const creditsText = [
    "METTATON'S ART SHOW/ROMANCE SPECIAL: END CREDITS",
    "",
    "Production Team",
    "Directed by: Mettaton",
    "Camera Operator: Aaron",
    "Sound Effects & Music: Napstablook",
    "Lighting Technician: Jerry",
    "Robotics Specialist: Alphys",
    "Makeup Artist: Alphys",
    "Cue/Applause Sign Holder: Mettabot Model CLAP-TRAP",
    "On-Set Catering: Muffet",
    "",
    "Art Department",
    "Head Illustrator: So Sorry",
    "Mettaton Face Model Reference: Mettaton (of course)",
    "Face Canvas Maintenance Crew: Woshua",
    "",
    "Romantic Operations Department",
    "Romantic Tension Consultant: Burgerpants (unpaid intern)",
    "Breakup Scene Consultants: Bratty & Catty",
    "Post-Rejection Recovery Counselor: Papyrus",
    "Heartbreak Stunt Double: A cardboard box with lipstick",
    "Romantic Lighting Designer: Tsunderplane",
    "",
    "Stage & Set Crew",
    "Stage Pyrotechnics & Fog Machine Operator: Vulkin",
    "Glitter Effects Supervisor: Tsunderplane",
    "Rose Deployment Technician: Lesser Dog",
    "",
    "Award Segment",
    "Best Improvised Monologue While Rejecting a Suitor (Gracefully): Mettaton",
    "Best Performance by a Leading Role in a Romance Drama: Mettaton",
    "",
    "This show was made possible by:",
    "GlamGal Grease – For when your gears need to glow.",
    "RoboRomance Magazine – Now 99% Mettaton!",
    "Hotland Heartbreakers Hotline – “Now 30% less judgment!”",
    "The Official Mettaton Body Pillow – “For lonely nights... or all of them.”",
    "Dramatone Eyeliner – Cries with you.",
    "",
    "No monsters were emotionally harmed during the making of this episode.",
    "Any resemblance to your love life is purely coincidental... probably.",
    "Viewer discretion advised: contains emotional turbulence.",
    "Use sparkle responsibly.",
    "",
    "Tune in next time for more drama, more sparkle, and maybe, just maybe... more love." 
]


allText = {
    flavor: {
        rate: {
            blank: {
                positive: { once: flavorBlankPositiveOnce, more: flavorBlankPositiveMore },
                neutral: { once: flavorBlankNeutralOnce, more: flavorBlankNeutralMore },
                negative: { once: flavorBlankNegativeOnce, more: flavorBlankGegativeMore },
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
                ifNegative: flavorRateMannersnegative,
                ifVeryNegative: flavorRateMannersVeryNegative,
                ifBetrayal: flavorRateMannersBetrayal
            },

            finalScore: {
                start: {
                    positiveFlirty: flavorRateFinalStartPositiveFlirty,
                    positiveFriendly: flavorRateFinalStartPositiveFriendly,
                    neutral: flavorRateFinalStartNeutral,
                    negative: flavorRateFinalStartNegative,
                    fullBetrayal: flavorRateFinalStartFullBetrayal
                },
                endFinal: {
                    positiveFlirty: {
                        low: flavorRateFinalEndPositiveFlirtyLow,
                        lowMiddle: flavorRateFinalEndPositiveFlirtyLowMiddle,
                        middle: flavorRateFinalEndPositiveFlirtyMiddle,
                        highMiddle: flavorRateFinalEndPositiveFlirtyHighMiddle,
                        high: flavorRateFinalEndPositiveFlirtyHigh,
                        veryHigh: flavorRateFinalEndPositiveFlirtyVeryHigh
                    },
                    positiveFriendly: {
                        low: flavorRateFinalEndPositiveFriendlyLow,
                        lowMiddle: flavorRateFinalEndPositiveFriendlyLowMiddle,
                        middle: flavorRateFinalEndPositiveFriendlyMiddle,
                        highMiddle: flavorRateFinalEndPositiveFriendlyHighMiddle,
                        high: flavorRateFinalEndPositiveFriendlyHigh,
                        veryHigh: flavorRateFinalEndPositiveFriendlyVeryHigh
                    },
                    neutral: {
                        low: flavorRateFinalEndNeutralLow,
                        lowMiddle: flavorRateFinalEndNeutralLowMiddle,
                        middle: flavorRateFinalEndNeutralMiddle,
                        highMiddle: flavorRateFinalEndNeutralHighMiddle,
                        high: flavorRateFinalEndNeutralHigh,
                        veryHigh: flavorRateFinalEndNeutralVeryHigh
                    },
                    negative: {
                        low: flavorRateFinalEndNegativeLow,
                        lowMiddle: flavorRateFinalEndNegativeLowMiddle,
                        middle: flavorRateFinalEndNegativeMiddle,
                        highMiddle: flavorRateFinalEndNegativeHighMiddle,
                        high: flavorRateFinalEndNegativeHigh,
                        veryHigh: flavorRateFinalEndNegativeVeryHigh
                    },
                    fullBetrayal: {
                        low: flavorRateFinalEndBetrayalLow,
                        lowMiddle: flavorRateFinalEndBetrayalLowMiddle,
                        middle: flavorRateFinalEndBetrayalMiddle,
                        highMiddle: flavorRateFinalEndBetrayalHighMiddle,
                        high: flavorRateFinalEndBetrayalHigh,
                        veryHigh: flavorRateFinalEndBetrayalVeryHigh
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

            //"neutral" path of other phrases will apply for highfriendly/neutral/negative paths. 
            // explicitly negative phrases would apply only for the lest 2 options

            mannersComments: {
                ifHighFlirty: mettRateMannersHighFlirty,
                ifHighFriendly: mettRateMannersHighFriendly,
                ifNeutral: mettRateMannersNeutral,
                ifNegative: mettRateMannersnegative,
                ifVeryNegative: mettRateMannersVeryNegative,
                ifBetrayal: mettRateMannersBetrayal
            },

            finalScore: {
                start: {
                    positiveFlirty: mettRateFinalStartPositiveFlirty,
                    positiveFriendly: mettRateFinalStartPositiveFriendly,
                    neutral: mettRateFinalStartNeutral,
                    negative: mettRateFinalStartNegative,
                    fullBetrayal: mettRateFinalStartFullBetrayal
                },
                endFinal: {
                    positiveFlirty: {
                        low: mettRateFinalEndPositiveFlirtyLow,
                        lowMiddle: mettRateFinalEndPositiveFlirtyLowMiddle,
                        middle: mettRateFinalEndPositiveFlirtyMiddle,
                        highMiddle: mettRateFinalEndPositiveFlirtyHighMiddle,
                        high: mettRateFinalEndPositiveFlirtyHigh,
                        veryHigh: mettRateFinalEndPositiveFlirtyVeryHigh
                    },
                    positiveFriendly: {
                        low: mettRateFinalEndPositiveFriendlyLow,
                        lowMiddle: mettRateFinalEndPositiveFriendlyLowMiddle,
                        middle: mettRateFinalEndPositiveFriendlyMiddle,
                        highMiddle: mettRateFinalEndPositiveFriendlyHighMiddle,
                        high: mettRateFinalEndPositiveFriendlyHigh,
                        veryHigh: mettRateFinalEndPositiveFriendlyVeryHigh
                    },
                    neutral: {
                        low: mettRateFinalEndNeutralLow,
                        lowMiddle: mettRateFinalEndNeutralLowMiddle,
                        middle: mettRateFinalEndNeutralMiddle,
                        highMiddle: mettRateFinalEndNeutralHighMiddle,
                        high: mettRateFinalEndNeutralHigh,
                        veryHigh: mettRateFinalEndNeutralVeryHigh
                    },
                    negative: {
                        low: mettRateFinalEndNegativeLow,
                        lowMiddle: mettRateFinalEndNegativeLowMiddle,
                        middle: mettRateFinalEndNegativeMiddle,
                        highMiddle: mettRateFinalEndNegativeHighMiddle,
                        high: mettRateFinalEndNegativeHigh,
                        veryHigh: mettRateFinalEndNegativeVeryHigh
                    },
                    fullBetrayal: {
                        low: mettRateFinalEndBetrayalLow,
                        lowMiddle: mettRateFinalEndBetrayalLowMiddle,
                        middle: mettRateFinalEndBetrayalMiddle,
                        highMiddle: mettRateFinalEndBetrayalHighMiddle,
                        high: mettRateFinalEndBetrayalHigh,
                        veryHigh: mettRateFinalEndBetrayalVeryHigh
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
    pageNavigation.classList.add("invisible");

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
    gameState["stayStill"]++;

    if (gameState["stayStill"] === 1) {        
        mettBody.classList.add("paused");
        mettBody.style.transform = `skew(0deg)`; 

        gameState["moveBody"] = false;
        gameState["animationOn"] = false;

    } else if (gameState["stayStill"] > 1) {
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

        if (topic === "insult" && gameState["flirtTimes"] >= 1) {
            if (gameState["routeFinished"]["flirt"]) {
                tooMuchFlavor = allText["flavor"][topic]["wasFlirtedWith"]["flavorFullBetrayal"];
                tooMuchMett = allText["mettaton"][topic]["wasFlirtedWith"]["mettFullBetrayal"];
            } else {
                tooMuchFlavor = allText["flavor"][topic]["wasFlirtedWith"]["flavorBetrayal"];
                tooMuchMett = allText["mettaton"][topic]["wasFlirtedWith"]["mettBetrayal"];
            }
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
            if (gameState["rate"]["baitAndSwitch"] > 0 || gameState["stickTimes"] > 2 || gameState["hasDrawing"] === false || gameState["animationOn"] === false || gameState["musicOn"] === false) {
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
    starSpace.classList.add("gone")
    gameState["fightActive"] = true;

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

            newButton.addEventListener("click", function() {
                sketchField.replaceChildren();
                gameState["fieldSize"] = fightHits[button].fieldSize;
                drawField();
                clearTextField();
                buttonConfirm.play(); //need some text for this
                gameState["fightActive"] = false;
                starSpace.classList.remove("gone");
            });

            mousedBox.appendChild(newButton);
        }   
    };   

    textField.appendChild(mousedBox);
    createButton();

    textField.appendChild(fightBar);

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

const finalRateCount = function () {
    //first, colors will be appraised
    //then - drawing density
    //then - player's demeanor
    //mett will note on each of those things, then miniMetts will show up with scores, and then - he will give out the final score
    //there will be an ending sequence and game will be over
    console.log(`the colorScore is ${gameState["rate"]["colorScore"]}, the densityScore is ${gameState["rate"]["densityScore"]} and manners score is ${gameState["rate"]["mannersScore"]}`)
    console.log(`your total score is ${Math.round((gameState["rate"]["colorScore"] + gameState["rate"]["densityScore"] + gameState["rate"]["mannersScore"]) * 10) / 10}`);

    // max possible score for manners is 18, minimum is -15, though it potentially can get much lower if player keeps throwing a stick, but that deducts just 0.5 points at a time, so that's not too much (and will get boring quickly)
    // max score for density is 5, minimum is -2. max score for colors is 5 and min is 0
}

const rating = async function() {
    successfulSelect();
    //ask mettaton to rate the drawing (need some function to check the colors of cells, determine which color is most prevalent)
    //rate will be the act function that will complete this game
    //MTT will comment on the most used color, maybe there can be additional comments depending on the most prevalent color and on the amount of colored-in squares
    //and then the drawing will be rated randomly. yeah. maybe I can add some extra checks, like, if the drawing contains more than a few colors, the amount of squares colored in + numbers can be deducted based on user's behavior
    //like, insults would deduct points, but flirts will increase them
    //once rated, it will be possible to fully spare MTT (his name will become yellow) - and the game will end!!!! -> I'll need to make something similiar to the death screen, but with "winning" sounds and other text
    //if the rating will be lower than 7, MTT will initially threaten the player that he will kill them, but at the end will just tell that there's the show is on an ad break as there were not enough viewers - so he will have to save killing the player
    //for the grand finale
    //if the rating is somewhere around 1-3, MTT will be appalled at the player's lack of artistry - and tell them that they're too pathetic/not inspiring enough to be killed. 
    //rainbow-colored drawing would automatically grant 5 points and the rest will depend on player's actions and the power of random
    // there should be a separate check if too many points were deducted due to the player's bad behavior, then he will calculate their drawing score separately, but note that the player is an awful person 
     
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
    

    Object.keys(colorsPresent).forEach(color => {
        allColorNames.push(color);
        allColorLength.push(colorsPresent[color].length);
    })
    
    if (allColorLength.length === 0) {
        let times = gameState["rate"]["baitAndSwitch"] === 0 ? "once" : "more";
        let attitude;
         
        if (gameState["insultTimes"] === 0) {
            if (gameState["routeFinished"]["flirt"]) {
                attitude = "positive";
                gameState["rate"]["mannersScore"] += (times === "once" ? 0.5 : -0.5);
            } else {
                attitude = "neutral";
                gameState["rate"]["mannersScore"] -= (times === "once" ? 0 : 0.5);
            }    
        } else {
            attitude = "negative";
            gameState["rate"]["mannersScore"] -= (times === "once" ? 0.5 : 1);
        }

        blankIndex = randomIndex(allText["mettaton"]["rate"]["blank"][attitude][times]);

        await flavorText(allText["flavor"]["rate"]["blank"][attitude][times][blankIndex]);
        await mettTalking(allText["mettaton"]["rate"]["blank"][attitude][times][blankIndex]);

        gameState["rate"]["baitAndSwitch"] += 1;

        return;
    } else {
        let mostColor = allColorLength.reduce((a, b) => { return (a < b) ? a : b})
        let mostFrequentColor = [];
        let checkIfMultiple = [];

        if (allColorLength.length === 1) {
            gameState["rate"]["colorScore"] = randomNumber(2, 0);
            console.log(`just one color used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
        } else if (allColorLength.length >= 2 && allColorLength.length <= 3) {
            gameState["rate"]["colorScore"] = Math.min(randomNumber(4, 0.5), 4);
            console.log(`a few colors were used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
        } else if (allColorLength.length > 3) {
            gameState["rate"]["colorScore"] = Math.min(randomNumber(5, 1), 5);
            console.log(`a lot of colors used, the total score for colors is ${gameState["rate"]["colorScore"]}`);
        }

        for (i = 0; i < allColorLength.length; i++) { //mostColor finds a color that shows up most frequently - and checkIfMultiple finds if any other colors show up as often 
            if (allColorLength[i] === mostColor) {
                checkIfMultiple.push(allColorLength[i])
            }
        }

        if (checkIfMultiple.length === 1) {
            mostFrequentColor.push(allColorNames[allColorLength.indexOf(mostColor)]);
            // a colorScore can result in a max of 5, density - 5 (can be negative), behavior - 5 (but can get into negatives), maximum achievable score will still be 10 (even though the possible sum of those elements CAN be more, the score will still be capped at 10 - this overhang is needed to make it so that achieveing a high score will be more probable)
        } else {
            for (i = 0; i < allColorLength.length; i++) {
                if (allColorLength[i] === mostColor) {
                    mostFrequentColor.push(allColorNames[i])
                }  
            } 
        }

        if (mostFrequentColor.includes("rainbowPen") && mostFrequentColor.includes("etchPen")) {
            gameState["rate"]["rainbowComment"] = true;
            gameState["rate"]["pencilComment"] = true;
        } else if (mostFrequentColor.includes("rainbowPen")) {
            gameState["rate"]["rainbowComment"] = true;
        } else if (mostFrequentColor.includes("etchPen")) {
            gameState["rate"]["pencilComment"] = true;
        } 


        if (mostFrequentColor.includes("purple")) {
            gameState["rate"]["colorScore"] += 1;
            console.log("you sure like purple!") //mett's favorite color, need to include an extra phrase for that
        } else if (mostFrequentColor.includes("lightBlue")) {
            gameState["rate"]["colorScore"] += 1;
            console.log("light blue time") //same here, both options will increase the total score
        }  

        console.log(`we have ${allCells.length} cells in total`);
        console.log(`and ${allColored.length} of them have any coloring applied`);
        console.log(`so ${percentage} percents of all canvas is colored in now`)
        if (percentage <= 1) {
        
            if (gameState["fieldSize"] === biggestSize) {
                gameState["rate"]["densityScore"] = -2;
                gameState["rate"]["dotComment"] = true;
            } else {
                gameState["rate"]["densityScore"] = randomNumber(2, 0)
            }     
        } else if (percentage >= 2 && percentage <= 10) {
            gameState["rate"]["densityScore"] = Math.min(randomNumber(3, 0.5), 3)
        } else if (percentage >= 11 && percentage <= 29) {
            gameState["rate"]["densityScore"] = Math.min(randomNumber(4, 1), 4)
        } else if (percentage >= 30 && percentage <= 79) {
            gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 0.5), 5)
        } else if (percentage >= 80 && percentage < 99) {
            gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 1), 5)
        } else if (percentage >= 99) {
            //filling out the entire thing in one color will result in the lowest score
            if (allColorLength.length === 1) {
                gameState["rate"]["densityScore"] = -2;
                gameState["rate"]["bucketComment"] = true;
            } else {
                gameState["rate"]["densityScore"] = Math.min(randomNumber(5, 1.5), 5)
            }
        }

        finalRateCount();
    }
        }

const rose = async function() {
    successfulSelect();
    let mannerState;

    if (gameState["insultTimes"] === 0) {
        mannerState = "positive";
        gameState["rate"][mannersScore] += 0.5;
    } else {
        if (gameState["routeStages"]["insultRouteStage"] === 4) {
            mannerState = "tooMuch";
            gameState["rate"][mannersScore] -= 5;
        } else {
            mannerState = "rude";
            gameState["rate"][mannersScore] -= 3;
        }
    }
    
    let selectedIndex = randomIndex(allText["mettaton"]["rose"][mannerState]);

    const flavorLine = async () => {
        await flavorText(allText["flavor"]["rose"][mannerState][selectedIndex]);
    }

    const mettResponding = async() => {
        await flavorLine();
        await mettTalking(allText["mettaton"]["rose"][mannerState][selectedIndex]);
    }

    mettResponding();

    if (gameState["routeStages"]["insultRouteStage"] === 4) {
        gameState["routeBlocked"]["rejectionSeen"] = true;
    }
}

const stick = async function() { 
    successfulSelect();

    let correctKey = gameState["hasDrawing"] ? "drawn" : "none";
    let thrownState = gameState["stickTimes"] === 0 ? "firstThrow" : "anotherThrow";
    let selectedIndex = randomIndex(allText["mettaton"]["stick"][correctKey][thrownState]);

    const flavorLine = async () => {
        await flavorText(allText["flavor"]["stick"][correctKey][thrownState][selectedIndex]);
    }

    const mettResponding = async() => {
        await flavorLine();
        await mettTalking(allText["mettaton"]["stick"][correctKey][thrownState][selectedIndex]);
    }

    mettResponding();

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
            if (gameState["actionButtonClicked"] === false && !event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
                handleMouseOver(event);
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight") && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {
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
            if (gameState["actionButtonClicked"] === false && gameState["flavorTextShown"] === false && gameState["mettTextShown"] === false) {

                buttonConfirm.play();

                hideYellowHeart(event);
                gameState["actionButtonClicked"] = true;
                gameState["currentActiveActionButton"][`${currentButton}`]+=1;
                    
                textField.textContent = "";
                starSpace.classList.add("invisible");
                    
                if (currentButton === "fight") {
                        const figthMenu = {
                            fightOption: {
                                id: "fight",
                                data: document.createElement("div")}
                        }
    
                        if (gameState["currentActiveActionButton"][`${currentButton}`] <= 1) {
                            createMenuOption(figthMenu, "fightOption", "Mettaton", fightMett);
                        } else {
                            clearTextField();
                            gameState["currentActiveActionButton"][`${currentButton}`] = 0;
                        }
                        
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
                event.currentTarget.classList.remove("button-highlight");
            
                let currentSymbol = event.currentTarget.getAttribute("id").split("-")[0];
                event.currentTarget.firstElementChild.innerHTML = gameState["symbols"][currentSymbol];
            } else if (gameState["actionButtonClicked"] === true && event.currentTarget.classList.contains("button-highlight")) {
                hideYellowHeart(event);
            }
        });
});
})
