export class RulerConstraint {
    constructor(controller) {
        this.controller = controller;
    }

    getCirclePosition(circle) {
        return {
            x: parseFloat(circle.circle.style.left),
            y: parseFloat(circle.circle.style.top)
        };
    }

    moveCircleToPosition(circle, targetX, targetY) {
        let finalX, finalY;
        
        // Respect the axis constraints like the dragging logic does
        if (!isFinite(circle.slope)) {
            // Vertical axis - only Y movement allowed
            finalX = parseFloat(circle.circle.style.left); // Keep current X
            finalY = targetY;
            
            // Stay within bounds
            if (finalY < circle.bounds.lower) {
                finalY = circle.bounds.lower;
            } else if (finalY > circle.bounds.upper) {
                finalY = circle.bounds.upper;
            }
        } else {
            // Finite slope axis - project target onto the axis line
            let projectedX = targetX;
            let projectedY = circle.slope * projectedX + circle.intercept;
            
            // Stay within bounds
            if (projectedY < circle.bounds.lower) {
                projectedY = circle.bounds.lower;
                projectedX = (projectedY - circle.intercept) / circle.slope;
            } else if (projectedY > circle.bounds.upper) {
                projectedY = circle.bounds.upper;
                projectedX = (projectedY - circle.intercept) / circle.slope;
            }
            
            finalX = projectedX;
            finalY = projectedY;
        }
        
        // Set the constrained position
        circle.circle.style.left = `${finalX}px`;
        circle.circle.style.top = `${finalY}px`;
        circle.updateDynamicUncertaintyCircles();
        
        if (circle.next_line) circle.next_line.updateLine();
        if (circle.prev_line) circle.prev_line.updateLine();
        if (circle.shared_uncertainty_lines) {
            circle.shared_uncertainty_lines.forEach(line => line.updateLines());
        }
    }

    isMovementValid(movingCircleIndex, newX, newY) {
        const circles = this.controller.getCircles();
        if (circles.length < 3) return true; // Allow movement if not enough circles
        
        // Create a temporary position to test
        const originalPosition = this.getCirclePosition(circles[movingCircleIndex - 1]);
        
        // Temporarily set the new position
        circles[movingCircleIndex - 1].circle.style.left = `${newX}px`;
        circles[movingCircleIndex - 1].circle.style.top = `${newY}px`;
        
        // Test the LRU positioning with this new position
        const isValid = this.testLRUPositioning(movingCircleIndex);
        
        // Restore original position
        circles[movingCircleIndex - 1].circle.style.left = `${originalPosition.x}px`;
        circles[movingCircleIndex - 1].circle.style.top = `${originalPosition.y}px`;
        
        return isValid;
    }

    testLRUPositioning(movingCircleIndex) {
        const circles = this.controller.getCircles();
        const moveHistory = this.controller.getMoveHistory();
        const axisCoordsMap = this.controller.getAxisCoordsMap();
        
        // Create a temporary move history with the moving circle as most recent
        const tempHistory = [...moveHistory];
        const existingIndex = tempHistory.indexOf(movingCircleIndex);
        if (existingIndex !== -1) {
            tempHistory.splice(existingIndex, 1);
        }
        tempHistory.unshift(movingCircleIndex);
        
        if (tempHistory.length < 3) return true; // Not enough circles to test
        
        const mostRecent = circles[tempHistory[0] - 1];
        const secondRecent = circles[tempHistory[1] - 1];
        const lruCircle = circles[tempHistory[2] - 1];
        
        const pos1 = this.getCirclePosition(mostRecent);
        const pos2 = this.getCirclePosition(secondRecent);
        
        let targetY;
        
        if (!isFinite(lruCircle.slope)) {
            // Vertical axis
            const axisX = (Object.values(axisCoordsMap)[tempHistory[2] - 1].xMin + 
                          Object.values(axisCoordsMap)[tempHistory[2] - 1].xMax) / 2;
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            targetY = trajectorySlope * axisX + trajectoryIntercept;
        } else {
            // Finite slope axis
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            const axisSlope = lruCircle.slope;
            const axisIntercept = lruCircle.intercept;
            
            if (Math.abs(trajectorySlope - axisSlope) < 1e-10) {
                return true; // Parallel lines, allow movement
            }
            
            const targetX = (axisIntercept - trajectoryIntercept) / (trajectorySlope - axisSlope);
            targetY = axisSlope * targetX + axisIntercept;
        }
        
        // Check if target position is within bounds
        return targetY >= lruCircle.bounds.lower && targetY <= lruCircle.bounds.upper;
    }

    updateLRUCircle() {
        
        const circles = this.controller.getCircles();
        const moveHistory = this.controller.getMoveHistory();
        const axisCoordsMap = this.controller.getAxisCoordsMap();
        
        if (circles.length < 3) return true; // Allow movement if not enough circles
        
        const mostRecent = circles[moveHistory[0] - 1];
        const secondRecent = circles[moveHistory[1] - 1];
        const lruCircle = circles[moveHistory[2] - 1];
        
        const pos1 = this.getCirclePosition(mostRecent);
        const pos2 = this.getCirclePosition(secondRecent);
        
        const lruAxisData = Object.values(axisCoordsMap)[moveHistory[2] - 1];
        
        let targetX, targetY;
        
        if (!isFinite(lruCircle.slope)) {
            // Vertical axis - find intersection with trajectory line at axis X coordinate
            const axisX = (lruAxisData.xMin + lruAxisData.xMax) / 2;
            
            // Calculate trajectory line equation: y = mx + b
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            
            // Find Y at axis X coordinate
            targetY = trajectorySlope * axisX + trajectoryIntercept;
            targetX = axisX;
        } else {
            // Finite slope axis - find closest point on axis line to trajectory line
            // Use line intersection between trajectory and extended axis line
            
            // Trajectory line parameters
            const trajectorySlope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
            const trajectoryIntercept = pos1.y - trajectorySlope * pos1.x;
            
            // Axis line parameters
            const axisSlope = lruCircle.slope;
            const axisIntercept = lruCircle.intercept;
            
            // Find intersection: trajectorySlope * x + trajectoryIntercept = axisSlope * x + axisIntercept
            if (Math.abs(trajectorySlope - axisSlope) < 1e-10) {
                // Lines are parallel, use current position
                return true; // Allow movement
            }
            
            targetX = (axisIntercept - trajectoryIntercept) / (trajectorySlope - axisSlope);
            targetY = axisSlope * targetX + axisIntercept;
        }
        
        // Check if the target position would be within bounds
        if (targetY < lruCircle.bounds.lower || targetY > lruCircle.bounds.upper) {
            // Target position is out of bounds - prevent movement
            return false;
        }
        
        // Target position is valid - proceed with movement
        this.moveCircleToPosition(lruCircle, targetX, targetY);
        return true; // Allow movement
    }
}
