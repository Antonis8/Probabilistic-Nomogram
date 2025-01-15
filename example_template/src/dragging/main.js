
import { createDraggableCircle } from "./draggableCircle.js";

document.addEventListener("DOMContentLoaded", function () {

    for (let i = 0; i < 4; i++){
        createDraggableCircle({

            initialPosition: { top: 350, left: (100 + 200*i)},
            bounds: { lower: 100, upper: 600 },
        });
    }
});

