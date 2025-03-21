function generateNoisyPoints(mean, std){
    const points = [];
    for (let i = 0; i < 20; i++) {
        // Generate a random value using the Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const sample = mean + z * std; // Scale and shift to match the desired distribution
        points.push(sample);
    }
    return points;
}

const mean = 100;
const std = 15;
const sampledPoints = generateNoisyPoints(mean, std);
console.log(sampledPoints);
const maxNum = Math.max(...sampledPoints);
console.log("Max:", maxNum);

// Find the minimum number
const minNum = Math.min(...sampledPoints);
console.log("Min:", minNum);