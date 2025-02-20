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
    return toNumber;
};

function adjustValue(element, operation, amount){

    let properNumber = getNumber(element);
    
    let result;
    
    if (operation === "reduce") {
        result = properNumber - amount;
    } else if (operation === "increase") {
        result = properNumber + amount;
    } else {
        console.log("Invalid operation");
        return;
    }
    
    return `${result}%`;
    }

let jazzHands = setInterval(function () {

   //i need to sligthly re-think the logic here - might be best to implement with setTimout instead?
    if (getNumber('--left-hand-position') >= 1.9 && getNumber('--right-hand-position') >= -3.8) {
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "reduce", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "increase", -0.1));
    } else {
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "increase", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "reduce", -0.1));
    }

}
, 100)

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode