export class UncertaintySlider {
    constructor({ axisData, onStdChange }) {
        this.axisData = axisData;
        this.onStdChange = onStdChange;
        
        // Scale std based on value range
        const valueRange = Math.abs(axisData.valueMax - axisData.valueMin);
        this.minStd = valueRange * 0.01; // 1% of range
        this.maxStd = valueRange * 0.05; // 5% of range
        this.currentStd = this.minStd*2; // avg
        
        this.x = (axisData.xMin + axisData.xMax) / 2 + 15;
        this.y = axisData.yMax + 50;
        this.createSliderElements();
    }
    
    createSliderElements() {
        this.track = document.createElement("div");
        Object.assign(this.track.style, {
            width: "4px",
            height: "80px",
            backgroundColor: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
            background: "linear-gradient(to bottom, #e3f2fd, #bbdefb)",
            position: "absolute",
            left: `${this.x}px`,
            top: `${this.y}px`,
            borderRadius: "3px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
            border: "1px solid #90caf9",
            zIndex: "50"
        });
        
        // Create slider handle
        this.handle = document.createElement("div");
        Object.assign(this.handle.style, {
            width: "18px",
            height: "18px",
            backgroundColor: "#1976d2",
            background: "linear-gradient(135deg, #2196f3, #1976d2)",
            position: "absolute",
            left: `${this.x - 7}px`, // Center on track
            top: `${this.y + this.getHandlePosition()}px`,
            borderRadius: "50%",
            cursor: "grab",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
            border: "2px solid #fff",
            transition: "transform 0.1s ease, box-shadow 0.1s ease",
            zIndex: "51"
        });
        
        // Create label
        this.label = document.createElement("div");
        Object.assign(this.label.style, {
            position: "absolute",
            left: `${this.x - 25}px`,
            top: `${this.y + 110}px`,
            fontSize: "11px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: "500",
            color: "#1565c0",
            textAlign: "center",
            width: "50px",
            padding: "2px 4px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "4px",
            border: "1px solid #e3f2fd",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            zIndex: "50"
        });
        this.updateLabel();
        this.attachEventListeners();
        
        document.body.appendChild(this.track);
        document.body.appendChild(this.handle);
        document.body.appendChild(this.label);
    }
    
    getHandlePosition() {
        // Map std value to position on track (0 to 80px)
        const ratio = (this.currentStd - this.minStd) / (this.maxStd - this.minStd);
        return 80 - (ratio * 80); // Inverted: top = low std, bottom = high std
    }
    
    updateLabel() {
        this.label.textContent = `σ=${this.currentStd.toFixed(1)}`;
    }
    
    attachEventListeners() {
        this.handle.addEventListener("mousedown", (event) => this.onMouseDown(event));
        
        // Add hover effects
        this.handle.addEventListener("mouseenter", () => {
            this.handle.style.transform = "scale(1.1)";
            this.handle.style.boxShadow = "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)";
        });
        
        this.handle.addEventListener("mouseleave", () => {
            this.handle.style.transform = "scale(1)";
            this.handle.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)";
        });
    }
    
    onMouseDown(event) {
        event.preventDefault();
        this.handle.style.cursor = "grabbing";
        this.handle.style.transform = "scale(0.95)";
        
        const onMouseMove = (event) => {
            // Calculate new position relative to track
            const trackRect = this.track.getBoundingClientRect();
            const mouseY = event.clientY;
            const trackTop = trackRect.top;
            const trackHeight = 80;
            
            // Constrain to track bounds
            let relativeY = mouseY - trackTop;
            relativeY = Math.max(0, Math.min(trackHeight, relativeY));
            
            // Map position to std value (inverted)
            const ratio = 1 - (relativeY / trackHeight);
            this.currentStd = this.minStd + ratio * (this.maxStd - this.minStd);
            
            // Update handle position
            this.handle.style.top = `${this.y + relativeY}px`;
            this.updateLabel();
            
            // Notify parent of std change
            if (this.onStdChange) {
                this.onStdChange(this.currentStd);
            }
        };
        
        const onMouseUp = () => {
            this.handle.style.cursor = "grab";
            this.handle.style.transform = "scale(1)";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}
