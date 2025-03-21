export class ConnectingLine {
    constructor({ circle1, circle2, opacity }) {
        this.circle1 = circle1.circle; // DOM element
        this.circle2 = circle2.circle; // DOM element
        this.radius = circle1.radius;

        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", "2");
        this.line.setAttribute("stroke-opacity", opacity); // Change opacity (0 = fully transparent, 1 = fully opaque)


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