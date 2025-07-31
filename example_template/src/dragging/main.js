import { ConnectingLine } from "./connectingLine.js";
import { DraggableCircle } from "./draggableCircle.js";
import { UncertaintyCircle } from "./uncertaintyCircle.js";
import { ClickableLock } from "./clickableLock.js";
import { UncertaintySlider } from "./uncertaintySlider.js";
import { UncertaintyConnectingLine } from "./uncertaintyConnectingLine.js";
import { UncertaintyToggle } from "./uncertaintyToggle.js";

document.addEventListener("DOMContentLoaded", function () {


    // make dynamic
    const circles=  [];
    const numCircles= 3;
    
    let moveHistory = [1, 2, 3];
    let lastHistoryString = moveHistory.toString();

    function createSVGContainer() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        document.body.appendChild(svg);
        return svg;
    }
    createSVGContainer()


    const axisCoordsMap = {"Axis 1": {"xMin": 6.3, "xMax": 6.4, "yMin": 19.8, "yMax": 582.1, "valueMin": 0.0, "valueMax": 20.0, "points": {"[6.3, 19.8]": 0.0, "[6.3, 22.6]": 0.1, "[6.3, 25.4]": 0.2, "[6.3, 28.2]": 0.3, "[6.3, 31.1]": 0.4, "[6.3, 33.9]": 0.5, "[6.3, 36.6]": 0.6, "[6.3, 39.4]": 0.7, "[6.3, 42.3]": 0.8, "[6.3, 45.1]": 0.9, "[6.3, 47.9]": 1.0, "[6.3, 50.8]": 1.1, "[6.3, 53.6]": 1.2, "[6.3, 56.3]": 1.3, "[6.3, 59.1]": 1.4, "[6.3, 62.0]": 1.5, "[6.3, 64.8]": 1.6, "[6.3, 67.6]": 1.7, "[6.3, 70.4]": 1.8, "[6.3, 73.3]": 1.9, "[6.3, 76.1]": 2.0, "[6.3, 78.8]": 2.1, "[6.3, 81.6]": 2.2, "[6.3, 84.5]": 2.3, "[6.3, 87.3]": 2.4, "[6.3, 90.1]": 2.5, "[6.3, 92.9]": 2.6, "[6.3, 95.8]": 2.7, "[6.3, 98.5]": 2.8, "[6.3, 101.3]": 2.9, "[6.3, 104.1]": 3.0, "[6.3, 107.0]": 3.1, "[6.3, 109.8]": 3.2, "[6.3, 112.6]": 3.3, "[6.3, 115.3]": 3.4, "[6.3, 118.2]": 3.5, "[6.3, 121.0]": 3.6, "[6.3, 123.8]": 3.7, "[6.3, 126.6]": 3.8, "[6.3, 129.5]": 3.9, "[6.3, 132.3]": 4.0, "[6.3, 135.0]": 4.1, "[6.3, 137.8]": 4.2, "[6.3, 140.7]": 4.3, "[6.3, 143.5]": 4.4, "[6.3, 146.3]": 4.5, "[6.3, 149.1]": 4.6, "[6.3, 152.0]": 4.7, "[6.3, 154.8]": 4.8, "[6.3, 157.5]": 4.9, "[6.3, 160.3]": 5.0, "[6.3, 163.2]": 5.1, "[6.3, 166.0]": 5.2, "[6.3, 168.8]": 5.3, "[6.3, 171.7]": 5.4, "[6.3, 174.5]": 5.5, "[6.3, 177.2]": 5.6, "[6.3, 180.0]": 5.7, "[6.3, 182.9]": 5.8, "[6.3, 185.7]": 5.9, "[6.3, 188.5]": 6.0, "[6.3, 191.3]": 6.1, "[6.3, 194.2]": 6.2, "[6.3, 197.0]": 6.3, "[6.3, 199.7]": 6.4, "[6.3, 202.5]": 6.5, "[6.3, 205.4]": 6.6, "[6.3, 208.2]": 6.7, "[6.3, 211.0]": 6.8, "[6.3, 213.7]": 6.9, "[6.3, 216.7]": 7.0, "[6.3, 219.4]": 7.1, "[6.3, 222.2]": 7.2, "[6.3, 225.0]": 7.3, "[6.3, 227.9]": 7.4, "[6.3, 230.7]": 7.5, "[6.3, 233.5]": 7.6, "[6.3, 236.2]": 7.7, "[6.3, 239.1]": 7.8, "[6.3, 241.9]": 7.9, "[6.3, 244.7]": 8.0, "[6.3, 247.5]": 8.1, "[6.3, 250.4]": 8.2, "[6.3, 253.2]": 8.3, "[6.3, 255.9]": 8.4, "[6.3, 258.7]": 8.5, "[6.3, 261.6]": 8.6, "[6.3, 264.4]": 8.7, "[6.3, 267.2]": 8.8, "[6.3, 270.0]": 8.9, "[6.3, 272.9]": 9.0, "[6.3, 275.7]": 9.1, "[6.3, 278.4]": 9.2, "[6.3, 281.3]": 9.3, "[6.3, 284.1]": 9.4, "[6.3, 286.9]": 9.5, "[6.3, 289.7]": 9.6, "[6.3, 292.6]": 9.7, "[6.3, 295.4]": 9.8, "[6.3, 298.1]": 9.9, "[6.3, 300.9]": 10.0, "[6.3, 303.8]": 10.1, "[6.3, 306.6]": 10.2, "[6.3, 309.4]": 10.3, "[6.3, 312.2]": 10.4, "[6.3, 315.1]": 10.5, "[6.3, 317.8]": 10.6, "[6.3, 320.6]": 10.7, "[6.3, 323.4]": 10.8, "[6.3, 326.3]": 10.9, "[6.3, 329.1]": 11.0, "[6.3, 331.9]": 11.1, "[6.3, 334.6]": 11.2, "[6.3, 337.6]": 11.3, "[6.3, 340.3]": 11.4, "[6.3, 343.1]": 11.5, "[6.3, 345.9]": 11.6, "[6.3, 348.8]": 11.7, "[6.3, 351.6]": 11.8, "[6.3, 354.4]": 11.9, "[6.3, 357.1]": 12.0, "[6.3, 360.0]": 12.1, "[6.3, 362.8]": 12.2, "[6.3, 365.6]": 12.3, "[6.3, 368.4]": 12.4, "[6.3, 371.3]": 12.5, "[6.3, 374.1]": 12.6, "[6.3, 376.8]": 12.7, "[6.3, 379.6]": 12.8, "[6.3, 382.5]": 12.9, "[6.3, 385.3]": 13.0, "[6.3, 388.1]": 13.1, "[6.3, 390.9]": 13.2, "[6.3, 393.8]": 13.3, "[6.3, 396.5]": 13.4, "[6.3, 399.3]": 13.5, "[6.3, 402.2]": 13.6, "[6.3, 405.0]": 13.7, "[6.3, 407.8]": 13.8, "[6.3, 410.6]": 13.9, "[6.3, 413.5]": 14.0, "[6.3, 416.3]": 14.1, "[6.3, 419.0]": 14.2, "[6.3, 421.8]": 14.3, "[6.3, 424.7]": 14.4, "[6.3, 427.5]": 14.5, "[6.3, 430.3]": 14.6, "[6.3, 433.1]": 14.7, "[6.3, 436.0]": 14.8, "[6.3, 438.7]": 14.9, "[6.3, 441.5]": 15.0, "[6.3, 444.3]": 15.1, "[6.3, 447.2]": 15.2, "[6.3, 450.0]": 15.3, "[6.3, 452.8]": 15.4, "[6.3, 455.5]": 15.5, "[6.3, 458.4]": 15.6, "[6.3, 461.2]": 15.7, "[6.3, 464.0]": 15.8, "[6.3, 466.8]": 15.9, "[6.3, 469.7]": 16.0, "[6.3, 472.5]": 16.1, "[6.3, 475.2]": 16.2, "[6.3, 478.0]": 16.3, "[6.3, 480.9]": 16.4, "[6.3, 483.7]": 16.5, "[6.3, 486.5]": 16.6, "[6.3, 489.3]": 16.7, "[6.3, 492.2]": 16.8, "[6.3, 495.0]": 16.9, "[6.3, 497.7]": 17.0, "[6.3, 500.5]": 17.1, "[6.3, 503.4]": 17.2, "[6.3, 506.2]": 17.3, "[6.3, 509.0]": 17.4, "[6.4, 511.9]": 17.5, "[6.4, 514.7]": 17.6, "[6.4, 517.4]": 17.7, "[6.4, 520.2]": 17.8, "[6.4, 523.1]": 17.9, "[6.4, 525.9]": 18.0, "[6.4, 528.7]": 18.1, "[6.4, 531.5]": 18.2, "[6.4, 534.4]": 18.3, "[6.4, 537.1]": 18.4, "[6.4, 539.9]": 18.5, "[6.4, 542.7]": 18.6, "[6.4, 545.6]": 18.7, "[6.4, 548.4]": 18.8, "[6.4, 551.2]": 18.9, "[6.4, 553.9]": 19.0, "[6.4, 556.9]": 19.1, "[6.4, 559.6]": 19.2, "[6.4, 562.4]": 19.3, "[6.4, 565.2]": 19.4, "[6.4, 568.1]": 19.5, "[6.4, 570.9]": 19.6, "[6.4, 573.7]": 19.7, "[6.4, 576.4]": 19.8, "[6.4, 579.3]": 19.9, "[6.4, 582.1]": 20.0}, "scale": "linear"}, "Axis 2": {"xMin": 6.4, "xMax": 474.9, "yMin": 113.5, "yMax": 582.1, "valueMin": 0.0, "valueMax": 10.0, "points": {"[474.9, 113.5]": 10.0, "[470.8, 117.5]": 9.5, "[466.4, 122.0]": 9.0, "[461.5, 126.8]": 8.5, "[456.1, 132.1]": 8.0, "[450.2, 138.1]": 7.5, "[443.6, 144.7]": 7.0, "[442.2, 146.0]": 6.9, "[440.8, 147.5]": 6.8, "[439.3, 148.9]": 6.7, "[437.8, 150.5]": 6.6, "[436.3, 152.0]": 6.5, "[434.7, 153.6]": 6.4, "[433.1, 155.3]": 6.3, "[431.4, 156.9]": 6.2, "[429.8, 158.6]": 6.1, "[428.0, 160.3]": 6.0, "[426.2, 162.0]": 5.9, "[424.4, 163.9]": 5.8, "[422.5, 165.7]": 5.7, "[420.6, 167.7]": 5.6, "[418.7, 169.7]": 5.5, "[416.6, 171.7]": 5.4, "[414.5, 173.8]": 5.3, "[412.4, 175.9]": 5.2, "[410.2, 178.2]": 5.1, "[407.9, 180.4]": 5.0, "[405.6, 182.7]": 4.9, "[403.2, 185.2]": 4.8, "[400.8, 187.6]": 4.7, "[398.2, 190.1]": 4.6, "[395.6, 192.7]": 4.5, "[392.9, 195.5]": 4.4, "[390.1, 198.3]": 4.3, "[387.2, 201.2]": 4.2, "[384.2, 204.1]": 4.1, "[381.2, 207.1]": 4.0, "[378.0, 210.3]": 3.9, "[374.7, 213.6]": 3.8, "[371.3, 217.1]": 3.7, "[367.8, 220.6]": 3.6, "[364.1, 224.2]": 3.5, "[360.3, 228.0]": 3.4, "[356.4, 231.9]": 3.3, "[352.3, 236.0]": 3.2, "[348.1, 240.2]": 3.1, "[343.7, 244.7]": 3.0, "[339.1, 249.2]": 2.9, "[334.3, 254.1]": 2.8, "[329.3, 259.0]": 2.7, "[324.1, 264.3]": 2.6, "[318.7, 269.7]": 2.5, "[313.0, 275.4]": 2.4, "[307.1, 281.3]": 2.3, "[300.9, 287.6]": 2.2, "[294.3, 294.0]": 2.1, "[287.5, 300.9]": 2.0, "[280.3, 308.1]": 1.9, "[272.7, 315.7]": 1.8, "[264.7, 323.7]": 1.7, "[256.2, 332.1]": 1.6, "[247.3, 341.1]": 1.5, "[237.9, 350.5]": 1.4, "[227.8, 360.6]": 1.3, "[217.2, 371.1]": 1.2, "[205.9, 382.5]": 1.1, "[193.8, 394.7]": 1.0, "[180.8, 407.5]": 0.9, "[167.0, 421.4]": 0.8, "[152.1, 436.4]": 0.7, "[136.1, 452.4]": 0.6, "[118.8, 469.7]": 0.5, "[100.1, 488.3]": 0.4, "[79.7, 508.7]": 0.3, "[57.5, 530.9]": 0.2, "[33.1, 555.3]": 0.1, "[6.4, 582.1]": 0.0}, "scale": "logarithmic"}, "Axis 3": {"xMin": 568.6, "xMax": 568.7, "yMin": 19.7, "yMax": 582.0, "valueMin": 0.0, "valueMax": 10.0, "points": {"[568.6, 19.7]": 0.0, "[568.6, 25.3]": 0.1, "[568.6, 31.0]": 0.2, "[568.6, 36.5]": 0.3, "[568.6, 42.2]": 0.4, "[568.6, 47.9]": 0.5, "[568.6, 53.4]": 0.6, "[568.6, 59.1]": 0.7, "[568.6, 64.7]": 0.8, "[568.6, 70.4]": 0.9, "[568.6, 75.9]": 1.0, "[568.6, 81.6]": 1.1, "[568.6, 87.2]": 1.2, "[568.6, 92.9]": 1.3, "[568.6, 98.4]": 1.4, "[568.6, 104.1]": 1.5, "[568.6, 109.7]": 1.6, "[568.6, 115.3]": 1.7, "[568.6, 120.9]": 1.8, "[568.6, 126.6]": 1.9, "[568.6, 132.1]": 2.0, "[568.6, 137.8]": 2.1, "[568.6, 143.4]": 2.2, "[568.6, 149.1]": 2.3, "[568.6, 154.6]": 2.4, "[568.6, 160.3]": 2.5, "[568.6, 165.9]": 2.6, "[568.6, 171.6]": 2.7, "[568.6, 177.1]": 2.8, "[568.6, 182.8]": 2.9, "[568.6, 188.4]": 3.0, "[568.6, 194.0]": 3.1, "[568.6, 199.6]": 3.2, "[568.6, 205.3]": 3.3, "[568.6, 210.8]": 3.4, "[568.6, 216.5]": 3.5, "[568.6, 222.1]": 3.6, "[568.6, 227.8]": 3.7, "[568.6, 233.3]": 3.8, "[568.6, 239.0]": 3.9, "[568.6, 244.6]": 4.0, "[568.6, 250.3]": 4.1, "[568.6, 255.8]": 4.2, "[568.6, 261.5]": 4.3, "[568.6, 267.1]": 4.4, "[568.6, 272.7]": 4.5, "[568.6, 278.4]": 4.6, "[568.6, 284.0]": 4.7, "[568.6, 289.7]": 4.8, "[568.6, 295.2]": 4.9, "[568.6, 300.9]": 5.0, "[568.6, 306.5]": 5.1, "[568.6, 312.2]": 5.2, "[568.6, 317.7]": 5.3, "[568.6, 323.4]": 5.4, "[568.6, 329.0]": 5.5, "[568.6, 334.6]": 5.6, "[568.6, 340.2]": 5.7, "[568.6, 345.9]": 5.8, "[568.6, 351.4]": 5.9, "[568.6, 357.1]": 6.0, "[568.6, 362.7]": 6.1, "[568.6, 368.4]": 6.2, "[568.6, 373.9]": 6.3, "[568.6, 379.6]": 6.4, "[568.6, 385.2]": 6.5, "[568.6, 390.9]": 6.6, "[568.6, 396.4]": 6.7, "[568.6, 402.1]": 6.8, "[568.6, 407.7]": 6.9, "[568.6, 413.3]": 7.0, "[568.6, 418.9]": 7.1, "[568.6, 424.6]": 7.2, "[568.6, 430.1]": 7.3, "[568.6, 435.8]": 7.4, "[568.6, 441.4]": 7.5, "[568.6, 447.1]": 7.6, "[568.6, 452.6]": 7.7, "[568.7, 458.3]": 7.8, "[568.7, 463.9]": 7.9, "[568.7, 469.6]": 8.0, "[568.7, 475.1]": 8.1, "[568.7, 480.8]": 8.2, "[568.7, 486.4]": 8.3, "[568.7, 492.0]": 8.4, "[568.7, 497.6]": 8.5, "[568.7, 503.3]": 8.6, "[568.7, 509.0]": 8.7, "[568.7, 514.5]": 8.8, "[568.7, 520.2]": 8.9, "[568.7, 525.8]": 9.0, "[568.7, 531.5]": 9.1, "[568.7, 537.0]": 9.2, "[568.7, 542.7]": 9.3, "[568.7, 548.3]": 9.4, "[568.7, 553.9]": 9.5, "[568.7, 559.5]": 9.6, "[568.7, 565.2]": 9.7, "[568.7, 570.7]": 9.8, "[568.7, 576.4]": 9.9, "[568.7, 582.0]": 10.0}, "scale": "linear"}}

    
    const axisKeys = Object.keys(axisCoordsMap); // ["Axis 1", "Axis 2", "Axis 3"]

    for (const axisKey of axisKeys) {

        
        const axisCoords = axisCoordsMap[axisKey]; // {"xMin": 6.1, "xMax": 6.1, ...}
        const SCALING_FACTOR= 1; // scaling factor for the coordinates
        const xMin = axisCoords.xMin*SCALING_FACTOR;
        const xMax = axisCoords.xMax*SCALING_FACTOR;
        const yMin = axisCoords.yMin*SCALING_FACTOR;
        const yMax = axisCoords.yMax*SCALING_FACTOR;

        const valueMin = axisCoords.valueMin;
        const valueMax = axisCoords.valueMax;

        const coordToValueMap = axisCoords.points; // {"[6.1, 12.4]": 0.0, "[6.1, 15.3]": 0.1, ...}
        const valueToCoordMap = Object.fromEntries(
            Object.entries(coordToValueMap).map(([coord, value]) => [value, coord])
        ); // {0.0: "[6.1, 12.4]", 0.1: "[6.1, 15.3]", ...}
        const sortedValues = Object.values(coordToValueMap).sort((a, b) => a - b); // [0.0, 0.1, 0.2, ...]


        const isLinearScale = (axisCoords.scale == "linear"); 
        let ybounds = { lower: yMin, upper: yMax };

        let slope;

        if (yMax- yMin < 0.5) { // horizontal
            slope = 0
        }
        else if (xMax - xMin < 0.5) { // vertical
            slope = Infinity
        } else {
            slope = (yMax - yMin) / (xMax - xMin);
        }

        if (axisKey == "Axis 2") {
            slope = -1 * slope; // flip the slope for Axis 2
        }

        if (axisKey != "Axis 9") { //skip locked axis, for example the middle one.
        const newCircle = new DraggableCircle({
            initialPosition: { top: (yMin+yMax)/2, left:(xMax+xMin)/2 },
            bounds: ybounds,
            slope: slope,
            valueMin: valueMin,
            valueMax: valueMax,
            isLinearScale: isLinearScale,
            coordToValueMap: coordToValueMap,
            valueToCoordMap: valueToCoordMap,
            sortedValues: sortedValues,

            // track recency of dragging
            circleIndex: circles.length + 1,
            onMove: (circleIndex) => {
                const existingIndex = moveHistory.indexOf(circleIndex);
                if (existingIndex !== -1) {
                    moveHistory.splice(existingIndex, 1);
                }
                moveHistory.unshift(circleIndex);
                
                const currentHistoryString = moveHistory.toString();
                if (currentHistoryString !== lastHistoryString) {
                    console.log("History:", moveHistory);
                    lastHistoryString = currentHistoryString;
                }
            }
        });

        circles.push(newCircle);
    
        const slider = new UncertaintySlider({
            axisData: {
                xMin: xMin,
                xMax: xMax,
                yMax: yMax,
                valueMin: valueMin,
                valueMax: valueMax
            },
            onStdChange: (newStd) => {
                newCircle.setUncertaintyStd(newStd);
            }
            
        });
        newCircle.setUncertaintyStd(slider.currentStd);
    }
    }
    makeIsopleths();
    
    const axis3Data = axisCoordsMap["Axis 3"];
    const togglePosition = {
        x: axis3Data.xMax + 100,
        y: axis3Data.yMin + 10
    };
    
    new UncertaintyToggle({
        position: togglePosition,
        onToggle: (isOn) => {
            circles.forEach(circle => {
                circle.uncertaintyCircles.forEach(uncertaintyCircle => {
                    uncertaintyCircle.style.display = isOn ? "block" : "none";
                });
                
                if (circle.shared_uncertainty_lines) {
                    circle.shared_uncertainty_lines.forEach(uncertaintyLine => {
                        uncertaintyLine.lines.forEach(line => {
                            line.style.display = isOn ? "block" : "none";
                        });
                    });
                }
            });
        }
    });
        
    function makeIsopleths() {
        for (let i = 0; i< numCircles-1; i++ ){
            const connectingLine = new ConnectingLine ({
                circle1: circles[i],
                circle2: circles[i+1],
                opacity: "1"
            })
            circles[i].next_line = connectingLine
            circles[i+1].prev_line = connectingLine
            
            const uncertaintyLine = new UncertaintyConnectingLine({
                draggableCircle1: circles[i],
                draggableCircle2: circles[i+1]
            })
            circles[i].uncertainty_line = uncertaintyLine
            circles[i+1].uncertainty_line = uncertaintyLine
            
            circles[i].shared_uncertainty_lines = circles[i].shared_uncertainty_lines || [];
            circles[i+1].shared_uncertainty_lines = circles[i+1].shared_uncertainty_lines || [];
            circles[i].shared_uncertainty_lines.push(uncertaintyLine);
            circles[i+1].shared_uncertainty_lines.push(uncertaintyLine);
        }
    }

}
);



// document.addEventListener("DOMContentLoaded", function () {
//     let verticalLockIncrement = 50;
//     let horizontalLockIncrement = 10;

//     function makeLock(x1, y1, x2, y2) {
//         let midX = (x1 + x2) / 2;
//         let midY = (y1 + y2) / 2;
//         let lockPosition;
        
//         if ((x1 - x2) === 0 || (y1 - y2) === 0) { // vertical/horizontal
//             lockPosition = { left: midX + "px", top: y2 + verticalLockIncrement + "px" };
//         } else {
//             lockPosition = { left: midX + horizontalLockIncrement + "px", top: midY + 2 * verticalLockIncrement + "px" };
//         }
        
//         new ClickableLock({ position: lockPosition });
//     }

//     makeLock(570, 15, 570, 582);
// });
