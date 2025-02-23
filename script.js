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
    rotate: {
        left: -5,
        right: 5
    },

    skew: {
        left: 5,
        right: -5
    }
}

let wentLeft = false;

function swingAmount (direction, swingTimes) {
        result = Math.round(((arms[direction]["upperLimit"]- arms[direction]["lowerLimit"])/swingTimes)*10)/10;
        return result;
}

function swingArms(direction, leftSwing, rightSwing) {
    document.documentElement.style.setProperty('--left-hand-position-X', adjustValue('--left-hand-position-X', direction, leftSwing));
    document.documentElement.style.setProperty('--right-hand-position-X', adjustValue('--right-hand-position-X', direction, rightSwing));
}

let sideSwing = setInterval(function() {
    let leftPositionX = getNumber('--left-hand-position-X');
    let rightPositionX = getNumber('--right-hand-position-X');
    
    let swingTimes = 5;
    let leftSwing = swingAmount("leftX", swingTimes);
    let rightSwing = swingAmount("rightX", swingTimes);
   

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