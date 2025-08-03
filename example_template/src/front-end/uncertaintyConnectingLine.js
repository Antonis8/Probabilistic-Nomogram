export class UncertaintyConnectingLine {
    constructor({ draggableCircle1, draggableCircle2 }) {
        this.draggableCircle1 = draggableCircle1;
        this.draggableCircle2 = draggableCircle2;
        this.lineCount = 50;
        this.lines = [];
        
        this.randomIndices1 = [];
        this.randomIndices2 = [];
        this.numberOfUncertaintyCircles = draggableCircle1.numberOfUncertaintyCircles;
        this.generateRandomIndices();
        this.createLinePool();
        this.updateLines();
    }

    generateRandomIndices() { // Pre cache which indices we pick. Will stay constant
        for (let i = 0; i < this.lineCount; i++) {
            this.randomIndices1[i] = Math.floor(Math.random() * this.numberOfUncertaintyCircles);
            this.randomIndices2[i] = Math.floor(Math.random() * this.numberOfUncertaintyCircles);
        }
    }

    createLinePool() {
        const svg = document.querySelector("svg");
        
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
        const circles1 = this.draggableCircle1.uncertaintyCircles;
        const circles2 = this.draggableCircle2.uncertaintyCircles;
        
        // Check if both circles have uncertainty circles positioned
        if (circles1.length === 0 || circles2.length === 0) return;
        if (!circles1[0].style.left || !circles2[0].style.left) return;
        
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
}
