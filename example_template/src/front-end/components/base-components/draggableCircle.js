import { UncertaintyCircle } from "../uncertainty-components/uncertaintyCircle.js";
export class DraggableCircle {
    constructor({ slope, initialPosition, bounds, valueMin, valueMax, coordToValueMap, valueToCoordMap, sortedValues, isLinearScale, circleIndex, onMove, onValidateMove, numberOfUncertaintyCircles }) {
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
        this.circleIndex = circleIndex;
        this.onMove = onMove;
        this.onValidateMove = onValidateMove;

        // uncertainty properties
        this.uncertaintyCircles = [];
        this.uncertaintyStd = 0.7;
        this.numberOfUncertaintyCircles = numberOfUncertaintyCircles;    // Default to 100 if not provided
        // this.uncertaintyCount = 100 ;

        // Create a circle element
        this.circle = this.createCircleElement(initialPosition);

        //initialize isopleths
        this.next_line = null; // Line connecting this circle to the next
        this.prev_line = null;
        this.uncertainty_line = null; // Uncertainty line connecting this circle to another
        this.attachEventListeners();

        // Compute intercept c from y = mx + c
        // c = y- mx
        this.slope = slope; // The gradient m
        this.intercept = initialPosition.top - this.slope * initialPosition.left;
        
        // Create pool once at initialization
        this.createUncertaintyPool();

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
            cursor: "grab",
            zIndex: "100"
        });
        return circle;
    }

    // Uncertainty methods
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

        //console.log(uncertaintyCircles);
        return uncertaintyCircles
    }

    getNearestValueFromCoordinates(targetCoordinates) {
        // can be optimized with grad descent, but for now, we will use brute force
        // Input: targetCoordinates is an array [X, Y]
        let closestDistance = Infinity;
        let currentDistance;
        let closestValue;
        for (const key in this.coordToValueMap) {
            const [x, y] = JSON.parse(key);
            currentDistance = this.L2Norm(x, y, targetCoordinates[0], targetCoordinates[1]);
            if (currentDistance < closestDistance) {
                closestDistance = currentDistance;
                closestValue = this.coordToValueMap[key];
            }
        }
        return closestValue;
    }
    L2Norm(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    }

    // Method to clear existing uncertainty circles
    clearUncertaintyCircles() {
        this.uncertaintyCircles.forEach(circle => {
            if (circle.circle && circle.circle.parentNode) {
                circle.circle.parentNode.removeChild(circle.circle);
            }
        });
        this.uncertaintyCircles = [];
    }

    // Create pool of reusable DOM elements
    createUncertaintyPool() {
        for (let i = 0; i < this.numberOfUncertaintyCircles; i++) {
            const circle = document.createElement("div");
            Object.assign(circle.style, {
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "black",
                position: "absolute",
                opacity: "0.03",
                zIndex: "1"
            });
            document.body.appendChild(circle);
            this.uncertaintyCircles.push(circle);
        }
    }

    updateDynamicUncertaintyCircles() {
        const currentValue = this.getNearestValueFromCoordinates(this.getCurrentPosition());
        if (currentValue === undefined) return;
        
        const uncertaintyCoords = this.makeUncertaintyCircles(
            this.numberOfUncertaintyCircles, 
            currentValue, 
            this.uncertaintyStd
        );
        
        // Update position of existing circles
        for (let i = 0; i < uncertaintyCoords.length; i++) {
            const coord = JSON.parse(uncertaintyCoords[i]);
            const circle = this.uncertaintyCircles[i];
            
            circle.style.left = `${coord[0]}px`;
            circle.style.top = `${coord[1]}px`;
        }
    }

    // Vary std with slider
    setUncertaintyStd(newStd) {
        this.uncertaintyStd = newStd;
        this.updateDynamicUncertaintyCircles();
        
        // Update uncertainty lines if they exist
        if (this.uncertainty_line) {
            this.uncertainty_line.updateLines();
        }
        
        if (this.shared_uncertainty_lines) {
            this.shared_uncertainty_lines.forEach(uncertaintyLine => {
                uncertaintyLine.updateLines();
            });
        }
    }

    getCurrentPosition() {
        return [
            parseFloat(this.circle.style.left),
            parseFloat(this.circle.style.top)
        ];
    }
    
    // Ineractivity methods
    attachEventListeners() {
        this.circle.addEventListener("mousedown", (event) => this.onMouseDown(event));
        this.circle.addEventListener("touchstart", (event) => this.onTouchStart(event));
        this.circle.addEventListener("dragstart", (event) => event.preventDefault());
    }

    onTouchStart(event) {
        event.preventDefault(); // Prevent scrolling and other default behaviors
        const touch = event.touches[0];
        this.startDrag(touch.clientX, touch.clientY, true);
    }

    onMouseDown(event) {
        this.startDrag(event.clientX, event.clientY, false);
    }

    startDrag(clientX, clientY, isTouch) {
        this.isDragging = true;
        this.circle.style.cursor = "grabbing";

        const shiftY = clientY - this.circle.getBoundingClientRect().top;
        const shiftX = clientX - this.circle.getBoundingClientRect().left;




    const moveAt = (pageX, pageY) => {
        let finalX, finalY;

        if (!isFinite(this.slope)){
            const projectedY = pageY - shiftY;
            finalX = parseFloat(this.circle.style.left); // Keep current X for vertical axis

            if (projectedY < this.bounds.lower) {
                finalY = this.bounds.lower;
            } else if (projectedY > this.bounds.upper) {
                finalY = this.bounds.upper;
            } else {
                finalY = projectedY;
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

            finalX = projectedX;
            finalY = projectedY;
        }
        
        // Validate the movement before applying it
        if (this.onValidateMove && !this.onValidateMove(this.circleIndex, finalX, finalY)) {
            // Movement is not valid - don't apply it
            return;
        }

        // Movement is valid - apply it
        this.circle.style.left = `${finalX}px`;
        this.circle.style.top = `${finalY}px`;
            
        // Update lines if they exist
        if (this.next_line) this.next_line.updateLine();
        if (this.prev_line) this.prev_line.updateLine();
        if (this.uncertainty_line) this.uncertainty_line.updateLines();
        
        if (this.shared_uncertainty_lines) {
            this.shared_uncertainty_lines.forEach(uncertaintyLine => {
                uncertaintyLine.updateLines();
            });
        }
            
            // Create dynamic uncertainty circles based on current position
            this.updateDynamicUncertaintyCircles();
            
            if (this.onMove) {
                this.onMove(this.circleIndex);
            }
            
            //console.log(" Closest value: ", this.getNearestValueFromCoordinates(this.getCurrentPosition()));
        };

        const onMouseMove = (event) => {
            if (this.isDragging) {
                moveAt(event.pageX, event.pageY);
            }
        };

        const onTouchMove = (event) => {
            if (this.isDragging) {
                event.preventDefault(); // Prevent scrolling
                const touch = event.touches[0];
                moveAt(touch.pageX, touch.pageY);
            }
        };

        const onMouseUp = () => {
            this.isDragging = false;
            this.circle.style.cursor = "grab";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (isTouch) {
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
            }
        };

        const onTouchEnd = () => {
            this.isDragging = false;
            this.circle.style.cursor = "grab";
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            if (!isTouch) {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }
        };

        if (isTouch) {
            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd, { once: true });
        } else {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp, { once: true });
        }
    }


}
