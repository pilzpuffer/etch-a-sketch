const beatAmount = 10;
let beatCount = 0;
let heartBeatDone = false;

window.addEventListener('DOMContentLoaded', () => {

    const beatingMotion = setInterval(function() {
        const heart = document.querySelector("#heart")
            
            heart.classList.toggle("beat");
            beatCount++;

            if (beatAmount === beatCount) {
                heartBeatDone = true;
                clearInterval(beatingMotion);
                setTimeout(() => {
                    document.querySelector("#load").classList.toggle("invisible");
                }, 1000);
            }
    }, 180)

    
});