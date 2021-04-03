import Entity from "./Entity";
import Simulation from "../Simulations/Simulation";

export default class Shot extends Entity {
    private readonly red: number = 0;
    private readonly green: number = 0;
    private readonly blue: number = 0;
    private readonly simulation: Simulation;

    private readonly SPEED: number = 8;

    constructor(
        posX: number,
        posY: number,
        rotation: number,
        red: number,
        green: number,
        blue: number,
        simulation: Simulation
    ) {
        super(posX, posY, 15, 15);

        this.rotation = rotation;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.simulation = simulation;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.arc(this.posX, this.posY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        this.drawCollisionBox(ctx);
    }

    update(deltaTime: number): void {
        this.posX += Math.cos(this.rotation * Math.PI / 180) * this.SPEED * this.simulation.getSpeed();
        this.posY += Math.sin(this.rotation * Math.PI / 180) * this.SPEED * this.simulation.getSpeed();

        if (this.posX > 600 || this.posX < 0 || this.posY > 600 || this.posY < 0) {
            this.simulation.removeEntity(this);
        }

        // check for collisions
        this.simulation.getAllFighter().forEach(fighter => {
            if (this.collidesWith(fighter)) {
                fighter.kill();
                this.simulation.removeEntity(this);
                this.simulation.lose(fighter);
            }
        });
    }

}