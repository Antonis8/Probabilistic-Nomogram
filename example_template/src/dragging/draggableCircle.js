export function createDraggableCircle({initialPosition, bounds }) {
    // Create a circle element
    const circle = document.createElement("div");
    circle.style.width = `30px`;
    circle.style.height = `30px`;
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "black";
    circle.style.position = "absolute";
    circle.style.top = `${initialPosition.top}px`;
    circle.style.left = `${initialPosition.left}px`;
    circle.style.cursor = "grab";

    document.body.appendChild(circle);

    let isDragging = false;

    circle.addEventListener("mousedown", (event) => {
        isDragging = true;
        circle.style.cursor = "grabbing";

        const shiftY = event.clientY - circle.getBoundingClientRect().top;

        // const moveAt = (pageY) => {
        //     const newTop = pageY - shiftY;
        //     if (newTop >= bounds.lower && newTop <= bounds.upper) {
        //         circle.style.top = `${newTop}px`;
        //     }
        // };

        let animationFrameId;

        const moveAt = (pageY) => {
            const newTop = pageY - shiftY;

            if (newTop < bounds.lower){
                circle.style.top = `${bounds.lower}px`;
            }

            else if (newTop > bounds.upper){
                circle.style.top = `${bounds.upper}px`;
            }

            else{
                animationFrameId = requestAnimationFrame(() => {
                    circle.style.top = `${newTop}px`;
                });
            }
        };


        const onMouseMove = (event) => {
            if (isDragging) {
                moveAt(event.pageY);
            }
        };

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener(
            "mouseup",
            () => {
                isDragging = false;
                circle.style.cursor = "grab";
                document.removeEventListener("mousemove", onMouseMove);
            },
            { once: true }
        );
    });

    circle.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });
}
// document.addEventListener("DOMContentLoaded", function () {

//     for (let i = 0; i < 4; i++){
//         createDraggableCircle({

//             initialPosition: { top: 350, left: (100 + 200*i)},
//             bounds: { lower: 100, upper: 600 },
//         });
//     }

// });
