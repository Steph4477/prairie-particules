import "./style.css";
import { Dot } from "./Dot";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;
const ctx = canvas.getContext("2d")!;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const maxDotsInCluster = 100;
const clusterRadius = 30;
const context = new AudioContext();
const masterVolume = context.createGain();

let dots: Dot[] = [];

// Connect the master volume to the final audio destination.
masterVolume.connect(context.destination);
// Set the gain (volume) of the master volume to 0.1 at the starting time (0 seconds).
masterVolume.gain.setValueAtTime(0.01, 0);

// Function to create a custom sound using a square sound
function createCustomSound(frequency: number, duration: number) {
    const oscillator = context.createOscillator();
    oscillator.type = "square"; // examples:sine, square, sawtooth, triangle
    oscillator.frequency.setValueAtTime(frequency, 0);
    oscillator.connect(masterVolume);
    oscillator.start(0);
    oscillator.stop(context.currentTime + duration);
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000000');  // black/top
    gradient.addColorStop(1, '#000033');  // blue/bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function drawBackgroundStars() {
    drawBackground();
    const starNumbers = 100;
    ctx.fillStyle = 'white';
    for (let i = 0; i < starNumbers; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height / 2;
        const radius = Math.random();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawParticles() {
    for (const dot of dots) {
        const trailLength = 20;
        dot.update();
        dot.draw(ctx);
        dot.drawTrail(ctx, trailLength);
    }
}

function createCluster(x: number, y: number) {
    const numberOfDots = Math.random() * maxDotsInCluster;
    for (let i = 0; i < numberOfDots; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * clusterRadius;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const dot = new Dot(x, y, dx, dy, height, width);
        const frequency = 100 + numberOfDots * 10;
        dots.push(dot);
        createCustomSound(frequency, 0.4);
    }
}

addEventListener('click', (event) => {
    createCluster(event.clientX, event.clientY);  
});

function updateAndDrawParticles() {
    ctx.clearRect(0, 0, width, height);
    drawBackgroundStars();
    drawParticles();
    requestAnimationFrame(updateAndDrawParticles);
}

updateAndDrawParticles();
