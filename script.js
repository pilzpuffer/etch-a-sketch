const sketchField = document.querySelector('#mett-a-sketch');

/*
coding logic for this project, written down:
by default, the grid should be 16x16 squares
it should be possible to set it to a bigger amount of squares - while the grid itself shouldn't change in size

will need to think of logic for what functionality will be present when pressing the standard Undertale buttons
maybe mettaton's buttons should do something as well

but on code:

I will need to create a function that will take in a variable for the amount of times it will have to create/attach new squares
since it's a square, 2 separate values won't be needed to store that

hover functionality is easy, we just gotta push through with that function
or think of how exactly a grid can be set up... we'll need to do some combination of rows/columns to achieve that effect

oh! we can create a row div, then create 16 divs within it
and then just repeat that - no need for columns
*/ 

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


