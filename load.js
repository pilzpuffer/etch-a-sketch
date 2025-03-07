let beat = false;
let sameVolume = 0.2;

window.addEventListener('load', () => {
    const load = document.querySelector("#load");
    const heart = document.querySelector("#heart");
    const fightSymbol = document.querySelector("#fight-symbol");
    
    const heartBreak = document.querySelector("#battle-start-heartbreak");
    const battleStart = document.querySelector("#battle-start");
    const battleTheme = document.querySelector("#battle-theme");
    
    heartBreak.volume = sameVolume;
    battleStart.volume = sameVolume;
    battleTheme.volume = sameVolume - 0.1; //sadly, battle crusher theme is as loud as it is great
    
    const startText = document.createElement("div");
    startText.textContent = "[PRESS 2 OR ENTER TO START]";
    startText.classList.add("start-text");
    load.appendChild(startText);
    
        const beatingMotion = setInterval(function() {
            heart.classList.toggle("beat");
        }, 230);


        const handleKeyDown = function(event) {
            if (event.code === "Digit2" || event.code === "Enter") {

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

                    setInterval(() => {
                        if (beat) {
                            heart.src = "./images/red-soul-hidden.png";
                            beat = !beat;
                        } else {
                            heart.src = "./images/red-soul-sprite.png";
                            beat = true;
                        }
                    }, 120);

                    heart.animate(
                        [
                            { transform: "translate(0, 0)" },
                            { transform: `translate(${deltaX}px, ${deltaY}px)`}
                        ],
                            {duration: 800, easing: "ease-in-out"}

                        ).onfinish = () => {
                            heart.remove();
                            battleStart.addEventListener("ended", function() {

                                actionButtons[0].classList.add("button-highlight");
                                actionButtons[0].firstElementChild.innerHTML = `<img id="yellow-heart" src="./images/yellow-soul-sprite.png">`;

                                setTimeout(() => {
                                    battleTheme.play();
                                    load.remove();
                                }, 800);   
                            })

                        };
                    });
                }
            }
        
            window.addEventListener("keydown", handleKeyDown);
        });