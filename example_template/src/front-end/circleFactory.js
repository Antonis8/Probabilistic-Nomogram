import { DraggableCircle } from "./draggableCircle.js";
import { UncertaintySlider } from "./uncertaintySlider.js";

export class CircleFactory {
    constructor(controller, rulerConstraint, numberOfUncertaintyCircles) {
        this.controller = controller;
        this.rulerConstraint = rulerConstraint;
        this.numberOfUncertaintyCircles = numberOfUncertaintyCircles;
        console.log("CircleFactory initialized with numberOfUncertaintyCircles:", numberOfUncertaintyCircles);
    }   

    createCircle(axisKey, axisCoords, SCALING_FACTOR = 1) {
        const xMin = axisCoords.xMin * SCALING_FACTOR;
        const xMax = axisCoords.xMax * SCALING_FACTOR;
        const yMin = axisCoords.yMin * SCALING_FACTOR;
        const yMax = axisCoords.yMax * SCALING_FACTOR;

        const valueMin = axisCoords.valueMin;
        const valueMax = axisCoords.valueMax;

        const coordToValueMap = axisCoords.points;
        const valueToCoordMap = Object.fromEntries(
            Object.entries(coordToValueMap).map(([coord, value]) => [value, coord])
        );
        const sortedValues = Object.values(coordToValueMap).sort((a, b) => a - b);

        const isLinearScale = (axisCoords.scale == "linear");
        let ybounds = { lower: yMin, upper: yMax };

        let slope;
        if (yMax - yMin < 0.5) { // horizontal
            slope = 0;
        } else if (xMax - xMin < 0.5) { // vertical
            slope = Infinity;
        } else {
            slope = (yMax - yMin) / (xMax - xMin);
        }

        if (axisKey == "Axis 2") {
            slope = -1 * slope; // flip the slope for Axis 2
        }

        const circles = this.controller.getCircles();
        console.log("Creating circle with slope:", slope, "for axis:", axisKey);
        const newCircle = new DraggableCircle({
            initialPosition: { top: (yMin + yMax) / 2, left: (xMax + xMin) / 2 },
            bounds: ybounds,
            slope: slope,
            valueMin: valueMin,
            valueMax: valueMax,
            isLinearScale: isLinearScale,
            coordToValueMap: coordToValueMap,
            valueToCoordMap: valueToCoordMap,
            sortedValues: sortedValues,
            numberOfUncertaintyCircles: this.numberOfUncertaintyCircles,

            // track recency of dragging
            circleIndex: circles.length + 1,
            onValidateMove: (circleIndex, newX, newY) => {
                return this.rulerConstraint.isMovementValid(circleIndex, newX, newY);
            },
            onMove: (circleIndex) => {
                this.rulerConstraint.updateLRUCircle();
                
                const historyChanged = this.controller.updateMoveHistory(circleIndex);
                if (historyChanged) {
                    this.controller.updateCircleColors();
                }
            }
        });

        const slider = new UncertaintySlider({
            axisData: {
                xMin: xMin,
                xMax: xMax,
                yMax: yMax,
                valueMin: valueMin,
                valueMax: valueMax
            },
            onStdChange: (newStd) => {
                newCircle.setUncertaintyStd(newStd);
            }
        });
        newCircle.setUncertaintyStd(slider.currentStd);
        
        // Add the circle to the controller
        this.controller.addCircle(newCircle);
        
        return newCircle;
    }
}
