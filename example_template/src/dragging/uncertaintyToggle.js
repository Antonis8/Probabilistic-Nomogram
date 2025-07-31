export class UncertaintyToggle {
    constructor({ position, onToggle }) {
        this.position = position;
        this.onToggle = onToggle;
        this.isOn = true;
        
        this.x = position.x;
        this.y = position.y;
        this.createToggleElements();
    }
    
    createToggleElements() {
        this.label = document.createElement("div");
        Object.assign(this.label.style, {
            position: "absolute",
            left: `${this.x}px`,
            top: `${this.y - 25}px`,
            fontSize: "12px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: "700",
            color: "#333",
            textAlign: "left",
            zIndex: "50"
        });
        this.label.textContent = "Uncertainty";
        
        this.track = document.createElement("div");
        Object.assign(this.track.style, {
            width: "44px",
            height: "24px",
            backgroundColor: "#34c759",
            position: "absolute",
            left: `${this.x}px`,
            top: `${this.y}px`,
            borderRadius: "12px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            border: "1px solid #ddd",
            zIndex: "50"
        });
        
        this.handle = document.createElement("div");
        Object.assign(this.handle.style, {
            width: "20px",
            height: "20px",
            backgroundColor: "#fff",
            position: "absolute",
            left: `${this.x + 22}px`,
            top: `${this.y + 2}px`,
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "left 0.3s ease",
            zIndex: "51"
        });
        
        this.attachEventListeners();
        
        document.body.appendChild(this.label);
        document.body.appendChild(this.track);
        document.body.appendChild(this.handle);
    }
    
    attachEventListeners() {
        const toggle = () => {
            this.isOn = !this.isOn;
            
            if (this.isOn) {
                this.track.style.backgroundColor = "#34c759";
                this.handle.style.left = `${this.x + 22}px`;
            } else {
                this.track.style.backgroundColor = "#ccc";
                this.handle.style.left = `${this.x + 2}px`;
            }
            
            if (this.onToggle) {
                this.onToggle(this.isOn);
            }
        };
        
        this.track.addEventListener("click", toggle);
        this.handle.addEventListener("click", toggle);
    }
}
