let beat = false;
let sameVolume = 0.2;

window.addEventListener('load', () => {
    const load = document.querySelector("#load");
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
    const titleTextBack = document.createElement("div");
    titleTextBack.textContent = "Etch-A-Sketch: FabulOus ShOw!";
    titleTextBack.classList.add("title-back");
    load.appendChild(titleTextBack);

    const titleTextCenter = document.createElement("div");
    titleTextCenter.textContent = "Etch-A-Sketch: FabulOus ShOw!";
    titleTextCenter.classList.add("title-center");
    load.appendChild(titleTextCenter);

    const titleTextFront = document.createElement("div");
    titleTextFront.textContent = "Etch-A-Sketch: FabulOus ShOw!";
    titleTextFront.classList.add("title-front");
    load.appendChild(titleTextFront);
    
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
            if (event.code === "Digit2" || event.code === "Numpad2" ||event.code === "Enter") {

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
                                    load.remove();
                                }, 600);   
                            })

                        };
                    });
                }
            }
        
            window.addEventListener("keydown", handleKeyDown);
        });