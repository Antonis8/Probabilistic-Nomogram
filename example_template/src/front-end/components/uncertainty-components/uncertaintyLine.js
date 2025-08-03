import { ConnectingLine } from "../base-components/connectingLine.js";

export class UncertaintyLine extends ConnectingLine {
    constructor({ circle1, circle2, controller, lineCount = 50 }) {
        // Initialize with base ConnectingLine but make it invisible initially
        super({ circle1, circle2, opacity: 0 });
        
        this.controller = controller;
        this.lineCount = lineCount;
        this.lines = [];
        this.isVisible = true;
        
        // Store references to the draggable circle objects (not just DOM elements)
        this.draggableCircle1 = circle1;
        this.draggableCircle2 = circle2;
        
        // Pre-generate random indices for consistency
        this.randomIndices1 = [];
        this.randomIndices2 = [];
        this.numberOfUncertaintyCircles = circle1.numberOfUncertaintyCircles;
        this.generateRandomIndices();
        
        // Create the uncertainty line pool
        this.createUncertaintyLinePool();
        
        // Remove the base line since we're using multiple lines
        this.line.remove();
    }

    generateRandomIndices() {
        for (let i = 0; i < this.lineCount; i++) {
            this.randomIndices1[i] = Math.floor(Math.random() * this.numberOfUncertaintyCircles);
            this.randomIndices2[i] = Math.floor(Math.random() * this.numberOfUncertaintyCircles);
        }
    }

    createUncertaintyLinePool() {
        const svg = document.querySelector("svg") || this.createSVGContainer();
        
        for (let i = 0; i < this.lineCount; i++) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-opacity", "0.1");
            svg.appendChild(line);
            this.lines.push(line);
        }
    }

    updateLines() {
        // Check if controller is available (might not be during construction)
        if (!this.controller) {
            return;
        }
        
        // Check if this represents the two MRU circles
        const moveHistory = this.controller.getMoveHistory();
        const circles = this.controller.getCircles();
        
        if (circles.length < 3) {
            this.setVisibility(true);
            this.updateUncertaintyLines();
            return;
        }

        // Get the indices of the circles this line connects
        const circle1Index = circles.findIndex(c => c === this.draggableCircle1) + 1;
        const circle2Index = circles.findIndex(c => c === this.draggableCircle2) + 1;
        
        // Check if these are the two most recently used circles
        const isMRUPair = (moveHistory[0] === circle1Index && moveHistory[1] === circle2Index) ||
                         (moveHistory[0] === circle2Index && moveHistory[1] === circle1Index);
        
        // Debug logging
        console.log(`Line ${circle1Index}-${circle2Index}: MRU=${isMRUPair}, History=${moveHistory}`);
        
        if (isMRUPair) {
            // This is an MRU pair - check if we need extrapolation and if it's valid
            const areAdjacent = this.areMRUCirclesAdjacent(circle1Index, circle2Index);
            console.log(`Adjacent: ${areAdjacent}`);
            
            if (areAdjacent) {
                // Adjacent MRU circles - use extrapolation logic
                const isExtrapolationValid = this.checkExtrapolationBounds();
                console.log(`Extrapolation valid: ${isExtrapolationValid}`);
                this.setVisibility(isExtrapolationValid);
            } else {
                // Non-adjacent MRU circles - line naturally passes through LRU
                console.log(`Non-adjacent MRU pair - showing direct lines`);
                this.setVisibility(true);
            }
            
            if (this.isVisible) {
                this.updateExtendedUncertaintyLines(areAdjacent);
            }
        } else {
            // Not an MRU pair - hide this uncertainty line
            console.log(`Not MRU pair - hiding`);
            this.setVisibility(false);
        }
    }

    areMRUCirclesAdjacent(circle1Index, circle2Index) {
        // Check if the two circles are adjacent in the nomogram
        // Adjacent means they are consecutive circles (like 1-2, 2-3, etc.)
        return Math.abs(circle1Index - circle2Index) === 1;
    }

    checkExtrapolationBounds() {
        // Check if controller is available
        if (!this.controller) {
            return true; // Default to visible if we can't check
        }
        
        const circles = this.controller.getCircles();
        const moveHistory = this.controller.getMoveHistory();
        const axisCoordsMap = this.controller.getAxisCoordsMap();
        
        if (circles.length < 3) return true;
        
        // Get the LRU circle (3rd in move history)
        const lruCircle = circles[moveHistory[2] - 1];
        
        // Get positions of the two MRU circles
        const pos1 = this.getCirclePosition(circles[moveHistory[0] - 1]);
        const pos2 = this.getCirclePosition(circles[moveHistory[1] - 1]);
        
        // Calculate where the extrapolated line would intersect the LRU axis
        let targetY;
        
        if (!isFinite(lruCircle.slope)) {
            // Vertical axis
            const lruAxisData = Object.values(axisCoordsMap)[moveHistory[2] - 1];
            const axisX = (lruAxisData.xMin + lruAxisData.xMax) / 2;
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            targetY = trajectorySlope * axisX + trajectoryIntercept;
        } else {
            // Finite slope axis
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            const axisSlope = lruCircle.slope;
            const axisIntercept = lruCircle.intercept;
            
            if (Math.abs(trajectorySlope - axisSlope) < 1e-10) {
                return true; // Parallel lines, allow
            }
            
            const targetX = (axisIntercept - trajectoryIntercept) / (trajectorySlope - axisSlope);
            targetY = axisSlope * targetX + axisIntercept;
        }
        
        // Check if target position is within bounds
        // Add some tolerance for numerical precision
        const tolerance = (lruCircle.bounds.upper - lruCircle.bounds.lower) * 0.01;
        return targetY >= (lruCircle.bounds.lower - tolerance) && 
               targetY <= (lruCircle.bounds.upper + tolerance);
    }

    getCirclePosition(circle) {
        return {
            x: parseFloat(circle.circle.style.left),
            y: parseFloat(circle.circle.style.top)
        };
    }

    setVisibility(visible) {
        this.isVisible = visible;
        const display = visible ? "block" : "none";
        this.lines.forEach(line => {
            line.style.display = display;
        });
    }

    updateExtendedUncertaintyLines(areAdjacent) {
        // Check if draggable circles are properly initialized
        if (!this.draggableCircle1 || !this.draggableCircle2) {
            return;
        }
        
        const circles1 = this.draggableCircle1.uncertaintyCircles;
        const circles2 = this.draggableCircle2.uncertaintyCircles;
        
        // Check if both circles have uncertainty circles positioned
        if (circles1.length === 0 || circles2.length === 0) return;
        if (!circles1[0].style.left || !circles2[0].style.left) return;
        
        if (areAdjacent) {
            // Adjacent MRU circles - extend lines to meet LRU axis
            this.drawExtrapolatedLines(circles1, circles2);
        } else {
            // Non-adjacent MRU circles - draw normal lines between them
            this.drawDirectLines(circles1, circles2);
        }
    }

    drawDirectLines(circles1, circles2) {
        // Draw direct lines between uncertainty circles (non-adjacent case)
        for (let i = 0; i < this.lineCount; i++) {
            const circle1 = circles1[this.randomIndices1[i]];
            const circle2 = circles2[this.randomIndices2[i]];
            
            const startX = parseInt(circle1.style.left) + 3.5;
            const startY = parseInt(circle1.style.top) + 3.5;
            const endX = parseInt(circle2.style.left) + 3.5;
            const endY = parseInt(circle2.style.top) + 3.5;
            
            const line = this.lines[i];
            line.setAttribute("x1", startX);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", endX);
            line.setAttribute("y2", endY);
        }
    }

    drawExtrapolatedLines(circles1, circles2) {
        // Draw lines that extend to meet the LRU axis (adjacent case)
        const moveHistory = this.controller.getMoveHistory();
        const circles = this.controller.getCircles();
        const axisCoordsMap = this.controller.getAxisCoordsMap();
        const lruCircle = circles[moveHistory[2] - 1];
        const lruAxisData = Object.values(axisCoordsMap)[moveHistory[2] - 1];
        
        // Determine which MRU circle is which based on move history
        const circle1Index = circles.findIndex(c => c === this.draggableCircle1) + 1;
        const circle2Index = circles.findIndex(c => c === this.draggableCircle2) + 1;
        
        // Ensure we draw from first MRU through second MRU to LRU
        let firstMRUCircles, secondMRUCircles;
        if (moveHistory[0] === circle1Index) {
            firstMRUCircles = circles1;
            secondMRUCircles = circles2;
        } else {
            firstMRUCircles = circles2;
            secondMRUCircles = circles1;
        }
        
        for (let i = 0; i < this.lineCount; i++) {
            const firstCircle = firstMRUCircles[this.randomIndices1[i]];
            const secondCircle = secondMRUCircles[this.randomIndices2[i]];
            
            const startX = parseInt(firstCircle.style.left) + 3.5;
            const startY = parseInt(firstCircle.style.top) + 3.5;
            const midX = parseInt(secondCircle.style.left) + 3.5;
            const midY = parseInt(secondCircle.style.top) + 3.5;
            
            // Calculate extrapolated endpoint on LRU axis
            let endX, endY;
            
            if (!isFinite(lruCircle.slope)) {
                // Vertical LRU axis
                const axisX = (lruAxisData.xMin + lruAxisData.xMax) / 2;
                const trajectorySlope = (midY - startY) / (midX - startX);
                const trajectoryIntercept = startY - trajectorySlope * startX;
                endX = axisX;
                endY = trajectorySlope * axisX + trajectoryIntercept;
            } else {
                // Finite slope LRU axis
                const trajectorySlope = (midY - startY) / (midX - startX);
                const trajectoryIntercept = startY - trajectorySlope * startX;
                const axisSlope = lruCircle.slope;
                const axisIntercept = lruCircle.intercept;
                
                if (Math.abs(trajectorySlope - axisSlope) < 1e-10) {
                    // Parallel lines, use direct line
                    endX = midX;
                    endY = midY;
                } else {
                    endX = (axisIntercept - trajectoryIntercept) / (trajectorySlope - axisSlope);
                    endY = axisSlope * endX + axisIntercept;
                }
            }
            
            // Constrain to axis bounds
            if (endY < lruCircle.bounds.lower) {
                endY = lruCircle.bounds.lower;
                if (!isFinite(lruCircle.slope)) {
                    endX = (lruAxisData.xMin + lruAxisData.xMax) / 2;
                } else {
                    endX = (endY - lruCircle.intercept) / lruCircle.slope;
                }
            } else if (endY > lruCircle.bounds.upper) {
                endY = lruCircle.bounds.upper;
                if (!isFinite(lruCircle.slope)) {
                    endX = (lruAxisData.xMin + lruAxisData.xMax) / 2;
                } else {
                    endX = (endY - lruCircle.intercept) / lruCircle.slope;
                }
            }
            
            const line = this.lines[i];
            line.setAttribute("x1", startX);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", endX);
            line.setAttribute("y2", endY);
        }
    }

    updateUncertaintyLines() {
        // Fallback method for simple direct lines (backward compatibility)
        if (!this.draggableCircle1 || !this.draggableCircle2) {
            return;
        }
        
        const circles1 = this.draggableCircle1.uncertaintyCircles;
        const circles2 = this.draggableCircle2.uncertaintyCircles;
        
        // Check if both circles have uncertainty circles positioned
        if (circles1.length === 0 || circles2.length === 0) return;
        if (!circles1[0].style.left || !circles2[0].style.left) return;
        
        this.drawDirectLines(circles1, circles2);
    }

    // Override the base updateLine method to use our custom logic
    updateLine() {
        this.updateLines();
    }
}
