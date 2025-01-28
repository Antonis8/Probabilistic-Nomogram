// import { ConnectingLine } from "./connectingLine";
// import { DraggableCircle } from "./draggableCircle";


export class DraggableCircle {
    constructor({ initialPosition, bounds }) {
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

        document.body.appendChild(this.circle);

        this.next_line = null; // Line connecting this circle to the next
        this.prev_line = null;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.circle.addEventListener("mousedown", (event) => this.onMouseDown(event));
        this.circle.addEventListener("dragstart", (event) => event.preventDefault());
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.circle.style.cursor = "grabbing";

        const shiftY = event.clientY - this.circle.getBoundingClientRect().top;

        const moveAt = (pageY) => {
            const newTop = pageY - shiftY;

            if (newTop < this.bounds.lower) {
                this.circle.style.top = `${this.bounds.lower}px`;
            } else if (newTop > this.bounds.upper) {
                this.circle.style.top = `${this.bounds.upper}px`;
            } else {
                this.circle.style.top = `${newTop}px`;
            }

            // Update the line if it exists
            if (this.next_line) {
                this.next_line.updateLine();
            }

            if (this.prev_line) {
                this.prev_line.updateLine();
            }
        };

        const onMouseMove = (event) => {
            if (this.isDragging) {
                moveAt(event.pageY);
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
        svg.style.width = "100%";
        svg.style.height = "100%";
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
    const numCircles= 5;
    const bounds = { lower: 100, upper: 600 };
    const top = 100

    // circles 
    for (let c= 0; c< numCircles; c++){
        const newCircle = new DraggableCircle({
            initialPosition: { top: top, left: 50 + c*150 },
            bounds: bounds
        });
        circles.push(newCircle)
    }
    // isopleths
    for (let i = 0; i< numCircles-1; i++ ){
        const connectingLine = new ConnectingLine ({
            circle1: circles[i],
            circle2: circles[i+1]
        })
        circles[i].next_line = connectingLine
        circles[i+1].prev_line = connectingLine
    }
});
