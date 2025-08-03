import { ConnectingLine } from "../components/base-components/connectingLine.js";
import { UncertaintyLine } from "../components/uncertainty-components/uncertaintyLine.js";

export class IsoplethManager {
    constructor(controller) {
        this.controller = controller;
    }

    makeIsopleths() {
        console.log("Creating isopleths...");
        const circles = this.controller.getCircles();
        const numCircles = circles.length;
        console.log("Number of circles:", numCircles);
        
        // Create connecting lines only between adjacent circles (for visual structure)
        for (let i = 0; i < numCircles - 1; i++) {
            const connectingLine = new ConnectingLine({
                circle1: circles[i],
                circle2: circles[i + 1],
                opacity: "1"
            });
            circles[i].next_line = connectingLine;
            circles[i + 1].prev_line = connectingLine;
        }
        
        // Create uncertainty lines between ALL possible pairs of circles
        for (let i = 0; i < numCircles; i++) {
            for (let j = i + 1; j < numCircles; j++) {
                const uncertaintyLine = new UncertaintyLine({
                    circle1: circles[i],
                    circle2: circles[j],
                    controller: this.controller
                });

                // Initialize shared_uncertainty_lines arrays if they don't exist
                circles[i].shared_uncertainty_lines = circles[i].shared_uncertainty_lines || [];
                circles[j].shared_uncertainty_lines = circles[j].shared_uncertainty_lines || [];
                
                // Add the uncertainty line to both circles' shared lists
                circles[i].shared_uncertainty_lines.push(uncertaintyLine);
                circles[j].shared_uncertainty_lines.push(uncertaintyLine);
                
                console.log("Created uncertainty line between circles", i, "and", j);
            }
        }
    }
}
