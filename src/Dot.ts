export class Dot {
    private x: number;  // x-coordinate of the dot
    y: number;  // y-coordinate of the dot
    dx: number;  // (delta of X) speed in the x-direction
    dy: number;  // (delta of y) speed in the y-direction
    radius: number;  // radius of the dot
    color: string;  // color of the dot
    spawnX: number;  // x-coordinate of the dot's spawn point
    spawnY: number;  // y-coordinate of the dot's spawn point
    height: number;  // Height of the canvas
    width: number;
    // Gravity constant to simulate gravity effect
    readonly gravity = 0.1;
    // Friction factor to simulate friction effect
    readonly friction = 0.98;

    constructor(x: number, y: number, dx: number, dy: number, height: number, width: number) {
        // Initialize the dot with given values
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = Math.floor(Math.random() * 50);  // Set a random radius
        this.color = this.generateRandomColor();  // Set a random color
        this.spawnX = x;  // Set the spawn point's x-coordinate
        this.spawnY = y;  // Set the spawn point's y-coordinate
        this.height = height;  // Assign the height of the canvas
        this.width = width; // Assign the width of the canvas
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Calculate distance from spawn point using Pythagorean theorem
        const distanceToSpawn = Math.sqrt((this.x - this.spawnX) ** 2 + (this.y - this.spawnY) ** 2);
        // Calculate a new radius, reducing based on distance from spawn point
        // Allows you to reduce the radius of the point the more the distance increases
        const radius = Math.max(1, this.radius - distanceToSpawn / 10);
        // Calculate gradient intensity based on the distance
        const gradientIntensity = this.calculateGradientIntensity(distanceToSpawn);
        // Create a radial gradient with inner and outer.
        const gradient = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, radius);
        gradient.addColorStop(0, this.color);  // Set the dot color
        gradient.addColorStop(1, `rgba(255, 255, 255, ${gradientIntensity})`);  // Set the gradient's transparency
        ctx.fillStyle = gradient;  // Set the fill style to the gradient
        ctx.beginPath();  // Start drawing a path
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);  // Draw a circle
        ctx.fill();  // Fill the circle with the gradient
    }

    drawTrail(ctx: CanvasRenderingContext2D, trailLength: number) {
       // debugger;
        if (this.dy < 0) {
            // Set trail opacity
            const trailOpacity = 0.30;
            // Calculate trail end coordinates
            const trailEndX = this.x - this.dx * trailLength;
            const trailEndY = this.y - this.dy * trailLength;
            ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;  // Set trail color and opacity
            ctx.lineWidth = this.radius / 8;  // Set trail line width
            ctx.beginPath();  // Start drawing a path
            ctx.moveTo(this.x, this.y);  // Move to the dot's current position
            ctx.lineTo(trailEndX, trailEndY);  // Draw a line to the trail's end
            ctx.stroke();  // Draw the trail

        }
    }
        
    drawStar(ctx: CanvasRenderingContext2D, starNumbers: number) {
        for (let i = 0; i < starNumbers; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 255, 255)';         
            ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    update() {
        // Apply gravity
        this.dy += this.gravity;
        // Apply friction
        this.dx *= this.friction;
        this.dy *= this.friction;
        // Update the dot's position based on its speed
        this.x += this.dx;
        this.y += this.dy;
        // Bounce when hitting the bottom
        if (this.y + this.radius > this.height) {
            this.dy = -this.dy * 0.8;  // Reverse and reduce speed
            this.y = this.height - this.radius;
        }
        // Bounce when hitting right side of screen
        if (this.x + this.radius > this.width) {
            this.dx = -this.dx * 0.8;
            this.x = this.width - this.radius;
        }
        // Bounce when hitting left side of screen
        if (this.x - this.radius < 0) {
            this.dx = this.dx * 0.8;
            this.x = this.radius;
        }
    }

    // Generate a random RGB color
    generateRandomColor(): string {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    }

    // Calculate gradient intensity based on the distance
    calculateGradientIntensity(distance: number): number {
        const maxDistance = 100;
        return Math.min(1, 1 - distance / maxDistance);
    }
}