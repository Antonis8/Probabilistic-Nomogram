export class DraggableCircle {
    constructor({ slope, initialPosition, bounds }) {
        this.radius = 10;
        this.bounds = bounds;
        this.isDragging = false;

        // Create a circle element
        this.circle = document.createElement("div");
        this.circle.style.width = `${this.radius}px`;
        this.circle.style.height = `${this.radius}px`;
        this.circle.style.borderRadius = "50%";
        this.circle.style.backgroundColor = "black";
        this.circle.style.position = "absolute";
        this.circle.style.top = `${initialPosition.top}px`;
        this.circle.style.left = `${initialPosition.left}px`;
        this.circle.style.cursor = "grab";

        
        //initialize isopleths
        this.next_line = null; // Line connecting this circle to the next
        this.prev_line = null;
        this.attachEventListeners();

        // slope
        this.slope = slope; // The gradient m

        // Compute intercept c from y = mx + c
        // c = y- mx
        this.intercept = initialPosition.top - this.slope * initialPosition.left;


        document.body.appendChild(this.circle);
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

    function generateNoisyPoints(mean, std){
        const points = [];
        for (let i = 0; i < 20; i++) {
            // Generate a random value using the Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const sample = mean + z * std; // Scale and shift to match the desired distribution
            points.push(sample);
        }
        return points;
    }

    function generateNoisyPoints(mean, std){
        const points = [];
        for (let i = 0; i < 20; i++) {
            // Generate a random value using the Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const sample = mean + z * std; // Scale and shift to match the desired distribution
            points.push(sample);
        }
        return points;
    }

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