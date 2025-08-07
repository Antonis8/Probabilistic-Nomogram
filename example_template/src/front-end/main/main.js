import { UncertaintyToggle } from "../components/uncertainty-components/uncertaintyToggle.js";
import { NomogramController } from "../managers/nomogramController.js";
import { RulerConstraint } from "../managers/rulerConstraint.js";
import { GeometryUtils } from "../managers/geometryUtils.js";
import { IsoplethManager } from "../managers/isoplethManager.js";
import { CircleFactory } from "../managers/circleFactory.js";

document.addEventListener("DOMContentLoaded", async function () {

    // grab json
    const response = await fetch('./axis_to_coord_values.json');
    const axisCoordsMap = await response.json();
    
    const numberOfUncertaintyCircles = 250;

    //Initialize components
    GeometryUtils.createSVGContainer();
    const controller = new NomogramController(axisCoordsMap); // Holds circles & history of use
    const rulerConstraint = new RulerConstraint(controller); // ensures ruler-like functionality
    const circleFactory = new CircleFactory(controller, rulerConstraint, numberOfUncertaintyCircles); //makes all circles
    const isoplethManager = new IsoplethManager(controller);
    
    //create circles for each axis
    const axisKeys = Object.keys(axisCoordsMap);
    for (const axisKey of axisKeys) {
        circleFactory.createCircle(axisKey, axisCoordsMap[axisKey])
    }    

    //update
    isoplethManager.makeIsopleths()
    controller.updateCircleColors();
    UncertaintyToggle.setup(controller);

});
