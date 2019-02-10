 // Load the Observable runtime and inspector.
 import { Runtime, Inspector } from "../javascripts/notebook_runtime.js";


 // Your notebook, compiled as an ES module.
 import notebook from "https://api.observablehq.com/@robinl/population-estimates-using-the-filter-api.js";




const outputs = ["title",  "viewof selected_granularity", "viewof selected_year", "viewof selected_geography", "commentary", "pyramid"]


    var cells = document.getElementById("cells")

    let outputs_divs = outputs.map(function(d) {
    let new_cell = document.createElement("div")
    new_cell.id = d
    new_cell.className = "cell"
    cells.appendChild(new_cell)
    return new_cell
})

Runtime.load(notebook, (cell) => {
    if (outputs.includes(cell.name)) {
        var this_cell = document.getElementById(cell.name)
        return {
            fulfilled: (value) => {
                this_cell.innerHTML = '';
                this_cell.appendChild(value)
            }
        };
    }
});






