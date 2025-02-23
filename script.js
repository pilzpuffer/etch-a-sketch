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
            lowerLimit: 2.8
        },

        rightY: {
            upperLimit: -4,
            lowerLimit: -3
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
        console.log(`left is ${leftPositionY}`);
        console.log(`right is ${rightPositionY}`);
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

const bodyWiggle = {
    left: {
        rotate: -5,
        skew: 5
    },

    right: {
        rotate: 5,
        skew: -5
    }
}

let wentLeft = false;

const mettBody = document.querySelector(".top-part");

function swingAmountArms (direction, swingTimes) {
        result = Math.round(((arms[direction]["upperLimit"]- arms[direction]["lowerLimit"])/swingTimes)*10)/10;
        return result;
}

/* 
ok, so to make this easier to get:
when going left, rotate goes from 0 to -5. when going right - it goes to -5 
skew goes from 0 to 5 when going left, and then goes to -5 on the right
we'll need to use adjustValue to achieve this effect
*/
function swingAmountBody () {
    result = Math.round(((bodyWiggle[transform]["upperLimit"]- arms[direction]["lowerLimit"])/swingTimes)*100)/100;
    return result;
}

function swingArms(direction, leftSwing, rightSwing) {
    document.documentElement.style.setProperty('--left-hand-position-X', adjustValue('--left-hand-position-X', direction, leftSwing));
    document.documentElement.style.setProperty('--right-hand-position-X', adjustValue('--right-hand-position-X', direction, rightSwing));
}

//direction - left or right (increase or decrease in the adjust value function)
function swayBody(direction, swingTimes) {
    document.documentElement.style.setProperty('--rotate-value', adjustValue('--rotate-value', direction, swingAmountBody));
    document.documentElement.style.setProperty('--skew-value', adjustValue('--skew-value', direction, swingAmountBody));
}

// // .body-wiggle {
// //     transform: rotate(var(--rotate-value)) skew(var(--skew-value));
// // }

// // .correct-arm {
// //     transform: scale(var(--arm-scaling)); 
// // }
//  /* should be raised up to 1.344 at the highest point of the swinging motion */
//  --arm-scaling: 1;

//  /* transform: rotate(-5deg) skew(5deg); - slide to the left
//  transform: rotate(5deg) skew(-5deg); - slide to the right */
//  --rotate-value: 0deg;
//  --skew-value: 0deg;


let sideSwing = setInterval(function() {
    let leftPositionX = getNumber('--left-hand-position-X');
    let rightPositionX = getNumber('--right-hand-position-X');
    let rotation = getNumber('--rotate-value');
    let skew = getNumber('--skew-value');
    
    let swingTimes = 5;
    let leftSwing = swingAmountArms("leftX", swingTimes);
    let rightSwing = swingAmountArms("rightX", swingTimes);
   
    if (!mettBody.classList.contains("body-wiggle") && !leftArm.classList.contains("correct-arm") && !rightArm.classList.contains("correct-arm")) {
        mettBody.classList.add("body-wiggle");
        leftArm.classList.add("correct-arm") ;
        rightArm.classList.add("correct-arm") ;
    }

    if (leftPositionX <= arms["leftX"]["upperLimit"] && rightPositionX >= arms["rightX"]["upperLimit"] && !wentLeft) {
        if (leftPositionX === arms["leftX"]["upperLimit"] && rightPositionX === arms["rightX"]["upperLimit"]) {
            wentLeft = true;
        }
        swingArms("increase", leftSwing, rightSwing);
        
    } else if (leftPositionX >= arms["leftX"]["lowerLimit"] && rightPositionX <= arms["rightX"]["lowerLimit"] && wentLeft){
        if (leftPositionX === arms["leftX"]["lowerLimit"] && rightPositionX === arms["rightX"]["lowerLimit"]) {
            wentLeft = false;
        }
        swingArms("reduce", leftSwing, rightSwing);
    }
}, 270)

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode