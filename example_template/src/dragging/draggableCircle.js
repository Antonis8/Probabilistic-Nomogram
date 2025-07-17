import { UncertaintyCircle } from "./uncertaintyCircle.js";
export class DraggableCircle {
    constructor({ slope, initialPosition, bounds, valueMin, valueMax, coordToValueMap, valueToCoordMap, sortedValues, isLinearScale }) {
        this.radius = 10;
        this.bounds = bounds;
        this.isDragging = false;
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
        this.attachEventListeners();

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
            backgroundColor: "blue",
            position: "absolute",
            top: `${initialPosition.top}px`,
            left: `${initialPosition.left}px`,
            cursor: "grab"
        });
        return circle;
    }
    generateNoisyPoints(n, mean, std){
        const points = [];
        for (let i = 0; i < n; i++) {
            // Generate a random value using the Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const sample = mean + z * std; // Scale and shift to match the desired distribution
            points.push(sample);
        }
        return points;
    }
    
    getNearestValidValue(targetValue, sortedValues, valueMin, valueMax) {
        // check bounds
        if (targetValue <= valueMin) {
            return valueMin;
        } else if (targetValue >= valueMax) {
            return valueMax;
        }
        else {
            // Binary search.
            let left = 0;
            let right = sortedValues.length - 1;
            
            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                
                if (sortedValues[mid] === targetValue) {
                    return sortedValues[mid];
                }
                
                if (sortedValues[mid] < targetValue) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            // If tied, return the closest!
            const leftDistance = Math.abs(sortedValues[left] - targetValue);
            const rightDistance = Math.abs(sortedValues[right] - targetValue);
            
            if (leftDistance < rightDistance) {
                return sortedValues[left];
            } else {
                return sortedValues[right];
            }
        }
    }

    getNearestValidCoordinates(targetValue, sortedValues, valueToCoordMap, valueMin, valueMax) {
        const nearestValue = this.getNearestValidValue(targetValue, sortedValues, valueMin, valueMax);
        return valueToCoordMap[nearestValue];
    }
    
    makeUncertaintyCircles(n, mean, std) {
        const points = this.generateNoisyPoints(n, mean, std);
        const uncertaintyCircles = [];
        for (let i = 0; i < n; i++) {
            const targetValue = points[i];
            const nearestCoordinates = this.getNearestValidCoordinates(targetValue, this.sortedValues, this.valueToCoordMap, this.valueMin, this.valueMax);
            uncertaintyCircles.push(nearestCoordinates);
        }

        console.log(uncertaintyCircles);
        return uncertaintyCircles
    }

    

    attachEventListeners() {
        this.circle.addEventListener("mousedown", (event) => this.onMouseDown(event));
        this.circle.addEventListener("dragstart", (event) => event.preventDefault());
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.circle.style.cursor = "grabbing";

        const shiftY = event.clientY - this.circle.getBoundingClientRect().top;
        const shiftX = event.clientX - this.circle.getBoundingClientRect().left;




    const moveAt = (pageX, pageY) => {

            if (!isFinite(this.slope)){
                const projectedY = pageY - shiftY;

                if (projectedY < this.bounds.lower) {
                    this.circle.style.top = `${this.bounds.lower}px`;
                } else if (projectedY > this.bounds.upper) {
                    this.circle.style.top = `${this.bounds.upper}px`;
                } else {
                    this.circle.style.top = `${projectedY}px`;
                }
            } else { //we have finite slope

                // new X-coordinate
                let projectedX = (pageX - shiftX);

                // Compute the new Y based on new X
                let projectedY = this.slope * projectedX + this.intercept;
                
                // stay within bounds
                if (projectedY < this.bounds.lower) {
                    projectedY = this.bounds.lower;
                    projectedX = (projectedY - this.intercept) / this.slope;
                } else if (projectedY > this.bounds.upper) {
                    projectedY = this.bounds.upper;
                    projectedX = (projectedY - this.intercept) / this.slope;
                }

                // Set the new position, snapping to the nearest valid point on our line
                this.circle.style.left = `${projectedX}px`;
                this.circle.style.top = `${projectedY}px`;
            }
                
            // Update lines if they exist
            if (this.next_line) this.next_line.updateLine();
            if (this.prev_line) this.prev_line.updateLine();
            
        };

        const onMouseMove = (event) => {
            if (this.isDragging) {
                moveAt(event.pageX, event.pageY);
            }
        };

        const onMouseUp = () => {
            this.isDragging = false;
            this.circle.style.cursor = "grab";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
    }


}
