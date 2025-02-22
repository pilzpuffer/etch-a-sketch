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
    let toNumber = parseFloat(prepare); // toFixed Returns a string
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
        left: {
            upperLimit: 3.8,
            lowerLimit: 4.8
        },

        right: {
            upperLimit: -2,
            lowerLimit: -1
        }
    }


let jazzHands = setInterval(function () {
    //may be best to tie this as an event listener for domload event?
    let leftPosition = getNumber('--left-hand-position');
    let rightPosition = getNumber('--right-hand-position');

    if (leftPosition >= arms["left"]["upperLimit"] && rightPosition >= arms["right"]["upperLimit"] && !wentUp) {
        if (leftPosition === arms["left"]["upperLimit"] && rightPosition === arms["right"]["upperLimit"]) {
            wentUp = true;
        }
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "reduce", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "reduce", 0.1)); 
    } else if (leftPosition <= arms["left"]["lowerLimit"] && rightPosition <= arms["right"]["lowerLimit"] && wentUp){
        if (leftPosition === arms["left"]["lowerLimit"] && rightPosition === arms["right"]["lowerLimit"]) {
            wentUp = false;
        }
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "increase", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "increase", 0.1));
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

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode