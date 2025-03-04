let heartBeatDone = false;
let heartBreakPlayed = false;


window.addEventListener('load', () => {
    const startText = document.createElement("div");
    startText.textContent = "[PRESS 2 OR ENTER TO START]";
    startText.classList.add("start-text");
    load.appendChild(startText);
    
    const beatingMotion = setInterval(function() {
        const heart = document.querySelector("#heart");
        const heartBreak = document.querySelector("#battle-start-heartbreak");
        const load = document.querySelector("#load");
        heartBreak.volume = 0.15
 
            heart.classList.toggle("beat");
            
            window.addEventListener("keydown", (event) => {
                if (event.code === "Digit2" || event.code === "Enter") {
                    start = true;

                    if (start) {
                        heartBeatDone = true;
                        clearInterval(beatingMotion);
                        heartBreak.play();
                        heartBreakPlayed = true;

                        if (heartBreakPlayed) {
                            setTimeout(() => {
                                startText.remove();
                                load.remove();
                            }, 1000);
                        }
                    }
                }
            }) 
}, 180)
});