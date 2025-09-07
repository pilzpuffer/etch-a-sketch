let beat = false;
let sameVolume = 0.2;

window.addEventListener('load', () => {
    const load = document.querySelector("#load");
    const allTitleText = document.querySelector("#allTitleText");
    const heart = document.querySelector("#heart");
    const fightSymbol = document.querySelector("#fight-symbol");
    const unRatedEnd = document.querySelector("#premature-end-noised");
    const creditsRoll = document.querySelector("#premature-end");
    
    const heartBreak = document.querySelector("#battle-start-heartbreak");
    const battleStart = document.querySelector("#battle-start");
    const battleTheme = document.querySelector("#battle-theme");
    const intro = document.querySelector("#intro");
    
    battleTheme.volume = sameVolume - 0.1;
    heartBreak.volume = sameVolume;
    battleStart.volume = sameVolume;
    intro.volume = sameVolume;


    unRatedEnd.remove();
    creditsRoll.remove();

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


    const titleTextLeft = document.querySelector("#titleTextLeft");
        const titleLeftTextBack = document.createElement("div");
        titleLeftTextBack.textContent = "Etch-A-Sketch:";
        titleLeftTextBack.classList.add("title-back");
        titleTextLeft.appendChild(titleLeftTextBack);

        const titleLeftTextCenter = document.createElement("div");
        titleLeftTextCenter.textContent = "Etch-A-Sketch:";
        titleLeftTextCenter.classList.add("title-center");
        titleLeftTextBack.appendChild(titleLeftTextCenter);

        const titleLeftTextFront = document.createElement("div");
        titleLeftTextFront.textContent = "Etch-A-Sketch:";
        titleLeftTextFront.classList.add("title-front");
        titleLeftTextBack.appendChild(titleLeftTextFront);

    const titleTextRight = document.querySelector("#titleTextRight");
        const titleRightTextBack = document.createElement("div");
        titleRightTextBack.textContent = "FabulOus ShOw!";
        titleRightTextBack.classList.add("title-back");
        titleTextRight.appendChild(titleRightTextBack);

        const titleRightTextCenter = document.createElement("div");
        titleRightTextCenter.textContent = "FabulOus ShOw!";
        titleRightTextCenter.classList.add("title-center");
        titleRightTextBack.appendChild(titleRightTextCenter);

        const titleRightTextFront = document.createElement("div");
        titleRightTextFront.textContent = "FabulOus ShOw!";
        titleRightTextFront.classList.add("title-front");
        titleRightTextBack.appendChild(titleRightTextFront);

    
    allTitleText.appendChild(titleTextLeft);
    allTitleText.appendChild(titleTextRight);

    const heartHolder = document.createElement("div");
    heartHolder.classList.add("heart-hold")
    heartHolder.appendChild(heart);
    load.appendChild(heartHolder)
    
    const startText = document.createElement("div");
    startText.classList.add("start-text");

    const lineOne = document.createElement("div");
    lineOne.textContent = "[PRESS ENTER TO START]";

    const lineTwo = document.createElement("div");
    lineTwo.textContent = "[PRESS 2 TO SKIP TUTORIAL AND START]";

    startText.appendChild(lineOne);
    startText.appendChild(lineTwo);

    load.appendChild(startText);
    
        const beatingMotion = setInterval(function() {
            heart.classList.toggle("beat");
        }, 230);


        const handleKeyDown = function(event) {
            if (event.code === "Digit2" || event.code === "Numpad2" || event.code === "Enter") {

                window.removeEventListener("keydown", handleKeyDown);
                heart.classList.remove("beat");
                startText.classList.add("invisible");
                clearInterval(beatingMotion);
                heartBreak.play();
                heartBreak.addEventListener("ended", function() {
                                
                const heartStart = heart.getBoundingClientRect();
                const heartEnd = fightSymbol.getBoundingClientRect();

                const deltaX = heartEnd.left - heartStart.left;
                const deltaY = heartEnd.top - heartStart.top;

                    heart.style.position = "absolute";
                    battleStart.play();

                    async function heartBeat() {
                        
                        if (beat) {
                            heart.src = "./images/red-soul-hidden.png";
                            beat = !beat;
                        } else {
                            heart.src = "./images/red-soul-sprite.png";
                            beat = true;
                            }

                        await new Promise((resolve) => setTimeout(resolve, 120));
                        requestAnimationFrame(heartBeat);
                    }

                    requestAnimationFrame(heartBeat);

                    heart.animate(
                        [
                            { transform: "translate(0, 0)" },
                            { transform: `translate(${deltaX}px, ${deltaY}px)`}
                        ],
                            {duration: 800, easing: "ease-in-out"}

                        ).onfinish = () => {
                            heart.remove();
                            battleStart.addEventListener("ended", function() {
                                setTimeout(() => { 
                                    if (event.code === "Digit2" || event.code === "Numpad2") {
                                        battleTheme.play();
                                    } else if (event.code === "Enter") {
                                        intro.play();
                                    }
                                    marginAdjust();
                                    load.remove();
                                }, 600);   
                            })

                        };
                    });
                }
            }
        
            window.addEventListener("keydown", handleKeyDown);
        });