export class NomogramController {
    constructor(axisCoordsMap) {
        this.circles = [];
        this.moveHistory = [1, 2, 3];
        this.lastHistoryString = this.moveHistory.toString();
        this.axisCoordsMap = axisCoordsMap;
        this.outputColor = "green";
        this.inputColor = "black";
        this.numCircles = 3;
    }

    addCircle(circle) {
        this.circles.push(circle);
    }

    getCircles() {
        return this.circles;
    }

    getMoveHistory() {
        return this.moveHistory;
    }

    getAxisCoordsMap() {
        return this.axisCoordsMap;
    }

    getColors() {
        return {
            output: this.outputColor,
            input: this.inputColor
        };
    }



    updateMoveHistory(circleIndex) {
        const existingIndex = this.moveHistory.indexOf(circleIndex);
        if (existingIndex !== -1) {
            this.moveHistory.splice(existingIndex, 1);
        }
        this.moveHistory.unshift(circleIndex);
        
        const currentHistoryString = this.moveHistory.toString();
        if (currentHistoryString !== this.lastHistoryString) {
            console.log("History:", this.moveHistory);
            this.lastHistoryString = currentHistoryString;
            return true; // History changed
        }
        return false; // History unchanged
    }

    updateCircleColors() {
        this.circles.forEach((circle, index) => {
            if (this.moveHistory[this.moveHistory.length - 1] === index + 1) {
                circle.circle.style.backgroundColor = this.outputColor;
                circle.uncertaintyCircles.forEach(uncertaintyCircle => {
                    uncertaintyCircle.style.backgroundColor = this.outputColor;
                });
            } else {
                circle.circle.style.backgroundColor = this.inputColor;
                circle.uncertaintyCircles.forEach(uncertaintyCircle => {
                    uncertaintyCircle.style.backgroundColor = this.inputColor;
                });
            }
        });
    }

    setInitialColors() {
        this.circles.forEach((circle, index) => {
            if (this.moveHistory[this.moveHistory.length - 1] === index + 1) {
                circle.circle.style.backgroundColor = this.outputColor;
                circle.uncertaintyCircles.forEach(uncertaintyCircle => {
                    uncertaintyCircle.style.backgroundColor = this.outputColor;
                });
            }
        });
    }
}
