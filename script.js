const sketchField = document.querySelector('#mett-a-sketch');
const leftArm = document.querySelector('#left-arm');
const rightArm = document.querySelector('#right-arm');
const battleStart = document.querySelector("#battle-start");
const allColors = ["red", "blue"];

const mettBody = document.querySelector(".top-part");

//seems to get laggy at 64
let fieldSize = 16;
let currentDrawingColor = allColors[0];
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

    mettBody.addEventListener("mousedown", (event) => {
        if (event.target.classList.contains("innerCells")) {
            if (event.button === 0) {
                isDrawing = true;
                event.target.classList.add(currentDrawingColor);
            } else if (event.button === 2) {
                isErasing = true;
                event.target.classList.remove(...allColors);
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
        } else if (isErasing) {
                event.target.classList.remove(...allColors);
            }
        })

battleStart.addEventListener("ended", function() {
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
    
    let jazzHands = setInterval(function () {
        //may be best to tie this as an event listener for domload event?
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
    , 40) //45 is optimal speed
    let waved = true;
    
    let handWave = setInterval(function() {
        if (waved) {
            rightArm.src = "./images/mett-sprite/arm-right-1.png";
            waved = !waved;
        } else {
            rightArm.src = "./images/mett-sprite/arm-right-2.png";
            waved = true;
        }
    
        
    }, 280)
    
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
    
    let sideSwing = setInterval(function() {
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
    }, 40)
})

const actionButtons = document.querySelectorAll(".action-button");
const textField = document.querySelector("#text-field");
const starSpace = document.querySelector("#star-space");
const buttonSelect = document.querySelector("#button-select");
buttonSelect.volume = sameVolume * 2;

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

let buttonClicked = false;

battleStart.addEventListener("ended", function() {
    const allCells = document.querySelectorAll(".innerCells");

    actionButtons.forEach((div) => {
    
        div.addEventListener("mouseover", (event) => {
            if (!event.currentTarget.classList.contains("button-highlight")) {
                playerButtonSelection(event);
                buttonSelect.play();
            }

            event.currentTarget.addEventListener("click", (event) => {
                buttonClicked = true;
                let currentButton = event.currentTarget.getAttribute("id").split("-")[0];
                
                if (currentButton === "fight") {
                    console.log("fight?");
                    
                } else if (currentButton === "act") {
                    
                } else if (currentButton === "item") {

                } else if (currentButton === "mercy") {
                    starSpace.classList.toggle("invisible");
                    allCells.forEach((div) => {
                        div.classList.remove(...allColors);
                    })
                }

                buttonClicked = false;
            })

            })

        div.addEventListener("mouseout", (event) => {
            if (!buttonClicked) {
                event.currentTarget.classList.remove("button-highlight");
            
                let currentSymbol = event.currentTarget.getAttribute("id").split("-")[0];
                event.currentTarget.firstElementChild.innerHTML = symbols[currentSymbol];
            } 
        });
});
})
//on button functionality - attack to change the density of the drawing field, mercy to clear it. act for for disabling music\stopping animation (wiggle, waving, arm moving) and item to change the drawing colors