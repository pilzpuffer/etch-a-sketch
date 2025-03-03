const sketchField = document.querySelector('#mett-a-sketch');
const leftArm = document.querySelector('#left-arm');
const rightArm = document.querySelector('#right-arm');

let fieldSize = 16;

for (let i = 0; i < fieldSize; i++) {
    let newRow = document.createElement('div');
    newRow.classList.add("newRow");
    
    sketchField.appendChild(newRow);

        for(let j = 0; j < fieldSize; j++) {
            let innerCells = document.createElement('div');
            innerCells.classList.add("innerCells");
            newRow.appendChild(innerCells);
        }

    function drawing (event) {
        event.target.closest(".innerCells")?.classList.add("selected");
    }

    sketchField.addEventListener("mousedown", (event) => {
        sketchField.addEventListener("mouseover", drawing);
    })

    window.addEventListener("mouseup", (event) => {
        sketchField.removeEventListener("mouseover", drawing);
    })
}

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
            upperLimit: 7,
            get lowerLimit() {
                return (this.upperLimit + 1);
            }
        },

        rightY: {
            upperLimit: -2.5,
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

    if (leftPositionY >= arms["leftY"]["upperLimit"] && rightPositionY >= arms["rightY"]["upperLimit"] && !wentUp) {
        if (leftPositionY === arms["leftY"]["upperLimit"] && rightPositionY === arms["rightY"]["upperLimit"]) {
            wentUp = true;
        }
        moveArms("reduce", moveSpeed);
    } else if (leftPositionY <= arms["leftY"]["lowerLimit"] && rightPositionY <= arms["rightY"]["lowerLimit"] && wentUp){
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

const mettBody = document.querySelector(".top-part");

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

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode