import { ConnectingLine } from "./connectingLine.js";
import { DraggableCircle } from "./draggableCircle.js";
import { ClickableLock } from "./clickableLock.js";

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
                circle2: circles[i+1],
                opacity: "1"
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



document.addEventListener("DOMContentLoaded", function () {
    let verticalLockIncrement = 50;
    let horizontalLockIncrement = 10;

    function makeLock(x1, y1, x2, y2) {
        let midX = (x1 + x2) / 2;
        let midY = (y1 + y2) / 2;
        let lockPosition;
        
        if ((x1 - x2) === 0 || (y1 - y2) === 0) { // vertical/horizontal
            lockPosition = { left: midX + "px", top: y2 + verticalLockIncrement + "px" };
        } else {
            lockPosition = { left: midX + horizontalLockIncrement + "px", top: midY + 2 * verticalLockIncrement + "px" };
        }
        
        new ClickableLock({ position: lockPosition });
    }

    makeLock(570, 15, 570, 582);
});
    // const lockPositions = [
    //     { left: 5+ horizontalLockIncrement, top: 582 + verticalLockIncrement },
    //     { left: 250 + 2*horizontalLockIncrement,  top: 330 +1.5*verticalLockIncrement },
    //     { left: 570, top: 582 + 0.5*verticalLockIncrement}
    // ];
    
    // lockPositions.forEach(position => {
    //     new ClickableLock({ position });
    // });