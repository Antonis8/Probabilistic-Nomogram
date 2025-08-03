import { ConnectingLine } from "../components/base-components/connectingLine.js";
import { UncertaintyConnectingLine } from "../components/uncertainty-components/uncertaintyConnectingLine.js";

export class IsoplethManager {
    constructor(controller) {
        this.controller = controller;
    }

    makeIsopleths() {
        console.log("Creating isopleths...");
        const circles = this.controller.getCircles();
        const numCircles = circles.length;
        console.log("Number of circles:", numCircles);
        for (let i = 0; i < numCircles - 1; i++) {
            const connectingLine = new ConnectingLine({
                circle1: circles[i],
                circle2: circles[i + 1],
                opacity: "1"
            });
            circles[i].next_line = connectingLine;
            circles[i + 1].prev_line = connectingLine;
            
            const uncertaintyLine = new UncertaintyConnectingLine({
                draggableCircle1: circles[i],
                draggableCircle2: circles[i + 1]
                
            });

            circles[i].uncertainty_line = uncertaintyLine;
            circles[i + 1].uncertainty_line = uncertaintyLine;
            
            circles[i].shared_uncertainty_lines = circles[i].shared_uncertainty_lines || [];
            circles[i + 1].shared_uncertainty_lines = circles[i + 1].shared_uncertainty_lines || [];
            circles[i].shared_uncertainty_lines.push(uncertaintyLine);
            circles[i + 1].shared_uncertainty_lines.push(uncertaintyLine);
            console.log("Created uncertainty line between circles", i, "and", i + 1);
        }
    }
}
