// import { ConnectingLine } from "./connectingLine";
// import { DraggableCircle } from "./draggableCircle";


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

export class ConnectingLine {
    constructor({ circle1, circle2 }) {
        this.circle1 = circle1.circle; // DOM element
        this.circle2 = circle2.circle; // DOM element
        this.radius = circle1.radius;

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", "2");

        const svg = document.querySelector("svg") || this.createSVGContainer();
        svg.appendChild(this.line);

        this.updateLine();
    }

    createSVGContainer() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "500%";
        svg.style.height = "500%";
        svg.style.pointerEvents = "none";
        document.body.appendChild(svg);
        return svg;
    }

    updateLine() {
        const startX = parseInt(this.circle1.style.left) + this.radius / 2;
        const startY = parseInt(this.circle1.style.top) + this.radius / 2;
        const endX = parseInt(this.circle2.style.left) + this.radius / 2;
        const endY = parseInt(this.circle2.style.top) + this.radius / 2;

        this.line.setAttribute("x1", startX);
        this.line.setAttribute("y1", startY);
        this.line.setAttribute("x2", endX);
        this.line.setAttribute("y2", endY);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // make dynamic
    const circles=  [];
    const numCircles= 3;
    const boundsY = { lower: 40, upper: 700 };
    const initialX = 300
    const slope = -1

    makeHardCodedCircles_V2()
    makeIsopleths();

    function createSVGContainer() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "500%";
        svg.style.height = "500%";
        svg.style.pointerEvents = "none";
        document.body.appendChild(svg);
        return svg;
    }
    createSVGContainer()
    
    //issue it stops at 5?? On inkspace it should stop at 440
    function makeHardCodedCircles_V1() {
        const newCircle = new DraggableCircle({
            initialPosition: { top: 15.12, left: 3.44 },
            bounds: {lower: 15.12, upper: 440},
            slope: Infinity
            
        });

    }
    function makeHardCodedCircles_V2() {
        const circleA = new DraggableCircle({
            initialPosition: { top: 15.82, left: 3.44 },
            bounds: {lower: 15.12, upper: 582},
            slope: Infinity
        });
        circles.push(circleA)
        // const diagonalTop = 80
        // const circleB = new DraggableCircle({
        //     initialPosition: { top: diagonalTop, left: 501 },
        //     bounds: {lower: diagonalTop, upper: 582},
        //     slope: -1
        // });
        // circles.push(circleB)
        const circleC = new DraggableCircle({
            initialPosition: { top: 15.12, left: 570 },
            bounds: {lower: 15.12, upper: 582},
            slope: Infinity
        });
        circles.push(circleC)


    }

    function makeCircles() {
        for (let c= 0; c< numCircles; c++){
            const newCircle = new DraggableCircle({
                initialPosition: { top: initialX, left: 50 + c*150 },
                bounds: boundsY,
                slope: slope
            });
            circles.push(newCircle)
        }
    }
    function makeIsopleths() {
        for (let i = 0; i< numCircles-1; i++ ){
            const connectingLine = new ConnectingLine ({
                circle1: circles[i],
                circle2: circles[i+1]
            })
            circles[i].next_line = connectingLine
            circles[i+1].prev_line = connectingLine
        }
    }

    // lock: calc x midpoint b/w axes.
    // if vertical: (M_x, y_end + c)
    // if horizontal: (M_x, M_y +c)
    // if diagonal: (M_x, M_y + 2c)
}
);

