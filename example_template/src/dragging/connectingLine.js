// export class ConnectingLine {
//     constructor({ circle1, circle2, radius }) {
//         this.circle1 = circle1.circle; // DOM element
//         this.circle2 = circle2.circle; // DOM element
//         this.radius = radius;

//         this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//         this.line.setAttribute("stroke", "black");
//         this.line.setAttribute("stroke-width", "2");

//         const svg = document.querySelector("svg") || this.createSVGContainer();
//         svg.appendChild(this.line);

//         this.updateLine();
//     }

//     createSVGContainer() {
//         const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//         svg.style.position = "absolute";
//         svg.style.top = "0";
//         svg.style.left = "0";
//         svg.style.width = "100%";
//         svg.style.height = "100%";
//         svg.style.pointerEvents = "none";
//         document.body.appendChild(svg);
//         return svg;
//     }

//     updateLine() {
//         const startX = parseInt(this.circle1.style.left) + this.radius / 2;
//         const startY = parseInt(this.circle1.style.top) + this.radius / 2;
//         const endX = parseInt(this.circle2.style.left) + this.radius / 2;
//         const endY = parseInt(this.circle2.style.top) + this.radius / 2;

//         this.line.setAttribute("x1", startX);
//         this.line.setAttribute("y1", startY);
//         this.line.setAttribute("x2", endX);
//         this.line.setAttribute("y2", endY);
//     }
// }
