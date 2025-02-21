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
    console.log(`the number is ${toNumber} and its type is  ${typeof(toNumber)}`);
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

let jazzHands = setInterval(function () {
    //may be best to tie this as an event listener for domload event?

    /* left starts at 2.8, right at -3
    function that brings them up should decrease left to 1.9 and  decrease right to -3.9
    function that brings them down should increase left back to 2.8 and increase right to -3
    */

    if (getNumber('--left-hand-position') >= 1.9 && getNumber('--right-hand-position') >= -3.9 && !wentUp) {
        if (getNumber('--left-hand-position') === 1.9 && getNumber('--right-hand-position') === -3.9) {
            wentUp = true;
        }
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "reduce", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "reduce", 0.1)); 
    } else if (getNumber('--left-hand-position') <= 2.8 && getNumber('--right-hand-position') <= -3 && wentUp){
        if (getNumber('--left-hand-position') === 2.8 && getNumber('--right-hand-position') === -3) {
            wentUp = false;
        }
        document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "increase", 0.1));
        document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "increase", 0.1));
    }

    console.log(`left is ${getNumber('--left-hand-position')}`);
    console.log(`right is ${getNumber('--right-hand-position')}`);

}
, 40)

// const altJazzHands = function () {
//     let loopedThrough = true;
//     let ranUp;

//     setTimeout(() => {
//         if (getNumber('--left-hand-position') === 1.9 && getNumber('--right-hand-position') === -3.8) {
//             loopedThrough = false;
//             ranUp = 0;
//         } else if (getNumber('--left-hand-position') === 2.8 && getNumber('--right-hand-position') === -3 && ranUp > 0) {
//             loopedThrough = true;
//         }

//         if (getNumber('--left-hand-position') >= 1.9 && getNumber('--right-hand-position') >= -3.8 && loopedThrough) {
//             ranUp++;
//             console.log(ranUp);
//             document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "reduce", 0.1));
//             document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "increase", -0.1));
//         } else {
//             document.documentElement.style.setProperty('--left-hand-position', adjustValue('--left-hand-position', "increase", 0.1));
//             document.documentElement.style.setProperty('--right-hand-position', adjustValue('--right-hand-position', "reduce", -0.1));
//         }
//     }, 100)
// }

//on button functionality - attack to change the... squarity of the drawing field, mercy to clear it. act for funny fuckery and item to change the drawing mode