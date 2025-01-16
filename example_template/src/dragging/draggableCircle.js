// export class DraggableCircle {
//     constructor({ initialPosition, bounds }) {
//         this.radius = 10;
//         this.bounds = bounds;
//         this.isDragging = false;

//         // Create a circle element
//         this.circle = document.createElement("div");
//         this.circle.style.width = `${this.radius}px`;
//         this.circle.style.height = `${this.radius}px`;
//         this.circle.style.borderRadius = "50%";
//         this.circle.style.backgroundColor = "black";
//         this.circle.style.position = "absolute";
//         this.circle.style.top = `${initialPosition.top}px`;
//         this.circle.style.left = `${initialPosition.left}px`;
//         this.circle.style.cursor = "grab";

//         document.body.appendChild(this.circle);

//         this.line = null; // Line connecting this circle to the next
//         this.attachEventListeners();
//     }

//     attachEventListeners() {
//         this.circle.addEventListener("mousedown", (event) => this.onMouseDown(event));
//         this.circle.addEventListener("dragstart", (event) => event.preventDefault());
//     }

//     onMouseDown(event) {
//         this.isDragging = true;
//         this.circle.style.cursor = "grabbing";

//         const shiftY = event.clientY - this.circle.getBoundingClientRect().top;

//         const moveAt = (pageY) => {
//             const newTop = pageY - shiftY;

//             if (newTop < this.bounds.lower) {
//                 this.circle.style.top = `${this.bounds.lower}px`;
//             } else if (newTop > this.bounds.upper) {
//                 this.circle.style.top = `${this.bounds.upper}px`;
//             } else {
//                 this.circle.style.top = `${newTop}px`;
//             }

//             // Update the line if it exists
//             if (this.line) {
//                 this.updateLine();
//             }
//         };

//         const onMouseMove = (event) => {
//             if (this.isDragging) {
//                 moveAt(event.pageY);
//             }
//         };

//         const onMouseUp = () => {
//             this.isDragging = false;
//             this.circle.style.cursor = "grab";
//             document.removeEventListener("mousemove", onMouseMove);
//             document.removeEventListener("mouseup", onMouseUp);
//         };

//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp, { once: true });
//     }

// }