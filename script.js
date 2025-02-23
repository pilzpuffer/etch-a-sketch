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
        result = Math.round((properNumber + amount)*10) / 10
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
            upperLimit: 1.8,
            get lowerLimit() {
                return (this.upperLimit + 1);
            }
        },

        rightY: {
            upperLimit: -4,
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
, 45)
let waved = true;

let handWave = setInterval(function() {
    if (waved) {
        rightArm.src = "./images/mett-sprite/arm-right-1.png";
        waved = !waved;
    } else {
        rightArm.src = "./images/mett-sprite/arm-right-2.png";
        waved = true;
    }

    
}, 315)

//if changed, left and right skews should be the same number - but the right skew should always be negative
const bodyWiggle = {
    left: {
        skew: 5,
        get rotate() {
            return -this.skew;
        }
    },

    right: {
        skew: -5,
        get rotate() {
            return -this.skew;
        }
    }
}

let wentLeft = false;

const mettBody = document.querySelector(".top-part");

let swingTimes = 10;

function swingAmountArms (direction, swingTimes) {
        let result = Math.round(((arms[direction]["upperLimit"] - arms[direction]["lowerLimit"])/swingTimes)*10)/10;
        return result;
}

//left and skew are not selected for a particular reason - since the values in that object are basically the same, it doesn't really make a difference
function swingAmountBody (swingTimes) {
    let result = Math.round(((bodyWiggle["left"]["skew"])/swingTimes)*100)/100; 
    return Math.abs(result);
}

function swingArms(direction, leftSwing, rightSwing) {
    document.documentElement.style.setProperty('--left-hand-position-X', adjustValue('--left-hand-position-X', direction, leftSwing));
    document.documentElement.style.setProperty('--right-hand-position-X', adjustValue('--right-hand-position-X', direction, rightSwing));
}

function swingBody(direction, swingTimes) {
    document.documentElement.style.setProperty('--rotate-value', adjustValue('--rotate-value', direction, swingTimes));
    document.documentElement.style.setProperty('--skew-value', adjustValue('--skew-value', direction, -swingTimes));
}

//  .correct-arm = transform: scale(var(--arm-scaling)); 
//   should be raised up to 1.344 at the highest point of the swinging motion 
//  --arm-scaling: 1;


let sideSwing = setInterval(function() {
    let leftPositionX = getNumber('--left-hand-position-X');
    let rightPositionX = getNumber('--right-hand-position-X');
    let rotation = getNumber('--rotate-value');
    let skew = getNumber('--skew-value');
    
    
    let leftSwing = swingAmountArms("leftX", swingTimes);
    let rightSwing = swingAmountArms("rightX", swingTimes);
    let bodySwing = swingAmountBody(swingTimes);

   
    if (!mettBody.classList.contains("body-wiggle") && !leftArm.classList.contains("correct-arm") && !rightArm.classList.contains("correct-arm")) {
        mettBody.classList.add("body-wiggle");
        leftArm.classList.add("correct-arm") ;
        rightArm.classList.add("correct-arm") ;
    }

    if (leftPositionX <= arms["leftX"]["upperLimit"] && rightPositionX >= arms["rightX"]["upperLimit"] && !wentLeft && rotation >= bodyWiggle["left"]["rotate"] && skew <= bodyWiggle["left"]["skew"]) {
        if (leftPositionX === arms["leftX"]["upperLimit"] && rightPositionX === arms["rightX"]["upperLimit"] && rotation === bodyWiggle["left"]["rotate"] && skew === bodyWiggle["left"]["skew"]) {
            wentLeft = true;
        }
        swingBody("reduce", bodySwing);
        swingArms("increase", leftSwing, rightSwing);
        
        console.log(`we moved left! left is ${leftPositionX}`);
        console.log(`we moved left!right is ${rightPositionX}`);
        console.log(`we moved left!rotation is ${rotation}`);
        console.log(`we moved left!skew is ${skew}`);
        
        //maybe we need to add a "normalizing" center step where arms should get to their lower limit, and rotate/skew to 0
        
    } else if (leftPositionX >= arms["leftX"]["upperLimit"] && rightPositionX <= arms["rightX"]["upperLimit"] && wentLeft && rotation <= bodyWiggle["right"]["rotate"] && skew >= bodyWiggle["right"]["skew"]) {
        if (leftPositionX === arms["leftX"]["upperLimit"] && rightPositionX === arms["rightX"]["upperLimit"] && rotation === bodyWiggle["right"]["rotate"] && skew === bodyWiggle["right"]["skew"]) {
            wentLeft = false;
        }
        swingBody("increase", bodySwing);
        swingArms("reduce", leftSwing, rightSwing);

        console.log(`we moved right! left is ${leftPositionX}`);
        console.log(`we moved right! right is ${rightPositionX}`);
        console.log(`we moved right! rotation is ${rotation}`);
        console.log(`we moved right! skew is ${skew}`);
    }
}, 100)

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode