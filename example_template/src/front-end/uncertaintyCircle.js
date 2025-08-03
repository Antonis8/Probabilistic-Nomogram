export class UncertaintyCircle {
    constructor({ slope, initialPosition, bounds, valueMin, valueMax, coordToValueMap, valueToCoordMap, sortedValues, isLinearScale }) {
        this.radius = 7;
        this.bounds = bounds;
        // this.isDragging = false;
        this.currentValue = null; // axis value
        this.valueMin = valueMin;
        this.valueMax = valueMax;
        this.coordToValueMap = coordToValueMap; // {"[6.1, 12.4]": 0.0, "[6.1, 15.3]": 0.1, ...}
        this.valueToCoordMap = valueToCoordMap; // {0.0: "[6.1, 12.4]", 0.1: "[6.1, 15.3]", ...}
        this.sortedValues = sortedValues; // [0.0, 0.1, 0.2, ...]
        this.isLinearScale = isLinearScale;



        // Create a circle element
        this.circle = this.createCircleElement(initialPosition);

        //initialize isopleths
        this.next_line = null; // Line connecting this circle to the next
        this.prev_line = null;
        //this.attachEventListeners();

        // Compute intercept c from y = mx + c
        // c = y- mx
        this.slope = slope; // The gradient m
        this.intercept = initialPosition.top - this.slope * initialPosition.left;


        document.body.appendChild(this.circle);
    }
    createCircleElement(initialPosition) {
        const circle = document.createElement("div");
        Object.assign(circle.style, {
            width: `${this.radius}px`,
            height: `${this.radius}px`,
            borderRadius: "50%",
            backgroundColor: "black",
            position: "absolute",
            top: `${initialPosition.top}px`,
            left: `${initialPosition.left}px`,
            opacity: "0.03",
            zIndex: "1" 
        });
        return circle;
    }
}