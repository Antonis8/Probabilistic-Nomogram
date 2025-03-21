export class ClickableLock {
    constructor({ position }) {
        this.isLocked = false;
        this.lockIcon = document.createElement("img");
        this.lockIcon.src = "./unlocked_icon.svg"; // Initially unlocked
        this.lockIcon.style.width = "30px";
        this.lockIcon.style.height = "30px";
        this.lockIcon.style.position = "absolute";
        this.lockIcon.style.left = `${position.left}px`;
        this.lockIcon.style.top = `${position.top}px`;
        this.lockIcon.style.cursor = "pointer";
        this.lockIcon.style.userSelect = "none";
        this.lockIcon.style.pointerEvents = "auto";
        
        this.lockIcon.addEventListener("click", (event) => this.toggleLock(event));
        document.body.appendChild(this.lockIcon);
    }

    toggleLock(event) {
        event.preventDefault();
        this.isLocked = !this.isLocked;
        this.lockIcon.src = this.isLocked ? "./lock_icon.svg" : "./unlocked_icon.svg";
    }
    
}